
//API-token = RRG1Oxy0KSccHq0Wvig2JcVmeCKi47DPHGF6bds8HVqkP7WBCQ0fJJGxSgqE
import { fetchData} from "./standings.js";

// Select filter buttons
const standingsButton = document.getElementById('standing');
const matchesButton = document.getElementById('match');
const statsButton = document.getElementById('stat');

// Select content sections
const standingsContent = document.querySelector('.STANDINGS');
const matchesContent = document.querySelector('.MATCHES');
const statsContent = document.querySelector('.STATS');

// Add event listeners to buttons
standingsButton.addEventListener('click', () => {
    showSection('standings');
});

matchesButton.addEventListener('click', () => {
    showSection('matches');
});

statsButton.addEventListener('click', () => {
    showSection('stats');
});

// Function to show the selected section and hide the others
function showSection(section) {
    // Hide all sections
    standingsContent.style.display = 'none';
    matchesContent.style.display = 'none';
    statsContent.style.display = 'none';

    // Remove active class from all buttons
    standingsButton.classList.remove('active');
    matchesButton.classList.remove('active');
    statsButton.classList.remove('active');

    // Show the selected section and set its button as active
    if (section === 'standings') {
        standingsContent.style.display = 'block';
        standingsButton.classList.add('active');
    } else if (section === 'matches') {
        matchesContent.style.display = 'block';
        matchesButton.classList.add('active');
    } else if (section === 'stats') {
        statsContent.style.display = 'block';
        statsButton.classList.add('active');
    }
}

// Initialize by showing the standings section by default
showSection('matches');



//STANDINGS


// Modified fetchData function to use dynamic season parameter


// Call fetchData initially with the default season (e.g., 2024)
fetchData('2024');
// Add an event listener to the season dropdown
document.getElementById('season-select').addEventListener('change', function() {
    const selectedSeason = this.value.split('-')[0]; // Get the starting year from the selected season (e.g., "2024" from "2024-25")
    fetchData(selectedSeason); // Fetch standings for the selected season
});





