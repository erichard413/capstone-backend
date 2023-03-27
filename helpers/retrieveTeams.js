"use strict";

const {NHLAPI_BASE_URL} = require('../apis/apis');
const db = require("../db");
const axios = require('axios');

const players = [];

async function retrievePlayers(teamId) {
    // get full roster from team
    const result = await axios.get(`${NHLAPI_BASE_URL}/teams/${teamId}/roster`);
    result.data.roster.forEach(r=> players.push({name: r.person.fullName, team: teamId, jerseyNumber: r.jerseyNumber, id: r.person.id, position: r.position.name, type: r.position.type, posAbbr: r.position.abbreviation}));
    return players;
}


async function retrieveTeams() {
    // get teams from database
    const result = await db.query(`SELECT team_id AS "teamId" FROM teams`);
    // make API call for each team roster
    const teamIds = result.rows.map(team => team.teamId);
    await Promise.all(teamIds.map(async (id) => {
        await retrievePlayers(id);
        }))
    return players;
}

module.exports = {retrieveTeams}