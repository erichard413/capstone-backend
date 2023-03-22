"use strict";

/** middleware required for authentication routes */
const jwt = require("jsonwebtoken");
const {ACCESS_TOKEN_SECRET} = require('../config');
const {UnauthorizedError} = require('../expressError');

// Authenticating a user - If token, verify. If valid token store the token in res.locals.
function authenticateJWT(req, res, next) {
    try {
        const authHeader = req.headers && req.headers.authorization;
        if (authHeader) {
            //regex -> trim bearer/Bearer from token
            const token = authHeader.replace(/^[Bb]earer /, "").trim();
            res.locals.user = jwt.verify(token, ACCESS_TOKEN_SECRET);
        }
        return next();
    } catch (err) {
        return next();
    }
}

// Check for logged in user, raises error if no user.
function ensureLoggedIn(req, res, next) {
    try {
        if (!res.locals.user) throw new UnauthorizedError();
        return next();
    } catch (err) {
        return next(err);
    }
}

// Check if logged in user is admin. Returns unauthorized Error if not.
function ensureAdmin(req, res, next) {
    try {
        if (!res.locals.user || !res.locals.user.isAdmin) {
            throw new UnauthorizedError();
        }
        return next();
    } catch (err) {
        return next(err);
    }
}

// Check if logged in user matches route param, OR user is admin. If not, returns error Unauthorized.
function ensureCorrectUserOrAdmin(req,res,next){
    try {
        const user = res.locals.user;
        if (!(user && (user.isAdmin || user.username === req.params.username))) {
            throw new UnauthorizedError();
        }
        return next();
    } catch (err) {
        return next(err);
    }
}
// Check if logged in user matches route param. If not, returns error Unauthorized.
function ensureCorrectUser(req,res,next){
    try {
        const user = res.locals.user;
        if (!(user && (user.username === req.params.username))) {
            throw new UnauthorizedError();
        }
        return next();
    } catch (err) {
        return next(err);
    }
}

module.exports = {
    authenticateJWT,
    ensureLoggedIn,
    ensureAdmin,
    ensureCorrectUserOrAdmin,
    ensureCorrectUser
}
