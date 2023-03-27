"use strict";

const express = require('express');
const router = new express.Router();
const Players = require('../models/players');
const { ensureCorrectUserOrAdmin, ensureCorrectUser, ensureAdmin } = require("../middleware/auth");

// commenting this out for now -> route was made for development.

// router.get('/saveplayers', async function(req, res, next){
//     try {
//         let output = {}
//         const results = await Players.saveAllPlayers();
//         results.map(player => (output[player.id] = player));
//         return res.json(output)
//     } catch (err) {
//         return next(err);
//     }
// })

/** GET /players
 *  this route will get all players from our DB.
 * 
 * {"8467950": {
		"playerId": 8467950,
		"teamId": 7,
		"name": "Craig Anderson",
		"jerseyNumber": 41,
		"position": "Goalie",
		"type": "Goalie",
		"posAbbr": "G"
 * }, ...}
 * 
 * 404 Not found if error.
 */
router.get('/', async function (req, res, next) {
    try {
        let output = {}
        const results = await Players.getPlayers();
        results.map(player=> (output[player.playerId] = player));
        return res.json(output);
    } catch(err) {
        return next(err);
    }
})

/** GET /players/id
 * 
 * this route will return information on a single player, with given player ID.
 * 
 * 404 not found if error.
 * 
 * {
	"8470595": {
		"playerId": 8470595,
		"teamId": 13,
		"name": "Eric Staal",
		"jerseyNumber": 12,
		"position": "Center",
		"type": "Forward",
		"posAbbr": "C"
	}
}
 */
router.get('/:playerId', async function (req, res, next) {
    try {
        let output = {}
        const results = await Players.getPlayer(req.params.playerId);
        output[req.params.playerId] = results
        return res.json(output);
    } catch(err) {
        return next(err);
    }
})


module.exports = router;