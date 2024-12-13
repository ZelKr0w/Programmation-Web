class Mot{
    constructor(name, link, difficulty) {
        this.name = name;
        this.link = link;
        this.diff = difficulty;
    }
}
//fonction qui prend un fichier texte avec un mot par ligne et le met dans un tableau avec fectch
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
function checkWords(wordsArray, n) {
        let wordIndex = 0;  // Start with the first word
        let correctCount = 0;  // Track how many words the user gets right
    
        // Loop to check the user's input for `n` words
        while (correctCount < n && wordIndex < wordsArray.length) {
            const word = wordsArray[wordIndex].trim();  // Get the current word and trim any extra spaces
             // Prompt the user to type the word
             const userInput = prompt(`Type the word: ${word}`);
             // Check if the user input matches the word
             if (userInput === word) {
                alert("Correct!");
                correctCount++;  // Increment the correct count
            } else {
                alert("Incorrect. Try again.");
            }
    
            wordIndex++;  // Move to the next word
        }
    
        // After checking n words, display the result
        if (correctCount === n) {
            alert(`You typed ${n} words correctly!`);
        } else {
            alert(`Game Over. You got ${correctCount} words correct.`);
        }
    }