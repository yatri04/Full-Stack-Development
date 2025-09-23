// Votes object to store counts
const votes = {
    JavaScript: 0,
    Python: 0,
    Java: 0
};

// Function to handle vote click
function vote(language) {
    votes[language]++;
    updateVotes();
}

// Function to update UI vote counts
function updateVotes() {
    document.getElementById('js-count').textContent = votes.JavaScript;
    document.getElementById('py-count').textContent = votes.Python;
    document.getElementById('java-count').textContent = votes.Java;
}

// Simulate random voting every 2 seconds
setInterval(() => {
    const langs = ['JavaScript', 'Python', 'Java'];
    const randomLang = langs[Math.floor(Math.random() * langs.length)];
    votes[randomLang]++;
    updateVotes();
}, 2000);