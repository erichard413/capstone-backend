

INSERT INTO teams (team_id, name)
VALUES (1,
        'New Jesey Devils'
        ),
        (2,
        'New York Islanders'
        ),
        (3, 
        'New York Rangers'
        ),
        (4, 
        'Philadelphia Flyers'
        ),
        (5, 
        'Pittsburgh Penguins'
        ),
        (6, 
        'Boston Bruins'
        ),
        (7, 
        'Buffalo Sabres'
        ),
        (8, 
        'Montréal Canadiens'
        ),
        (9, 
        'Ottawa Senators'
        ),
        (10, 
        'Toronto Maple Leafs'
        ),
        (12, 
        'Carolina Hurricanes'
        ),
        (13, 
        'Florida Panthers'
        ),
        (14, 
        'Tampa Bay Lightning'
        ),
        (15, 
        'Washington Capitals'
        ),
        (16, 
        'Chicago Blackhawks'
        ),
        (17, 
        'Detroit Red Wings'
        ),
        (18, 
        'Nashville Predators'
        ),
        (19, 
        'St. Louis Blues'
        ),
        (20, 
        'Calgary Flames'
        ),
        (21, 
        'Colorado Avalanche'
        ),
        (22, 
        'Edmonton Oilers'
        ),
        (23, 
        'Vancouver Canucks'
        ),
        (24, 
        'Anaheim Ducks'
        ),
        (25, 
        'Dallas Stars'
        ),
        (26, 
        'Los Angeles Kings'
        ),
        (28, 
        'San Jose Sharks'
        ),
        (29, 
        'Columbus Blue Jackets'
        ),
        (30, 
        'Minnesota Wild'
        ),
        (52, 
        'Winnepeg Jets'
        ),
        (53, 
        'Arizona Coyotes'
        ),
        (54, 
        'Vegas Golden Knights'
        ),
        (55, 
        'Seattle Kraken'
        );
-- both test users have the password "password"

INSERT INTO users (username, password, first_name, last_name, email, team_id, is_admin)
VALUES ('testuser',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test',
        'User',
        'erik@erikrichard.com',
        6,
        FALSE),
       ('testadmin',
        '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
        'Test',
        'Admin!',
        'erik@erikrichard.com',
        6,
        TRUE);