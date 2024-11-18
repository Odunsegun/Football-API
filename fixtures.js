export async function fetchFixtures() {
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


//scroll to Matchday automatically
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