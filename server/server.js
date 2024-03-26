import {adminCheck, loginCheck} from 'middleware.js';
import {gameMoveSchema, commentSchema, chatroomSchema, gameSchema, userSchema, users, games, chatrooms, gameMoves, comments} from 'schema.js';

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const convert = require('xml2json');
const session = require('express-session');
const bcrypt = require('bcrypt');
const saltRounds = 10;          // hashing rounds, the higher safer but more time consuming

app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
mongoose.set('strictQuery', true);

mongoose.connect('mongodb+srv://stu087:p877630W@cluster0.qsanyuv.mongodb.net/stu087'); // change it to other desired connect string if needed
const db = mongoose.connection;
// connect to MongoDB
db.on('error', console.error.bind(console,'Connection error:'));
db.once('open', () => {
    console.log('DB connected');

    app.all('/*', (req, res) => {
        res.status(404).redirect('/');
    })

    }
);

const server = app.listen(80);