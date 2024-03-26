const express = require('express');

const adminCheck = (req, res, next) => {
    if (req.session.admin)
        return next();
    else 
        res.status(401).json({
            requestAccepted: false,
            reason: '401 Unautorized (you don\'t have admin permission)'
        });
};
const loginCheck = (req, res, next) => {
    if (req.session.isLoggedIn)
        return next();
    else 
        res.status(401).redirect('/');
};

export default {adminCheck, loginCheck};