/*async function fetchFixtures() {
    const url = 'https://api-football-v1.p.rapidapi.com/v3/fixtures?league=39&season=2024';
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
        displayFixtures(result.response); // Pass the fixtures data array to the display function
    } catch (error) {
        console.error(error);
    }
}
fetchFixtures();
//*/
function displayFixtures(fixtures) {
    const matchContainer = document.querySelector('.match-content');
    matchContainer.innerHTML = ''; // Clear existing content

    const today = new Date();
    let closestMatchdayIndex = 0;
    let minDateDiff = Infinity;
    let currentMatchday = 1;

    // Group fixtures into matchdays
    let matchdays = [];
    for (let i = 0; i < fixtures.length; i += 10) {
        matchdays.push(fixtures.slice(i, i + 10));
    }

    // Find the closest matchday based on today's date
    matchdays.forEach((matchdayFixtures, index) => {
        const firstFixtureDate = new Date(matchdayFixtures[0].fixture.date);
        const dateDiff = Math.abs(today - firstFixtureDate);

        if (dateDiff < minDateDiff) {
            minDateDiff = dateDiff;
            closestMatchdayIndex = index + 1; // Matchday numbering starts from 1
        }
    });

    // Render each matchday and fixtures
    matchdays.forEach((matchdayFixtures, index) => {
        // Add matchday separator
        const matchdayNumber = index + 1;
        const matchdaySeparator = document.createElement('div');
        matchdaySeparator.classList.add('matchday-separator');
        matchdaySeparator.textContent = `Matchday ${matchdayNumber}`;
        matchdaySeparator.dataset.matchday = matchdayNumber; // Set a data attribute for scrolling
        matchContainer.appendChild(matchdaySeparator);

        // Render fixtures within the matchday
        matchdayFixtures.forEach(fixture => {
            const { shortDate, time } = convertUTCToLocal(fixture.fixture.date);
            console.log(shortDate, time );
            const homeLogo = fixture.teams.home.logo;
            const homeTeam = fixture.teams.home.name;
            const homeGoals = fixture.goals.home !== null ? fixture.goals.home : '-';
            const awayLogo = fixture.teams.away.logo;
            const awayTeam = fixture.teams.away.name;
            const awayGoals = fixture.goals.away !== null ? fixture.goals.away : '-';
            const gameStatus = fixture.fixture.status.short;

            let gameWinner = '';
            if (fixture.teams.home.winner) {
                gameWinner = 'home';
            } else if (fixture.teams.away.winner) {
                gameWinner = 'away';
            }

            const matchCard = document.createElement('div');
            matchCard.classList.add('match-card');

            matchCard.innerHTML = `
                <div class="match-card-content">
                    <div class="match-card-body">
                        <div class="first-team">
                            ${gameWinner === 'home' ? `<div class="crown"><img src="https://cdn.iconscout.com/icon/premium/png-512-thumb/crown-2038338-1718701.png?f=webp&w=256" alt="crown"></div>` : ''}
                            <div class="home-logo">
                                <img src="${homeLogo}" alt="${homeTeam} Logo">
                            </div>
                            <div class="home-team">
                                <h2>${homeTeam}</h2>
                            </div>
                        </div>
                        <div class="home-goals">
                            <h2>${homeGoals}</h2>
                        </div>
                        <div class="match-divider">
                            <div class="first-line"></div>
                            <div class="match-date">
                                <div>${gameStatus === 'FT' ? shortDate : shortDate}</div>
                            </div>
                            <div class="match-conclusion">
                                <h2>${gameStatus === 'FT' ? 'FT' : time}</h2>
                            </div>
                            <div class="second-line"></div>
                        </div>
                        <div class="away-goals">
                            <h2>${awayGoals}</h2>
                        </div>
                        <div class="second-team">
                            ${gameWinner === 'away' ? `<div class="crown"><img src="https://cdn.iconscout.com/icon/premium/png-512-thumb/crown-2038338-1718701.png?f=webp&w=256" alt="crown"></div>` : ''}
                            <div class="away-logo">
                                <img src="${awayLogo}" alt="${awayTeam} Logo">
                            </div>
                            <div class="away-team">
                                <h2>${awayTeam}</h2>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            matchContainer.appendChild(matchCard);
        });
    });

    // Scroll to the closest matchday
    setTimeout(() => scrollToMatchday(closestMatchdayIndex), 100);
}

function scrollToMatchday(matchdayIndex) {
    const matchdaySeparator = document.querySelector(`.matchday-separator[data-matchday="${matchdayIndex}"]`);
    if (matchdaySeparator) {
        matchdaySeparator.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}



// Convert UTC to local time and date
function convertUTCToLocal(utcDateStr) {
    const utcDate = new Date(utcDateStr);
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const shortDate = utcDate.toLocaleDateString('en-US', {
        timeZone: userTimeZone,
        month: 'short',
        day: 'numeric',
    });

    const time = utcDate.toLocaleTimeString('en-US', {
        timeZone: userTimeZone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
    
    return { shortDate, time };
}





// Select all filter elements
//STATS

/*async function fetchPlayerStats(type) {
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
function renderPlayerStatItem(playerData, rank, type) {
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
function positionConverter(pos) {
    const positions = { "Attacker": "ST", "Midfielder": "MID", "Defender": "DEF", "Goalkeeper": "GK" };
    return positions[pos] || pos;
}

// Create HTML for player item
function createPlayerItem(rank, playerImage, position, playerName, clubLogo, clubName, mainStat, secondaryStat, additionalStat1, additionalStat2, label1, label2, type) {
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
                        <div class="flag-overlay"><h1>${mainStat}</h1></div>
                        <img src="${playerImage}" alt="Player Image" class="player-img">
                    </div>
                </figure>
                <div class="assists-goals"><span><h3>${type === 'goals' ? 'Assists' 
                    : type === 'assists' ? 'Key Passes' 
                    : type === 'yellows' ? 'Second Yellow'
                    : type === 'reds' ? 'Tackles' 
                    : 'Unknown Stat'}: ${secondaryStat}</h3></span></div>
            </div>
            <div class="club-extra-stats"><h1>${clubName}</h1></div>
            <div class="goal-extra-stats">
                <div class="minutes-per-goal"><h3>${label1}: ${additionalStat1}</h3></div>
                <div class="shot-accuracy"><h3>${label2}: ${additionalStat2}</h3></div>
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

document.addEventListener('click', (event) => {
    const playerInfo = event.target.closest('.player-info, .player-info-assist, .player-info-yellow, .player-info-red');
    
    if (playerInfo) {
        const playerItem = playerInfo.closest('.player-item, .player-item-assist, .player-item-yellow, .player-item-red');
        const dropdown = playerItem.querySelector('.dropdown-stats');
        
        // Additional elements for assists items
        const smallClub = playerItem.querySelector('.goal-club');
        const goalName = playerItem.querySelector('.goal-name');
        const smallPlayerImage = playerItem.querySelector('.goals-player-image');
        const position = playerItem.querySelector('.assist-position');

        if (dropdown.classList.contains('open')) {
            // Close dropdown
            dropdown.style.maxHeight = '0';
            dropdown.style.opacity = '0';
            setTimeout(() => {
                dropdown.classList.remove('open');
                dropdown.style.display = 'none';

                // Reset additional elements when closing
                if (smallClub) smallClub.style.display = 'flex';
                if (goalName) goalName.style.fontSize = ''; // Reset font size
                if (smallPlayerImage) smallPlayerImage.style.display = 'flex';
                if (position) position.style.display = 'none'; // Hide position
            }, 400); // Matches transition duration
        } else {
            // Open dropdown
            dropdown.style.display = 'flex'; // Set display first for transition to work
            setTimeout(() => {
                dropdown.classList.add('open');
                dropdown.style.maxHeight = '500px';
                dropdown.style.opacity = '1';
            }, 10); // Slight delay to ensure display is applied first
            
            // Show additional elements for assists items when opening
            if (smallClub) smallClub.style.display = 'none';
            if (goalName) goalName.style.fontSize = '36px'; // Increase font size
            if (smallPlayerImage) smallPlayerImage.style.display = 'none';
            if (position) position.style.display = 'flex'; // Show position
        }

        // Toggle background color and text color
        if (!dropdown.classList.contains('open')) {
            playerItem.style.backgroundColor = 'rgb(62, 0, 59)'; // Set background color
            // Set text color to white
            playerItem.querySelectorAll('.goal-name, .goal-club-name, .goal-rank, .Goals-scored, .assists-goals h3, .club-extra-stats h1, .goal-extra-stats h3, .flag-overlay h1, .goal-position h1').forEach(element => {
                element.style.color = '#ffffff';
            });
        } else {
            playerItem.style.backgroundColor = ''; // Reset background color
            // Reset text color
            playerItem.querySelectorAll('.goal-name, .goal-club-name, .goal-rank, .Goals-scored, .assists-goals h3, .club-extra-stats h1, .goal-extra-stats h3, .flag-overlay h1, .goal-position h1').forEach(element => {
                element.style.color = '#505050';
            });
        }
    }
});

// Fetch data
fetchPlayerStats('goals');
fetchPlayerStats('assists');
fetchPlayerStats('yellows');
fetchPlayerStats('reds');

//SEARCH
// Select the search input
const searchInput = document.querySelector('.home-box-search input');

// Add event listener for the search input
searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();
    if (query) {
        filterStandings(query);
        filterMatches(query);
        filterStats(query);
    } else {
        // If input is cleared, fetch all data again
        fetchData('2024'); // You might want to dynamically use the selected season here
        fetchFixtures();
        fetchPlayerStats('goals');
        fetchPlayerStats('assists');
        fetchPlayerStats('yellows');
        fetchPlayerStats('reds');
    }
});
/*
// Function to filter standings based on the team name
function filterStandings(teamName) {
    // Clear previous standings content
    document.querySelector('.standing-content').innerHTML = '';

    // Fetch standings and filter for the team name
    async function fetchFilteredStandings() {
        const selectedSeason = document.getElementById('season-select').value.split('-')[0];
        const url = `https://api-football-v1.p.rapidapi.com/v3/standings?league=39&season=${selectedSeason}`;
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
            const standings = result.response[0].league.standings[0];
            standings.forEach((team, i) => {
                if (team.team.name.toLowerCase().includes(teamName)) {
                    teamStandings(result, i); // Display filtered team
                }
            });
        } catch (error) {
            console.error(error);
        }
    }
    fetchFilteredStandings();
}

// Function to filter matches based on the team name
function filterMatches(teamName) {
    async function fetchFilteredFixtures() {
        const url = 'https://api-football-v1.p.rapidapi.com/v3/fixtures?league=39&season=2024';
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
            const filteredFixtures = result.response.filter(fixture => 
                fixture.teams.home.name.toLowerCase().includes(teamName) ||
                fixture.teams.away.name.toLowerCase().includes(teamName)
            );
            displayFixtures(filteredFixtures); // Display only matches with the team name
        } catch (error) {
            console.error(error);
        }
    }
    fetchFilteredFixtures();
}

// Function to filter stats based on the team name
function filterStats(teamName) {
    // Helper function to fetch player stats of the specified type and filter by team name
    async function fetchFilteredPlayerStats(type) {
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
            const filteredPlayers = result.response.filter(playerData =>
                playerData.statistics[0].team.name.toLowerCase().includes(teamName)
            );
            filteredPlayers.forEach((playerData, index) => {
                renderPlayerStatItem(playerData, index + 1, type); // Display only players from the team name
            });
        } catch (error) {
            console.error("Failed to fetch player stats:", error);
        }
    }

    // Fetch and filter each stat type
    fetchFilteredPlayerStats('goals');
    fetchFilteredPlayerStats('assists');
    fetchFilteredPlayerStats('yellows');
    fetchFilteredPlayerStats('reds');
}
*/



