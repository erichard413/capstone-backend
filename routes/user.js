"use strict";

const jsonschema = require("jsonschema");
const { createToken } = require("../helpers/tokens");
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const express = require('express');
const router = new express.Router();
const { ensureCorrectUserOrAdmin, ensureCorrectUser, ensureAdmin } = require("../middleware/auth");

const userNew = require('../schema/JSON-SCHEMA/userNew');
const userUpdate = require('../schema/JSON-SCHEMA/userUpdate.json');
const {BadRequestError} = require('../expressError');

/** POST /
 * 
 * This route will be used for ADMINS only to create users. Admins will be able to create other admin users.
 * 
 * will output: {user: {username, firstName, lastName, email, isAdmin }, token}
 * 
 * Auth required: admin.
 * 
 */
router.post('/', ensureAdmin, async function(req, res, next){
    try {
        const validator = jsonschema.validate(req.body, userNew);
        if(!validator.valid) {
            const errs = validator.errors.map(e=>e.stack);
            throw new BadRequestError(errs);
        }
        
        const user = await User.register(req.body);
        const token = createToken(user);
        return res.status(201).json({user, token});
    } catch (err) {
        return next(err);
    }
})


// POST /users/:username/players/:playerId -> this route will add a player of player ID to the user's favorite player list.
router.post('/:username/players/:playerId', ensureCorrectUserOrAdmin, async function(req, res, next){
    try {
        
        const username = req.params.username;
        const playerId = req.params.playerId;
        await User.addFavoritePlayer(username, playerId)
        return res.status(201).json({message: `Player added successfully!`})
    } catch (err) {
        return next(err);
    }
});
// DELETE /users/:username/players/:playerId -> this route will remove a player of player ID from the user's favorite player list.
router.delete('/:username/players/:playerId', ensureCorrectUserOrAdmin, async function(req, res, next){
    try {
        const username = req.params.username;
        const playerId = req.params.playerId;
        await User.removeFavoritePlayer(username, playerId);
        return res.json({message: `Player removed successfully!`})
    } catch (err) {
        return next(err);
    }
});

/** GET /users/:username/players -> this route will retrieve listing of users' favorite players.
 *  
 * Auth: requires username matches logged in user.
 * 
 * returns { favorites: [{playerId},{playerId}]}
 */ 

router.get('/:username/players', ensureCorrectUserOrAdmin, async function(req, res, next) {
    try {
        const username = req.params.username;
        const result = await User.getFavoritePlayers(username);
        let favoriteList = result.map(r => r.playerId);
        return res.json({favorites: favoriteList})
    } catch (err) {
        return next(err);
    }
})

/** PATCH /[username] {user} => {user}
 * 
 * Data can include:
 * {firstName, lastName, password, email, favTeamId}
 * 
 * returns {username, firstName, lastName, email, favTeamId, isAdmin}
 * Auth: admin or username matches logged in user.
 */
router.patch('/:username', ensureCorrectUserOrAdmin, async function(req, res, next){
    
    if (req.body.favTeamId) {
        req.body.favTeamId = +req.body.favTeamId;
    }
    
    try {
        const validator = jsonschema.validate(req.body, userUpdate);
        if (!validator.valid) {
            const errs = validator.errors.map(e=>e.stack);
            throw new BadRequestError(errs);
        }
        const user = await User.updateUser(req.params.username, req.body);
        return res.json({user});
    } catch(err){
        return next(err);
    }
})
/** POST /:username/teams/:id
 *  Route will add teamId to relation users_teams;
 * 
 *  Error if team ID is invalid.
 *  
 *  Auth: username matches logged in user.
 */
router.post('/:username/teams/:teamId', ensureCorrectUserOrAdmin, async function(req, res, next){
    try {
        const {username, teamId} = req.params;
        await User.addTeam(username, teamId);
        return res.json({message: `Team added successfully!`})
    } catch (err) {
        return next(err);
    }
})
/** DELETE /:username/teams/:id
 *  Route will remove teamId from relation users_teams;
 * 
 * Error if team Id is invalid.
 * 
 */
router.delete('/:username/teams/:teamId', ensureCorrectUserOrAdmin, async function(req, res, next){
    try {
        const {username, teamId} = req.params;
        await User.removeTeam(username, teamId);
        return res.json({message: `Team removed successfully!`})
    } catch (err) {
        return next(err);
    }
})

/** GET /:username/teams
 * Route will return list of user's team watch list;
 * 
 * Error if username is not existing
 * 
 * Auth required: correct user OR admin
 */

router.get('/:username/teams', ensureCorrectUserOrAdmin, async function (req, res, next){
    try {
        const {username} = req.params;
        const result = await User.getUserTeams(username);
        const output = {}
        Object.keys(result).map(key => (
            output[result[key].id] = result[key].name
        ))
        return res.json(output);
    } catch(err) {
        return next(err);
    }
})

/** GET /:username
 * 
 * Route will return user data
 * 
 * Auth required: correct user OR admin
 */
router.get('/:username', ensureCorrectUserOrAdmin, async function (req, res, next){
    try {
        const {username} = req.params;
        const result = await User.getUserData(username);
        return res.json(result);
    } catch(err) {
        return next(err);
    }
})
/** DELETE /:username
 * 
 * Route will not be implemented for front end. Should only be used for testing.
 * 
 * Auth required: correct user OR admin
 */
router.delete('/:username', ensureCorrectUserOrAdmin, async function (req, res, next){
    try {
        const {username} = req.params;
        await User.deleteUser(username);
        return res.json({message: "User deleted successfully!"});
    } catch(err) {
        return next(err);
    }
})

module.exports = router;