import express from "express";
import session from "express-session";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import { Game, GameMoves, User } from "./schemas.js";
import { StatusCodes } from "http-status-codes";
import ExpressWs from "express-ws";

const app = express();
ExpressWs(app);

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
    secret: 'CSCI3100 Group F7',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 15 * 60 * 1000 } // 15 mins
}));

function isAuthenticated(req, res, next) {
    if (req.session.userID) {
        next();
    } else {
        res.status(StatusCodes.UNAUTHORIZED).json({
            ok: false,
            msg: "Guest access is not allowed."
        });
    }
};

function isAdmin(req, res, next) {
    User.findById(req.session.userID)
        .then((user) => {
            console.log(user);
            if (user.adminRight) next();
            else res.status(StatusCodes.UNAUTHORIZED).json({
                ok: false,
                msg: "No admin rights."
            })
        });
};

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
});

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
    query.populate([
        {
            path: "games",
            populate: [{
                path: "playerBlack",
                select: "username"
            },
            {
                path: "playerWhite",
                select: "username"
            }
            ]
        },
        {
            path: "friends",
            select: "username"
        }
    ])
        .then(async (user) => {
            if (user === null) {
                res.status(StatusCodes.NOT_FOUND).json({
                    ok: false,
                    msg: "User not found."
                });
                return;
            }

            let resBody;
            if (req.session.userID === user.id || user.adminRight) {
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

app.get("/game/:gameID", async (req, res) => {
    const request_gameID = req.params["gameID"];
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

let lastMMPlayer;
let lastMMPlayerWS;
let playerWSMap = new Map();
app.ws("/ws", (ws, req) => {
    let userID;
    ws.on("message", async (msg) => {
        const payload = JSON.parse(msg);

        const type = payload.type;
        if (!type) {
            ws.send(JSON.stringify({
                ok: false,
                type: "typeMissing"
            }));
            return;
        }

        if (type === "auth") {
            userID = payload.data.userID;

            if (playerWSMap[userID]) {
                ws.send(JSON.stringify({
                    ok: false,
                    type: "auth",
                    reason: "tooManySessions"
                }));
                return;
            }

            playerWSMap[userID] = ws;

            ws.send(JSON.stringify({
                ok: true,
                type: "auth"
            }));
            return;
        }

        if (!userID) {
            ws.send(JSON.stringify({
                ok: false,
                type: payload.type,
                reason: "unauthorized"
            }));
            return;
        }

        switch (type) {
            case "MM":
                if (lastMMPlayer === userID) {
                    ws.send(JSON.stringify({
                        ok: false,
                        type: "MM",
                        reason: "alreadyInQueue"
                    }));
                    return;
                }

                const currentGameOfUser = await Game.findOne({
                    $or: [
                        { playerBlack: userID },
                        { playerWhite: userID }
                    ],
                    result: null
                });
                if (currentGameOfUser) {
                    ws.send(JSON.stringify({
                        ok: false,
                        type: "MM",
                        reason: "alreadyInGame"
                    }))
                    return;
                }

                if (!lastMMPlayer) {
                    lastMMPlayer = userID;
                    lastMMPlayerWS = ws;
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

                ws.send(JSON.stringify({
                    ok: true,
                    type: "MM",
                    data: {
                        opponent: lastMMPlayer,
                        gameID: game.id,
                        side: isSelfWhite ? "white" : "black"
                    }
                }));

                lastMMPlayerWS.send(JSON.stringify({
                    ok: true,
                    type: "MM",
                    data: {
                        opponent: userID,
                        gameID: game.id,
                        side: isSelfWhite ? "black" : "white"
                    }
                }));

                lastMMPlayer = null;
                lastMMPlayerWS = null;

                break;
            case "move":
                const gameID = payload.data.gameID;
                if (!gameID) {
                    ws.send(JSON.stringify({
                        ok: false,
                        type: "move",
                        reason: "gameIDMissing"
                    }));
                    return;
                }

                const x = payload.data.x;
                const y = payload.data.y;
                if (!x || !y) {
                    ws.send(JSON.stringify({
                        ok: false,
                        type: "move",
                        reason: "coordsMissing"
                    }));
                    return;
                }

                const timeUsed = payload.data.timeUsed;
                if (!timeUsed) {
                    ws.send(JSON.stringify({
                        ok: false,
                        type: "move",
                        reason: "timeUsedMissing"
                    }));
                    return;
                }

                const finalBoard = payload.data.finalBoard;
                if (!finalBoard) {
                    ws.send(JSON.stringify({
                        ok: false,
                        type: "move",
                        reason: "finalBoardMissing"
                    }));
                    return;
                }

                Game.findById(gameID)
                    .then(async (game) => {
                        if (!game) {
                            ws.send(JSON.stringify({
                                ok: false,
                                type: "move",
                                reason: "gameDoesNotExist"
                            }))
                            return;
                        }

                        if (game.result) {
                            ws.send(JSON.stringify({
                                ok: false,
                                msg: "move",
                                reason: "gameEnded"
                            }));
                            return;
                        }

                        if ((game.moves.length % 2 == 1 && game.playerWhite == userID) || (game.moves.length % 2 == 0 && game.playerBlack == userID)) {
                            GameMoves.create({
                                x,
                                y,
                                timeUsed
                            })
                                .then((move) => {
                                    game.moves.push(move._id);
                                    game.finalBoard = finalBoard;
                                    game.elapsedTime += move.timeUsed;
                                    game.save();

                                    ws.send(JSON.stringify({
                                        ok: true,
                                        type: "move"
                                    }));


                                });
                        } else {
                            ws.send(JSON.stringify({
                                ok: false,
                                type: "move",
                                reason: "notTurn"
                            }));
                        }
                    });
                break;
            default:
                ws.send(JSON.stringify({
                    ok: false,
                    type: "typeUnknown"
                }))
                break;
        }
    });

    ws.on("close", () => {
        playerWSMap.delete(userID);
    });
});

app.get("/admin/users", isAdmin, (req, res) => {
    // get all users info
    User.find({})
        .populate("games", "friends")
        .then((users) => {
            res.status(StatusCodes.OK).json({
                ok: true,
                data: users
            });
        });
});

app.delete("/user/:userID", isAdmin, (req, res) => {
    User.deleteOne({ id: req.params.userID })
        .then((err, _) => {
            if (err) res.status(StatusCodes.NOT_FOUND).json({
                ok: false,
                msg: "No such user or other errors"
            });
            else res.status(StatusCodes.OK).json({
                ok: true,
                msg: "User is deleted"
            });
        })
});

mongoose.connect("mongodb+srv://stu087:p877630W@cluster0.qsanyuv.mongodb.net/stu087");
mongoose.connection.once("open", () => app.listen(80));