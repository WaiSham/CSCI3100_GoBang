import express from "express";
import session from "express-session";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import { Game, GameMoves, User } from "./schemas.js";
import { StatusCodes } from "http-status-codes";
import ExpressWs from "express-ws";

const app = express();
const expressWs = ExpressWs(app);

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
	secret: 'CSCI3100 Group F7',
	resave: false,
	saveUninitialized: true,
	cookie: { maxAge: 15 * 60 * 1000 } // 15 mins
}));

mongoose.set('strictQuery', true);

// ! middlewares

function isAuthenticated(req, res, next) {
	if (req.session.userID) next();
	else res.status(StatusCodes.UNAUTHORIZED).json({
		ok: false,
		msg: "Guest access is not allowed."
	});
};

// ! main

mongoose.connect('mongodb+srv://stu087:p877630W@cluster0.qsanyuv.mongodb.net/stu087'); // change it to other desired connect string if needed
const db = mongoose.connection;
// connect to MongoDB
db.on('error', console.error.bind(console, 'Connection error:'));

app.post('/register', async (req, res) => {
	const username = req.body.username;
	if (username === undefined) {
		res.status(StatusCodes.BAD_REQUEST).json({
			ok: false,
			msg: "Username not provided."
		});
		return;
	}

	const password = req.body.password;
	if (password === undefined) {
		res.status(StatusCodes.BAD_REQUEST).json({
			ok: false,
			msg: "Password not provided."
		});
		return;
	}

	// check existing user
	if (await User.countDocuments({ username }) > 0) {
		res.status(StatusCodes.BAD_REQUEST).json({
			ok: false,
			msg: "Username is used already."
		});
		return;
	}

	User.create({
		username,
		password,
	})
		.then(() => {
			res.status(StatusCodes.CREATED).json({
				ok: true,
				msg: "User created."
			})
		})
		.catch((reason) => {
			console.log("Create user failed: %s", reason);
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				ok: false,
				msg: "An unexpected error while creating user."
			})
		});
});

app.post('/login', (req, res) => {
	const username = req.body.username;
	if (username === undefined) {
		res.status(StatusCodes.BAD_REQUEST).json({
			ok: false,
			msg: "Username not provided."
		});
		return;
	}

	const password = req.body.password;
	if (password === undefined) {
		res.status(StatusCodes.BAD_REQUEST).json({
			ok: false,
			msg: "Password not provided."
		});
		return;
	}

	User.findOne({ username, password })
		.then(async (user) => {
			if (user === null) {
				res.status(StatusCodes.UNAUTHORIZED).json({
					ok: false,
					msg: "Incorrect username or password."
				});
				return;
			}

			req.session.regenerate(() => { });
			req.session.userID = user.id;
			req.session.save();

			res.status(StatusCodes.OK).json({
				ok: true,
				msg: "Login succeeded."
			});
		})
		.catch(() => {
			// SECURITY: DO NOT send the actual reason to the user to prevent
			// information leaking.
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				ok: false,
				msg: "An unexpected error occurred while obtaining user information."
			});
		})
}
);

app.post('/logout', (req, res) => {
	req.session.destroy(() => { });

	res.status(StatusCodes.OK).json({
		ok: true,
		msg: "Logout succeeded."
	});
});

app.get('/user', async (req, res) => {
	const username = req.query.username;
	const userID = req.query.userID;
	if (username === undefined && userID === undefined) {
		res.status(StatusCodes.BAD_REQUEST).json({
			ok: false,
			msg: "Username/user ID should be provided."
		});
		return;
	}

	// When both user ID and username are provided, user ID is used first.
	let query;
	if (userID !== undefined) query = User.findById(userID);
	else if (username !== undefined) query = User.findOne({ username });
	query.populate("games", "friends")
		.populate("playerBlack", "playerWhite", "moves")
		.then(async (user) => {
			if (user === null) {
				res.status(StatusCodes.NOT_FOUND).json({
					ok: false,
					msg: "User not found."
				});
				return;
			}

			let resBody;
			if (req.session.userID === user.id) {
				resBody = {
					userID: user.id,
					username: user.username,

					// TODO: games need opponent names as well, need populate
					games: user.games,

					friends: user.friends,
					soundEffect: user.soundEffect,
					theme: user.theme
				};
			} else {
				resBody = {
					userID: user.id,
					username: user.username,
					friends: user.friends
				}
			}
			res.status(StatusCodes.OK).json(resBody);
		});
});

