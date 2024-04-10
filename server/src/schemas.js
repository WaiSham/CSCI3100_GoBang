import mongoose from "mongoose";

const gameMoveSchema = new mongoose.Schema({
	x: { type: Number, required: true },
	y: { type: Number, required: true },
	timeUsed: { type: Number, required: true }
});
const GameMoves = mongoose.model('GameMoves', gameMoveSchema);

const gameSchema = new mongoose.Schema({
	startTime: { type: Date, required: true },
	elapsedTime: { type: Number, default: 0 },
	gameMode: { type: String, required: true },
	timeControl: { type: String },
	timeIncrement: { type: Number },
	moves: [{ type: mongoose.Schema.Types.ObjectId, ref: "GameMoves" }],
	playerBlack: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
	playerWhite: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
	finalBoard: { type: String }, // maybe record the board in HEX
	retractingMove: { type: Number }, // Move number
	result: { type: String } // white, black
});
const Game = mongoose.model('Game', gameSchema);

const userSchema = new mongoose.Schema({
	// userID: { type: Number, required: true, unique: true },
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true }, // will change to hashed password soon
	theme: { type: String },
	soundEffect: { type: String },
	friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
	games: [{ type: mongoose.Schema.Types.ObjectId, ref: "Game" }]
});
const User = mongoose.model('User', userSchema);

export {
	GameMoves,
	Game,
	User
};