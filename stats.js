export async function fetchPlayerStats(type) {
    let url;
    switch (type) {
        case 'goals':
            url = 'https://api-football-v1.p.rapidapi.com/v3/players/topscorers?league=39&season=2024';
            break;
        case 'assists':
            url = 'https://api-football-v1.p.rapidapi.com/v3/players/topassists?league=39&season=2024';
            break;
        case 'yellows':
            url = 'https://api-football-v1.p.rapidapi.com/v3/players/topyellowcards?league=39&season=2024';
            break;
        case 'reds':
            url = 'https://api-football-v1.p.rapidapi.com/v3/players/topredcards?league=39&season=2024';
            break;
        default:
            console.error("Invalid type");
            return;
    }

    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '4122381e1emshb8ba4169865822bp1b2f75jsnbdddd3ffcda1',
            'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        console.log(result);

        if (result.response && Array.isArray(result.response)) {
            result.response.slice(0, 20).forEach((playerData, index) => {
                renderPlayerStatItem(playerData, index + 1, type);
            });
        } else {
            console.error("API response structure unexpected or empty:", result);
        }
    } catch (error) {
        console.error("Failed to fetch player stats:", error);
    }
}
//*/

// Render player item based on type (goals, assists, reds, yellows)
export function renderPlayerStatItem(playerData, rank, type) {
    const playerName = playerData.player.name;
    const playerPhoto = playerData.player.photo;
    const playerNationality = playerData.player.nationality;

    const teamName = playerData.statistics[0].team.name;
    const teamLogo = playerData.statistics[0].team.logo;

    const playerAppearance = playerData.statistics[0].games.appearances;
    const playerMinutes = playerData.statistics[0].games.minutes;
    const playerPosition = playerData.statistics[0].games.position;

    const playerGoalsTotal = playerData.statistics[0].goals.total;
    const playerGoalsAssist = playerData.statistics[0].goals.assists;

    const playerYellowCards = playerData.statistics[0].cards.yellow;
    const playerYellowtoRed = playerData.statistics[0].cards.yellowred;
    const playerRedCards = playerData.statistics[0].cards.red;

    const playerPenaltyCommitted = playerData.statistics[0].penalty.commited;
    const playerTackles = playerData.statistics[0].tackles.total;

    const positionShort = positionConverter(playerPosition);

    // Declare variables for dynamic stats
    let mainStat, secondaryStat, additionalStat1, additionalStat2, label1, label2;

    // Calculate additional stats based on type
    if (type === 'goals') {
        mainStat = playerGoalsTotal;
        secondaryStat = playerGoalsAssist;
        additionalStat1 = playerMinutes / (playerGoalsTotal || 1); // GPM
        additionalStat2 = (playerData.statistics[0].shots.on / (playerData.statistics[0].shots.total || 1)) * 100; // SA%
        label1 = "MPG";
        label2 = "SA%";
    } else if (type === 'assists') {
        mainStat = playerGoalsAssist;
        secondaryStat = playerData.statistics[0].passes.key;
        additionalStat1 = playerMinutes / (playerGoalsAssist || 1); // MPA
        additionalStat2 = (playerData.statistics[0].dribbles.won / (playerData.statistics[0].dribbles.total || 1)) * 100; // SD%
        label1 = "MPA";
        label2 = "SD%";
    } else if (type === 'yellows') {
        mainStat = playerYellowCards;
        secondaryStat = playerYellowtoRed;
        additionalStat1 = playerPenaltyCommitted; // PC
        additionalStat2 = playerTackles; // T
        label1 = "PC";
        label2 = "T";
    } else if (type === 'reds') {
        mainStat = playerRedCards;
        secondaryStat = playerTackles;
        additionalStat1 = (playerData.statistics[0].duels.won / (playerData.statistics[0].duels.total || 1)) * 100; // Duel Win %
        additionalStat2 = playerYellowtoRed; // Y2R
        label1 = "DW%";
        label2 = "Y2R";
    }

    // Render the player item
    createPlayerItem(rank, playerPhoto, positionShort, playerName, teamLogo, teamName, mainStat, secondaryStat, additionalStat1, additionalStat2.toFixed(2), label1, label2, type);
}

// Helper function to convert position to short form
export function positionConverter(pos) {
    const positions = { "Attacker": "ST", "Midfielder": "MID", "Defender": "DEF", "Goalkeeper": "GK" };
    return positions[pos] || pos;
}

// Create HTML for player item
export function createPlayerItem(rank, playerImage, position, playerName, clubLogo, clubName, mainStat, secondaryStat, additionalStat1, additionalStat2, label1, label2, type) {
    const playerItem = document.createElement('div');
    
    // Assign classes based on type
    const typeClass = type === 'goals' ? 'player-item' :
                      type === 'assists' ? 'player-item-assist' :
                      type === 'yellows' ? 'player-item-yellow' :
                      type === 'reds' ? 'player-item-red' :
                      'player-item-cleansheet';
    playerItem.classList.add(typeClass);
    
    playerItem.innerHTML = `
        <div class="player-info">
            <span class="goal-rank">${rank}</span>
            <figure class="goals-player-image">
                <img src="${playerImage}" alt="Player Image" class="player-img">
            </figure>
            <div class="goal-position" style="display: none;">
                <h1>${position}</h1>
            </div>
            <div class="goals-name-club">
                <span class="goal-name">${playerName}</span>
                <div class="goal-club">
                    <figure class="goal-club-logo"><img src="${clubLogo}" alt="${clubName}"></figure>
                    <span class="goal-club-name">${clubName}</span>
                </div>
            </div>
            <span class="Goals-scored">${mainStat}</span>
        </div>
        <div class="dropdown-stats" style="display: none;">
            <div class="left-extra-stats">
                <figure class="extra-stats-image">
                    <div class="flag-container">
                        <div class="flag-overlay"><h1></h1></div>
                        <img src="${playerImage}" alt="Player Image" class="player-img">
                    </div>
                </figure>
                <div class="assists-goals"><span><h3>${type === 'goals' ? 'Assists' 
                    : type === 'assists' ? 'Key Passes' 
                    : type === 'yellows' ? 'Second Yellow'
                    : type === 'reds' ? 'Tackles' 
                    : 'Unknown Stat'}: ${secondaryStat}</h3></span></div>
            </div>
            <div class="club-extra-stats">
                <div class="club-in-stats">
                    <h1>${clubName}</h1>
                </div>
            </div>
        </div>
    `;

    // Append to the correct list based on type
    const playerList = document.querySelector(
        type === 'goals' ? '.player-list' :
        type === 'assists' ? '.player-list-assist' :
        type === 'yellows' ? '.player-list-yellow' :
        type === 'reds' ? '.player-list-red' :
        '.player-list-cleansheet'
    );

    if (playerList) {
        playerList.appendChild(playerItem);
    }
}



