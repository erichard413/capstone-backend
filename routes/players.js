"use strict";
const express = require('express');
const router = new express.Router();
const Players = require('../models/players');
const { ensureCorrectUserOrAdmin, ensureCorrectUser, ensureAdmin } = require("../middleware/auth");

router.get('/', async function(req, res, next){
    try {
        
    } catch (err) {
        return next(err);
    }
})

module.exports = router;