"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
} = require('../expressError');

const { BCRYPT_WORK_FACTOR } = require('../config.js');

class User {
    // Authenticate user with username & password
    static async authenticate(username, password) {
        const result = await db.query(
            `SELECT username,
                password, 
                first_name AS "firstName", 
                last_name AS "lastName",
                email,
                team_id AS "favTeamId",
                is_admin AS "isAdmin" 
                FROM users WHERE username = $1`, [username]
        );
        const user = result.rows[0];

        if (user) {
            //validate hash password to user inputted password
            const isValid = await bcrypt.compare(password, user.password);
            if (isValid === true) {
                delete user.password;
                return user;
            }
        }
        // if not, return error for invalid password/username
        throw new UnauthorizedError("Invalid username/password");
    }
    // registers new user
    static async register ({username, password, firstName, lastName, email, favTeamId=null, isAdmin}) {
        const duplicateCheck = await db.query(
            `SELECT username
            FROM users WHERE
            username = $1`, [username]
        );

        if (duplicateCheck.rows[0]) {
            throw new BadRequestError(`Username ${username} already exists!`);
        }

        const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
        const result = await db.query(
            `INSERT INTO users
            (username,
            password,
            first_name,
            last_name,
            email,
            team_id,
            is_admin)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING username,
            first_name AS "firstName",
            last_name AS "lastName",
            email,
            team_id AS "favTeamId",
            is_admin AS "isAdmin"`,
            [username, hashedPassword, firstName, lastName, email, favTeamId, isAdmin]
        );
        const user = result.rows[0];

        if (user.favTeamId) {
            await db.query(`
            INSERT INTO users_teams
            (username, team_id)
            VALUES ($1, $2)
            `, [username, favTeamId]);
        }

        return user;
    }
    // adds player to user's favorite player list
    static async addFavoritePlayer(username, playerId) {
        const result = await db.query(
            `INSERT INTO fav_players 
            (username, player_id)
            VALUES ($1, $2) RETURNING username, player_id`, [username, playerId]);
        return result.rows[0];
    }
    // removes player from user's favorite player list
    static async removeFavoritePlayer(username, playerId) {
        const result = await db.query(
            `DELETE FROM fav_players 
            WHERE username=$1 AND player_id=$2`, [username, playerId]);
        return result.rows[0];
    }
    // get player's favorite player list
    static async getFavoritePlayers(username) {
        const result = await db.query(
            `SELECT player_id AS "playerId"
            FROM fav_players
            WHERE username=$1`, [username]);
        return result.rows;
    }


    /** Update user data with 'data'
     * 
     * This function will take in data, and update our user on the back end. Not all data is required to be updated. This function will do a partial update.
     * 
     * data can include: {firstName, lastName, password, email, favTeamId, isAdmin}
     * 
     * returns {username, firstName, lastName, email, favTeamId, isAdmin}
     * 
     * throws error if username not found.
    */
    static async updateUser(username, data) {
        // encrypt the password, if data contains it.
        if (data.password) {
            data.password = await bcrypt(data.password, BCRYPT_WORK_FACTOR);
        }
        const { setCols, values } = sqlForPartialUpdate(data, 
            {
                firstName: "first_name",
                lastName: "last_name",
                favTeamId: "team_id",
                email: "email"
            });
        const usernameVarIdx = "$"+(values.length+1);
        const querySQL = `UPDATE users SET ${setCols} WHERE username=${usernameVarIdx} RETURNING username, first_name AS "firstName", last_name AS "lastName", team_id AS "favTeamId", email, is_admin AS "isAdmin"`;
        const result = await db.query(querySQL, [...values, username]);
        const user = result.rows[0];

        if (!user) throw new NotFoundError(`No user: ${username}`);

        delete user.password;
        return user;
    }
    /** Add team to user's watch list (users_teams)
     *  
     * throws error if teamId does not exist.
     * 
     */
    static async addTeam(username, teamId) {
        const teamCheck = await db.query(`SELECT name FROM teams WHERE team_id=$1`, [teamId]);
        if (!teamCheck.rows[0]) throw new NotFoundError(`No team id: ${teamId}`);

        const result = await db.query(`
        INSERT INTO users_teams
        (username, team_id)
        VALUES ($1, $2)
        `, [username, teamId]);
        return result.rows[0]
    }
    /** Remove team from user's watch list
     * 
     * throws error if teamId does not exist
     */
    static async removeTeam(username, teamId) {
        const teamCheck = await db.query(`SELECT name FROM teams WHERE team_id=$1`, [teamId]);
        if (!teamCheck.rows[0]) throw new NotFoundError(`No team id: ${teamId}`);

        await db.query(`
        DELETE FROM users_teams WHERE username=$1 AND team_id=$2
        `, [username, teamId])
        return
    }
    static async getUserTeams(username) {
        const userCheck = await db.query(`SELECT username FROM users WHERE username=$1`, [username]);
        if (!userCheck.rows[0]) throw new NotFoundError(`No username exists: ${username}`);

        const result = await db.query(`
        SELECT teams.team_id AS "id", teams.name FROM users_teams LEFT JOIN teams ON users_teams.team_id = teams.team_id WHERE users_teams.username=$1
        `, [username]);

        return result.rows
    }
    static async getUserData(username) {
        const result = await db.query(`SELECT username, first_name AS "firstName", last_name AS "lastName", email, team_id AS "favTeamId" FROM users WHERE username=$1`, [username]);
        if (!result.rows[0]) throw new NotFoundError(`No username ${username}`);

        return result.rows[0]
    }
}

module.exports = User;