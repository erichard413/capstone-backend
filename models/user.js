"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");

const {
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
} = require('../expressError');

const { BCRYPT_WORK_FACTOR } = require('../config.js');

class User {
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

    static async register ({username, password, firstName, lastName, email, favTeamId, isAdmin}) {
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

    static async addFavoritePlayer(username, playerId) {
        const result = await db.query(
            `INSERT INTO fav_players 
            (username, player_id)
            VALUES ($1, $2) RETURNING username, player_id`, [username, playerId]);
        return result.rows[0];
    }
}

module.exports = User;