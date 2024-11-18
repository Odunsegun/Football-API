
//API-token = RRG1Oxy0KSccHq0Wvig2JcVmeCKi47DPHGF6bds8HVqkP7WBCQ0fJJGxSgqE
import { fetchData} from "./standings.js";
import { fetchPlayerStats } from "./stats.js";
import { fetchFixtures } from "./fixtures.js";
import { setupPlayerInfoClickListener, setupSidebarToggleClickListener } from "./toggleplayer.js"
 



// Select filter buttons
const standingsButton = document.getElementById('standing');
const matchesButton = document.getElementById('match');
const statsButton = document.getElementById('stat');

// Select content sections
const standingsContent = document.querySelector('.STANDINGS');
const matchesContent = document.querySelector('.MATCHES');
const statsContent = document.querySelector('.STATS');// Function to show the selected section and hide the others

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

// SHOW BUTTONS
standingsButton.addEventListener('click', () => {
    showSection('standings');
});
matchesButton.addEventListener('click', () => {
    showSection('matches');
});
statsButton.addEventListener('click', () => {
    showSection('stats');
});

// Initialize by showing the standings section by default
showSection('matches');



//STANDINGS

// Call fetchData initially with the default season (e.g., 2024)
fetchData('2024');
//

// Add an event listener to the season dropdown
document.getElementById('season-select').addEventListener('change', function() {
    const selectedSeason = this.value.split('-')[0]; // Get the starting year from the selected season (e.g., "2024" from "2024-25")
    fetchData(selectedSeason); // Fetch standings for the selected season
});



//FIXTURES
fetchFixtures();


//STATS
setupPlayerInfoClickListener();
setupSidebarToggleClickListener();



// Fetch data
fetchPlayerStats('goals');
fetchPlayerStats('assists');
fetchPlayerStats('yellows');
fetchPlayerStats('reds');




