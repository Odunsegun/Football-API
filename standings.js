export async function fetchData(season) {
    const url = `https://api-football-v1.p.rapidapi.com/v3/standings?league=39&season=${season}`;
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

        // Clear previous standings content
        document.querySelector('.standing-content').innerHTML = '';
        
        // Populate team standings
        for (let i = 0; i < 20; i++) {
            teamStandings(result, i);
        }
    } catch (error) {
        console.error(error);
    }
}



export function teamStandings(data, i){
    const teamRank = data.response[0].league.standings[0][i].rank; //postion
    const teamLogoUrl = data.response[0].league.standings[0][i].team.logo; //team logo
    const teamName = data.response[0].league.standings[0][i].team.name; 
    const matchPlayed = data.response[0].league.standings[0][i].all.played;
    const wins = data.response[0].league.standings[0][i].all.win;
    const draws = data.response[0].league.standings[0][i].all.draw;
    const losses = data.response[0].league.standings[0][i].all.lose;
    const goalFor = data.response[0].league.standings[0][i].all.goals.for;
    const goalAgainst = data.response[0].league.standings[0][i].all.goals.against;
    const goalDifference = data.response[0].league.standings[0][i].goalsDiff;
    const points = data.response[0].league.standings[0][i].points;
    const form = data.response[0].league.standings[0][i].form;
    newTeam(teamRank, teamLogoUrl, teamName, matchPlayed, wins, draws, losses, goalFor, goalAgainst, goalDifference, points, form);
}



export function newTeam(rank, logo, name, matches, wins, draws, losses, goalfor, goalagainst, goaldiff, points, forms) {
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