/*function newTeam(rank, logo, name, matches, wins, draws, losses, goalfor, goalagainst, goaldiff, points, forms) {
    const teamRow = document.createElement('div');
    
    teamRow.classList.add('teamsheet');
    teamRow.innerHTML = `
                <div class="team-number">
                    <h3>${rank}</h3>
                </div>
                <div class="team-logo">
                    <img src="${logo}" alt="${name} Logo">
                </div>
                <div class="team-name">
                    <h3>${name}</h3>
                </div>
                <div class="team-matches">
                    <h3>${matches}</h3>
                </div>
                <div class="team-wins">
                    <h3>${wins}</h3>
                </div>
                <div class="team-draws">
                    <h3>${draws}</h3>
                </div>
                <div class="team-losses">
                    <h3>${losses}</h3>
                </div>
                <div class="team-goalFor">
                    <h3>${goalfor}</h3>
                </div>
                <div class="team-goalAgainst">
                    <h3>${goalagainst}</h3>
                </div>
                <div class="team-goalDifference">
                    <h3>${goaldiff}</h3>
                </div>
                <div class="team-points">
                    <h3>${points}</h3>
                </div>
                <div class="team-form">
                    ${forms.split('').map(form => {
                        if (form === 'W') return '<span class="form-win"></span>';
                        if (form === 'L') return '<span class="form-loss"></span>';
                        if (form === 'D') return '<span class="form-draw"></span>';
                    }).join('')}
                </div>
            `;

    // Select the standing-content container and append the teamRow
    const standingContent = document.querySelector('.standing-content');
    standingContent.appendChild(teamRow);
}
*/


