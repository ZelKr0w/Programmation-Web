let wordsCorrect = 0;
let mistakes = 0;

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


function wordChecker(wordsArray, time) {
    // Get the input field and the result container
    const inputField = document.getElementById("wordInput");
    const resultField = document.getElementById("result");

    // Index of the current word
    let currentIndex = 0;

    // Event listener for input changes
    inputField.addEventListener("input", () => {
        const userInput = inputField.value.trim(); // User input
        const currentWord = wordsArray[currentIndex]; // Current word

        // Check if the input matches the current word
        if (userInput === currentWord) {
            wordsCorrect++; // Increment correct words count
            inputField.value = ""; // Clear the input field
            currentIndex++; // Move to the next word

            // Check if all words are completed
            if (currentIndex >= wordsArray.length) {
                resultField.textContent = "All words completed!";
                inputField.disabled = true; // Disable the input field
            }
        } else if (!currentWord.startsWith(userInput)) {
            // If the input does not match the current word
            mistakes++; // Increment mistakes count
            resultField.textContent = "Incorrect, try again!";
        } else {
            // Intermediate status (user is still typing)
            resultField.textContent = "Typing...";
        }
    });
}



function test() {
    const wordsEx = ['hallo', 'welt', 'schreiben', 'test', 'wort', 'schule', 'lernen', 'lesen'];
    document.getElementById("text").innerText = wordsEx.join(" ");
    wordChecker(wordsEx, 60);
}
