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
	finalBoard: { type: [Number], default: [...new Array(19 * 19).fill(-1)] }, // 0: white, 1: black
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
	games: [{ type: mongoose.Schema.Types.ObjectId, ref: "Game" }],
	adminRight: { type: Boolean, required: true, default: false }
});
const User = mongoose.model('User', userSchema);

export {
	GameMoves,
	Game,
	User
};