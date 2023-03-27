\echo 'Delete and recreate nhlstats db?'
\prompt 'Return for yes or control-C to cancel > ' foo

\connect nhlstats
DROP TABLE users;
DROP TABLE teams;
DROP TABLE users_teams;
DROP TABLE fav_players;
DROP TABLE players;
DROP DATABASE nhlstats;
CREATE DATABASE nhlstats;
\connect nhlstats

\i nhlstats-schema.sql
\i nhlstats-seed.sql

\echo 'Delete and recreate nhlstats_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo
\connect nhlstats_test
DROP TABLE users;
DROP TABLE teams;
DROP TABLE users_teams;
DROP TABLE fav_players;
DROP TABLE players;
DROP DATABASE nhlstats_test;
CREATE DATABASE nhlstats_test;
\connect nhlstats_test

\i nhlstats-schema.sql
\i nhlstats-seed.sql
