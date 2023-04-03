// this function will take in passed player data and format it.

function playerFormatter(playerData) {
    console.log(playerData)
    let output = {
            fullName: playerData.fullName || null,
            firstName: playerData.firstName || null,
            lastName: playerData.lastName || null,
            primaryNumber: playerData.primaryNumber || null,
            birthDate: playerData.birthDate || null,
            currentAge: playerData.currentAge || null,
            birthCity: playerData.birthCity || null,
            birthCountry: playerData.birthCountry || null,
            nationality: playerData.nationality || null,
            height: playerData.height || null,
            weight: playerData.weight || null,
            active: playerData.active || null,
            alternateCaptain: playerData.alternateCaptain || null,
            captain: playerData.captain || null,
            rookie: playerData.rookie || null,
            shootsCatches: playerData.shootsCatches || null,
            rosterStatus: playerData.rosterStatus || null,
            currentTeam: playerData.currentTeam['id'] || null,
            currentTeamName: playerData.currentTeam['name'] || null,
            primaryPosition: playerData.primaryPosition['name'] || null,
            primaryPositionCode: playerData.primaryPosition['code'] || null,
            primaryPositionType: playerData.primaryPosition['type'] || null,
            primaryPositionAbbr: playerData.primaryPosition['abbreviation'] || null
        }
    return output;
}

module.exports = {playerFormatter}

// {
// 	"copyright": "NHL and the NHL Shield are registered trademarks of the National Hockey League. NHL and NHL team marks are the property of the NHL and its teams. © NHL 2023. All Rights Reserved.",
// 	"people": [
// 		{
// 			"id": 8475287,
// 			"fullName": "Erik Haula",
// 			"link": "/api/v1/people/8475287",
// 			"firstName": "Erik",
// 			"lastName": "Haula",
// 			"primaryNumber": "56",
// 			"birthDate": "1991-03-23",
// 			"currentAge": 32,
// 			"birthCity": "Pori",
// 			"birthCountry": "FIN",
// 			"nationality": "FIN",
// 			"height": "5' 11\"",
// 			"weight": 191,
// 			"active": true,
// 			"alternateCaptain": false,
// 			"captain": false,
// 			"rookie": false,
// 			"shootsCatches": "L",
// 			"rosterStatus": "Y",
// 			"currentTeam": {
// 				"id": 1,
// 				"name": "New Jersey Devils",
// 				"link": "/api/v1/teams/1"
// 			},
// 			"primaryPosition": {
// 				"code": "L",
// 				"name": "Left Wing",
// 				"type": "Forward",
// 				"abbreviation": "LW"
// 			}
// 		}
// 	]
// }