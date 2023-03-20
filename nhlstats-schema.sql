
CREATE TABLE teams (
    team_id INTEGER PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE users (
    username VARCHAR(25) PRIMARY KEY,
    password TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL
        CHECK (position('@' IN email) > 1),
    team_id INTEGER REFERENCES teams,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE
);



CREATE TABLE users_teams (
    username VARCHAR(25) REFERENCES users ON DELETE CASCADE,
    team_id INTEGER REFERENCES teams ON DELETE CASCADE
);

CREATE TABLE fav_players (
    username VARCHAR(25) REFERENCES users ON DELETE CASCADE,
    player_id INTEGER NOT NULL
)
