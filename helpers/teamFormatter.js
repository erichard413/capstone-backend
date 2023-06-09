// This function will take in team data from the API, and format the data.

function teamFormatter(teamData) {
    return teamData.map(team => ({
        id: team.id,
        name: team.name,
        url: team.officialSiteUrl,
        city: team.venue.city,
        venue: team.venue.name,
        abbreviation: team.abbreviation,
        shortName: team.teamName,
        division: team.division.name,
        conference: team.conference.name
    }))
}


// const mock = [
// 	{
// 		"id": 6,
// 		"name": "Boston Bruins",
// 		"link": "/api/v1/teams/6",
// 		"venue": {
// 			"id": 5085,
// 			"name": "TD Garden",
// 			"link": "/api/v1/venues/5085",
// 			"city": "Boston",
// 			"timeZone": {
// 				"id": "America/New_York",
// 				"offset": -4,
// 				"tz": "EDT"
// 			}
// 		},
// 		"abbreviation": "BOS",
// 		"teamName": "Bruins",
// 		"locationName": "Boston",
// 		"firstYearOfPlay": "1924",
// 		"division": {
// 			"id": 17,
// 			"name": "Atlantic",
// 			"nameShort": "ATL",
// 			"link": "/api/v1/divisions/17",
// 			"abbreviation": "A"
// 		},
// 		"conference": {
// 			"id": 6,
// 			"name": "Eastern",
// 			"link": "/api/v1/conferences/6"
// 		},
// 		"franchise": {
// 			"franchiseId": 6,
// 			"teamName": "Bruins",
// 			"link": "/api/v1/franchises/6"
// 		},
// 		"shortName": "Boston",
// 		"officialSiteUrl": "http://www.bostonbruins.com/",
// 		"franchiseId": 6,
// 		"active": true
// 	}
// ]

module.exports = {teamFormatter}