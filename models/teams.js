"use strict";

const {NHLAPI_BASE_URL} = require('../apis/apis');
const axios = require('axios');
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
} = require('../expressError');

class Team {

    // this will make an axios call to the NHL API, then format all relevent data to send to the front end.
    static async getTeams() {
        try {
            const result = await axios.get(`${NHLAPI_BASE_URL}/teams`);
            return result.data.teams.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
        } catch (err) {
            console.error(`UNABLE TO FETCH DATA FROM API`);
        }
    };
    // API call to retrieve a single team, based on ID.
    static async getTeam(teamId) {
        try {
            const result = await axios.get(`${NHLAPI_BASE_URL}/teams/${teamId}`);
            return result.data.teams;
        } catch (err) {
            throw new NotFoundError(err);
        }
    }

    // this will make an axios call to the NHL API roster endpoint, and format all relevent roster information.
    static async getRoster(teamId) {
        try {
            await axios.get(`${NHLAPI_BASE_URL}/teams/${teamId}`);
        } catch(err) {
            throw new NotFoundError(`No team name of ID ${teamId}`)
        }

        try {
            const result = await axios.get(`${NHLAPI_BASE_URL}/teams/${teamId}/roster`);
            return result.data.roster;
        } catch (err) {
            console.error(`UNABLE TO FETCH DATA FROM API`);
        }
    }
}

module.exports = Team;