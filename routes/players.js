"use strict";

const express = require('express');
const router = new express.Router();
const Players = require('../models/players');
const players = require('@nhl-api/players');
const {paginatedResults} = require('../helpers/paginatedResults');
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
 *  query options are nameLike & sort  *  pagination query options are page & limit
 * 
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
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)
    const sort = req.query.sort
    const direction = req.query.direction
    const nameLike = req.query.nameLike
    try {
        const results = await Players.getPlayers(sort, direction, nameLike);
        return res.json(paginatedResults(results, page, limit));
    } catch(err) {
        return next(err);
    }
})

/** GET /players/all
 * 
 * this route will return players array with ID & name.
 * 
 * query -> name like.
 * 
 * pagination -> limit & page
 * 
 * 404 if not found
 *  */

router.get('/all', async function (req, res, next) {
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)
    const nameLike = req.query.nameLike
    let data = players.default

    if (nameLike) {
        data = data.filter(p=> p.name.toLowerCase().includes(nameLike))
    }

    return res.json(paginatedResults(data, page, limit))
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
        const results = await Players.fetchPlayer(req.params.playerId);
        // output[req.params.playerId] = results
        return res.json(results);
    } catch(err) {
        return next(err);
    }
})





module.exports = router;