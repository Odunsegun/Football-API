
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






/*document.addEventListener('click', (event) => {
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
            playerItem.querySelectorAll('.goal-name, .goal-club-name, .goal-rank, .Goals-scored, .assists-goals h3, .club-in-stats h1, .goal-extra-stats h3, .flag-overlay h1, .goal-position h1').forEach(element => {
                element.style.color = '#ffffff';
            });
        } else {
            playerItem.style.backgroundColor = ''; // Reset background color
            // Reset text color
            playerItem.querySelectorAll('.goal-name, .goal-club-name, .goal-rank, .Goals-scored, .assists-goals h3, .club-in-stats h1, .goal-extra-stats h3, .flag-overlay h1, .goal-position h1').forEach(element => {
                element.style.color = '#505050';
            });
        }
    }
});

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
}); */



