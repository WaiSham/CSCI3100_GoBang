const mongoose = require('mongoose');

const gameMoveSchema = mongoose.Schema(
	{
		x: {type: Number, required: true},
		y: {type: Number, required: true},
		timeUsed_second: {type: Number}
	}
);


const commentSchema = mongoose.Schema(
	{
		userID: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
		userName: {type: String, required: true},
		message: {type: String, required: true}
	}
);

const chatroomSchema = mongoose.Schema(
	{
		chatroomID: {type: Number, required: true, unique: true},
		chatroomClosed: {type: Boolean, required: true},
		chats: [commentSchema]
	}
);

const gameSchema = mongoose.Schema(
	{
		gameID: {type: Number, required: true, unique: true},
		startTime: {type: Date, required: true},
		gameMode: {type: String, required: true},
		timeControl: {type: String},
		timeIncrement: {type: Number},
		moves: [gameMoveSchema],
		playerBlack: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
		playerWhite: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
		finalBoard: {type: String}, // maybe record the board in HEX
		retractingMove: {type: Number}, // Move number
		result: {type: Number},
		remarks: {type: String},
		chatroom: chatroomSchema
	}
);


const userSchema = mongoose.Schema(
	{
		userID: {type: Number, required: true, unique: true},
		userName: {type: String, required: true, unique: true},
		password: {type: String, required: true}, // will change to hashed password soon
		theme: {type: String},
		soundEffect: {type: String},
		friends: [userSchema],
		games: [gameSchema]
	}
);

const users = mongoose.model('User', userSchema);
const games = mongoose.model('Game', gameSchema);
const chatrooms = mongoose.model('Chatroom', chatroomSchema);
const gameMoves = mongoose.model('GameMoves', gameMoveSchema);
const comments = mongoose.model('Comment', commentSchema);

export default {gameMoveSchema, commentSchema, chatroomSchema, gameSchema, userSchema, users, games, chatrooms, gameMoves, comments};