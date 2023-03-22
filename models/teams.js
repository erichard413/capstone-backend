"use strict";

const {NHLAPI_BASE_URL} = require('../apis/apis');
const axios = require('axios');

class Team {
    // this will make an axios call to the NHL API, then format all relevent data to sent to the front end.
    static async getTeams() {
        try {
            const result = await axios.get(`${NHLAPI_BASE_URL}/teams`);
            console.log(result.data.teams)
            return result.data.teams;
        } catch (err) {
            console.error(`UNABLE TO FETCH DATA FROM API`);
        }
    };
}

module.exports = Team;