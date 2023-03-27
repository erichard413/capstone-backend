"use strict";
const db = require("../db");
const {NHLAPI_BASE_URL} = require('../apis/apis');
const {retrieveTeams} = require('../helpers/retrieveTeams');
const axios = require('axios');
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
} = require('../expressError');

class Players {
    // this will get list of all players from API, format it for the front end and save to our database.
    static async saveAllPlayers() {
        try {
            const result = await retrieveTeams();
            result.forEach(async player => {
                await db.query(`DELETE FROM players`);
                await db.query (`
                INSERT INTO players  (player_id, team_id, full_name, jersey_num, position, type, posabbr)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                `, [player.id, player.team, player.name, player.jerseyNumber, player.position, player.type, player.posAbbr])
            })
            return result;
        } catch(err) {
            throw new NotFoundError;
        }
    }
    static async getPlayers() {
        try {
            const result = await db.query(`SELECT player_id AS "playerId", team_id AS "teamId", full_name AS "name", jersey_num AS "jerseyNumber", position, type, posabbr AS "posAbbr" FROM players`);
            return result.rows;
        } catch(err) {
            throw new NotFoundError;
        }
    }
    static async getPlayer(playerId) {
        const idCheck = await db.query(`SELECT full_name FROM players WHERE player_id=$1`, [playerId]);
        if (!idCheck.rows[0]) throw new NotFoundError(`No player id: ${playerId}`);

        try {
            const result = await db.query(`SELECT player_id AS "playerId", team_id AS "teamId", full_name AS "name", jersey_num AS "jerseyNumber", position, type, posabbr AS "posAbbr" FROM players WHERE player_id=$1`, [playerId]);
            return result.rows[0];
        } catch(err) {
            throw new NotFoundError;
        }
    }
}

module.exports = Players;