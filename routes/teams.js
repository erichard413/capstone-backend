"use strict";
const express = require('express');
const router = new express.Router();
const Team = require('../models/teams');
const {teamFormatter} = require('../helpers/teamFormatter');
const { ensureCorrectUserOrAdmin, ensureCorrectUser, ensureAdmin } = require("../middleware/auth");

router.get('/', async function(req, res, next){
    try {
        const results = await Team.getTeams();
        return res.json({teams: teamFormatter(results)})
    } catch (err) {
        return next(err);
    }
})

router.get('/:id/roster', async function(req, res, next){
    try {
        const results = await Team.getRoster(req.params.id);
        return res.json(results);
    } catch(err) {
        return next(err);
    }
})

router.get('/:id', async function(req, res, next){
    try {
        const results = await Team.getTeam(req.params.id);
        return res.json({team: {...teamFormatter(results)[0]}});
    } catch(err) {
        return next(err);
    }
})

module.exports = router;