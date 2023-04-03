// "use strict";
// const {NHLAPI_BASE_URL} = require('../apis/apis');
// const axios = require('axios');
// const players = require('@nhl-api/players');
// const Players = require('../models/players');
// const { getPlayerId, getPlayerMugshot } = require('@nhl-api/players');
// const {playerFormatter} = require('./playerFormatter');

// const playerArr = [];

// async function saveToDB(playerArr) {
//     await Players.savePlayers(playerArr);
//     return;
// }

// async function getPlayerData(arr, idx) {
//     let upperIdx;
//     if (idx + 50 < arr.length) {
//         upperIdx = idx+50;
//     } else {
//         upperIdx = arr.length;
//     }
//     console.log(`make an api call:`, arr.slice(idx, upperIdx));
//     Promise.allSettled(arr.slice(idx, upperIdx).map(async (p) => {
//         try {
//             const res = await axios.get(`${NHLAPI_BASE_URL}/people/${p}`);
//             playerArr.push(...res.data.people);
//         } catch (err) {
//             console.log(playerArr.length)
//             console.log(err);
//         }
//     }))
//     // const res = await axios.get(`${NHLAPI_BASE_URL}/people/${arr[0]}`);
//     // playerArr.push(...res.data.people);
//     // console.log(playerArr);
// }

// async function retrievePlayers() {
//     let idx = 0;
//     const playerIds = players.default.map(p => p.id);
//     await getPlayerData(playerIds, idx)
//     while (idx < playerIds.length) {
//         await getPlayerData(playerIds, idx)
//         idx += 50;
//     }
//     console.log(playerArr);
//     return playerArr;
// }

// module.exports = {retrievePlayers}; 