/*async function fetchData(){
    const url = 'https://heisenbug-premier-league-live-scores-v1.p.rapidapi.com/api/premierleague/team?name=Liverpool';
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '4122381e1emshb8ba4169865822bp1b2f75jsnbdddd3ffcda1',
            'x-rapidapi-host': 'heisenbug-premier-league-live-scores-v1.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.text();
        console.log(result);
    } catch (error) {
        console.error(error);
    }
}*/

/*async function fetchData(){
    const url = 'https://heisenbug-premier-league-live-scores-v1.p.rapidapi.com/api/premierleague/team?name=Liverpool';
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': 'a7e40f50cdmshd81ea25cb283696p107bd1jsnfd70910235a4',
            'x-rapidapi-host': 'heisenbug-premier-league-live-scores-v1.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.text();
        console.log(result);
    } catch (error) {
        console.error(error);
    }
}*/

// Add event delegation to the .player-list container

document.addEventListener('DOMContentLoaded', function() {
    // Select all sidebar toggles within the .advanced-stats-sidebar
    const sidebarToggles = document.querySelectorAll('.sidebar-toggle');

    sidebarToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            // Find the closest .advanced-stats-sidebar and toggle the 'active' class
            const sidebar = this.closest('.advanced-stats-sidebar');
            sidebar.classList.toggle('active');
            
            // Select the .goal-extra-stats inside the specific sidebar
            const goalExtraStats = sidebar.querySelector('.goal-extra-stats');
            if (sidebar.classList.contains('active')) {
                goalExtraStats.style.opacity = '1'; // Show goal-extra-stats
                goalExtraStats.style.transform = 'translateY(0)';
            } else {
                goalExtraStats.style.opacity = '0'; // Hide goal-extra-stats
                goalExtraStats.style.transform = 'translateY(100%)';
            }
        });
    });
});