let lastMMPlayer = null;
app.post("/joinMM", isAuthenticated, async (req, res) => {
	const userID = req.session.userID;

	if (lastMMPlayer === userID) {
		res.status(StatusCodes.BAD_REQUEST).json({
			ok: false,
			msg: "You are already matchmaking."
		})
		return;
	}

	const currentGameOfUser = await Game.findOne({
		$or: [
			{ playerBlack: userID },
			{ playerWhite: userID }
		],
		finalBoard: null
	});
	if (currentGameOfUser) {
		res.status(StatusCodes.CONFLICT).json({
			ok: false,
			msg: "You are already in a game."
		})
		return;
	}

	if (lastMMPlayer === null) {
		lastMMPlayer = userID;

		res.status(StatusCodes.ACCEPTED).json({
			ok: true,
			msg: "You are now matchmaking."
		})
		return;
	}

	const isSelfWhite = Math.random() > 0.5;
	// [white, black]
	let players = isSelfWhite ? [userID, lastMMPlayer] : [lastMMPlayer, userID];

	const game = await Game.create({
		startTime: Date.now(),
		gameMode: "P",
		playerWhite: players[0],
		playerBlack: players[1],
	});

	lastMMPlayer = null;

	res.status(StatusCodes.OK).json({
		ok: true,
		msg: "Matched.",
		data: {
			opponent: lastMMPlayer,
			gameID: game.id,
			side: isSelfWhite ? "white" : "black"
		}
	});
});

app.get("/MMStatus", isAuthenticated, async (req, res) => {
	const userID = req.session.userID;

	const currentGameOfUser = await Game.findOne({
		$or: [
			{ playerBlack: userID },
			{ playerWhite: userID }
		],
		result: null
	});

	if (!currentGameOfUser) {
		res.status(StatusCodes.OK).json({
			ok: true,
			data: {
				matched: false
			}
		});
		return;
	}

	res.status(StatusCodes.OK).json({
		ok: true,
		data: {
			matched: true,
			gameID: currentGameOfUser.id,
			side: currentGameOfUser.playerWhite.toString() === req.session.userID
				? "white"
				: "black"
		}
	});
});

app.get("/game/:gameID", async (req, res) => {
	const request_gameID = req.params['gameID'];
	Game.findById(request_gameID)
		.populate(["playerBlack", "playerWhite", "moves"])
		.then(async (game) => {
			res.status(StatusCodes.OK).json({
				ok: true,
				data: {
					startTime: game.startTime,
					elapseTime: game.elapsedTime,
					playerBlack: {
						id: game.playerBlack.id,
						username: game.playerBlack.username
					},
					playerWhite: {
						id: game.playerWhite.id,
						username: game.playerWhite.username
					},
					result: game.result,
					finalGoBoard: game.finalBoard
				}
			});
		})
		.catch(() => {
			res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
				ok: false,
				msg: "Unexpected error."
			})
		});
});


app.post("/move", isAuthenticated, (req, res) => {
	// check if the user sending request is the one making move
	const request_gameID = req.query.gameID;
	const request_userID = req.session.userID;
	const x = req.query.x;
	const y = req.query.y;
	const timeUsed = req.query.time;
	const request_finalBoard = req.query.board;

	Game.findById(request_gameID)
		.then(async (game) => {
			if (!game) {
				res.status(StatusCodes.BAD_REQUEST).json({
					ok: false,
					msg: "Game not exists."
				});
				return;
			}
			if (game.result) {
				res.status(StatusCodes.BAD_REQUEST).json({
					ok: false,
					msg: "Game already ended."
				});
				return;
			};
			if ((game.moves.length % 2 == 1 && game.playerWhite == request_userID) || (game.moves.length % 2 == 0 && game.playerBlack == request_userID)) {
				GameMoves.create({
					x,
					y,
					timeUsed
				})
					.then((move) => {
						game.moves.push(move._id);
						game.finalBoard = request_finalBoard;
						game.elapsedTime += move.timeUsed;
						game.save();
						res.status(StatusCodes.CREATED).json({
							ok: true,
							msg: "Move added to game."
						});
						return;
					})
					.catch((reason) => {
						console.log("Add move failed: %s", reason);
						res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
							ok: false,
							msg: "An unexpected error while making move."
						});
						return;
					});
			} else {
				res.status(StatusCodes.BAD_REQUEST).json({
					ok: false,
					msg: "Not allowed to make move."
				});
			}
		});
});

app.post("/addfriend/:userID", isAuthenticated, (req, res) => {

});

app.ws("/ws", (ws, req) => {
	let userID;

	ws.on("message", (msg) => {
		const payload = JSON.parse(msg);

		const type = payload.type;
		if (!type) {
			ws.send(JSON.stringify({
				ok: false,
				msg: "Missing type field."
			}));
			return;
		}

		switch (type) {
			case ""
		}
		userID = payload.userID;
		if (!userID) {

		}
	});

	ws.on("close")
})

db.once('open', () => {
	console.log('DB connected');
	app.listen(80);
});