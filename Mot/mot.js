class Mot{
    constructor(name, link, difficulty) {
        this.name = name;
        this.link = 'https://github.com/ZelKr0w/Programmation-Web/blob/2edc899518aa9691965ab6af17173870411a3502/texte.txt';
        this.diff = difficulty;
    }
}
//fonction qui prend un fichier texte, le convertit en chaine de caractere, et le met dans un tableau 
function textinTab(link) {
    fetch(link)
    .then(response => response.text())
    .then(text => {
        const tableaucarac = Array.from(text);
        console.log(tableaucarac);
    })
    .catch(error => {
        console.error('Error loading the characters:', error);
    });
}

function wordChecker(tableaucarac, duration) {
    
    let currentInput = '';
    let errors = 0;
    let timeLeft = duration;
    let isTestRunning = true;

    // Timer setup
    const startTime = Date.now();
    const timer = setInterval(() => {
        timeLeft--;
        console.log(`Time remaining: ${timeLeft} seconds`);
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            endTest();
        }
    }, 1000);

    // Keyboard event listener
    document.addEventListener('keydown', (event) => {
        if (!isTestRunning) return;

        // Handle different key types
        if (event.key === 'Backspace') {
            // Remove last character if backspace
            currentInput = currentInput.slice(0, -1);
        } else if (event.key.length === 1) {
            // Add printable characters
            currentInput += event.key;
        }

        // Check input against target
        errors = calculateErrors(currentInput, tableaucarac)
    });
}
