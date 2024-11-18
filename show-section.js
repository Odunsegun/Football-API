// Function to show the selected section and hide the others
export function showSection(section) {
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