# NHLSTATS App

This is my Capstone project for Springboard/UMASS Global Software Engineering Bootcamp. This app provides an easy place to look up National Hockey League (NHL) hockey stats, track watched players and teams & playoffs information.

## APIs used

This app makes heavy use of the NHL's API, which is documented here: https://gitlab.com/dword4/nhlapi/-/blob/master/stats-api.md

## Tech stack used

This back end portion uses NodeJS, Express, & Postgresql.

### Backend Routes

#### Auth

    POST /auth/token

This route takes username & password and returns a token. This route is used for logging in a user.

    POST /auth/register

Route for signing up a user. Required data includes username, password, firstName, lastName, email & team.

#### Players

    GET /players

Route will return players array with ID & name.
Query options: nameLike
Pagination: limit, page

Query will 404 if not found.

    GET /players/:id

This route will return information on a signle player, with given player id. 404's if not found.

#### Teams

    GET /teams

This route will retrieve all teams from the DB.

    GET /teams/:id/roster

Retrieves roster data for provided team id.

    GET /teams/:id

Retreieves team data for provided team id.

#### Users

    POST /users

This route will be used for ADMINs only to create other users. Admins can create other admins. Authentication required: admin only. Outputs a user & a user token.

    POST /users/:username/players/:playerId

This route will add a player of player Id to the user's favorite player list. Auth required: correct user OR admin

    DELETE /users/:username/players/:playerId

This route will delete a player of player Id to the user's favorite player list. Auth required: correct user OR admin

    GET /users/:username/players

Retrieves listing of user's favorite players. Auth required: username matches logged in user OR admin. returns {favorites: [id, id...]}

    PATCH /users/:username

Route for editing user data. Data can iclude {firstName, lastName, password, email, favTeamId} and returns edited user data. Auth required: username matches logged in user or admin.

    POST /users/:username/teams/:teamId 

This route will add teamId to user's watched teams. Error if team Id is invalid. Auth: username matches logged in user OR admin.

    DELETE /users/:username/teams/:teamId

Removes team from User's watched teams. Error if Id is invalid. Auth: username matches logged in user OR admin.

    GET /users/:username/teams

Returns list of user's team watch list. Error if username does not exist. Auth: User OR Admin

    GET /users/:username

Returns user data, auth required: User OR Admin

    DELETE /users/:username

This route is for account deletion. It is not meant to be implemented on the front end, and is only used for testing.


