// eventHandlers.js

export function setupPlayerInfoClickListener() {
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
                    if (goalName) goalName.style.fontSize = '';
                    if (smallPlayerImage) smallPlayerImage.style.display = 'flex';
                    if (position) position.style.display = 'none';
                }, 400);
            } else {
                // Open dropdown
                dropdown.style.display = 'flex';
                setTimeout(() => {
                    dropdown.classList.add('open');
                    dropdown.style.maxHeight = '500px';
                    dropdown.style.opacity = '1';
                }, 10);

                // Show additional elements for assists items when opening
                if (smallClub) smallClub.style.display = 'none';
                if (goalName) goalName.style.fontSize = '36px';
                if (smallPlayerImage) smallPlayerImage.style.display = 'none';
                if (position) position.style.display = 'flex';
            }

            // Toggle background color and text color
            if (!dropdown.classList.contains('open')) {
                playerItem.style.backgroundColor = 'rgb(62, 0, 59)';
                playerItem.querySelectorAll('.goal-name, .goal-club-name, .goal-rank, .Goals-scored, .assists-goals h3, .club-in-stats h1, .goal-extra-stats h3, .flag-overlay h1, .goal-position h1').forEach(element => {
                    element.style.color = '#ffffff';
                });
            } else {
                playerItem.style.backgroundColor = '';
                playerItem.querySelectorAll('.goal-name, .goal-club-name, .goal-rank, .Goals-scored, .assists-goals h3, .club-in-stats h1, .goal-extra-stats h3, .flag-overlay h1, .goal-position h1').forEach(element => {
                    element.style.color = '#505050';
                });
            }
        }
    });
}

export function setupSidebarToggleClickListener() {
    document.addEventListener('DOMContentLoaded', function() {
        const sidebarToggles = document.querySelectorAll('.sidebar-toggle');

        sidebarToggles.forEach(toggle => {
            toggle.addEventListener('click', function() {
                const sidebar = this.closest('.advanced-stats-sidebar');
                sidebar.classList.toggle('active');

                const goalExtraStats = sidebar.querySelector('.goal-extra-stats');
                if (sidebar.classList.contains('active')) {
                    goalExtraStats.style.opacity = '1';
                    goalExtraStats.style.transform = 'translateY(0)';
                } else {
                    goalExtraStats.style.opacity = '0';
                    goalExtraStats.style.transform = 'translateY(100%)';
                }
            });
        });
    });
}

