"use strict";
const express = require('express');
const router = new express.Router();
const Team = require('../models/teams');
const { ensureCorrectUserOrAdmin, ensureCorrectUser, ensureAdmin } = require("../middleware/auth");

router.get('/', async function(req, res, next){
    try {
        const results = await Team.getTeams();
        console.log(results.map(r=>r.name));
        return res.json({teams: [...results.map(r=>r.name)]})
    } catch (err) {
        return next(err);
    }
})

module.exports = router;