"use strict";

// const jsonschema = require("jsonschema");
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const express = require('express');
const router = new express.Router();

// const userAuthSchema = require('../schemas/userAuth.json');
// const userRegisterSchema = require('../schemas/userRegister.json');
const {BadRequestError} = require('../expressError');

// POST /users/:username/players/:playerId -> this route will add a player of player ID to the user's favorite player list.
router.post('/:username/players/:playerId', async function(req, res, next){
    try {
        const username = req.params.username;
        const playerId = req.params.playerId;
        await User.addFavoritePlayer(username, playerId)
        return res.json({message: `Player added successfully!`})
    } catch (err) {
        return next(err);
    }
})


module.exports = router;