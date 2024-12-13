function typewriterGame(charArray, timeLimit) {
    const inputField = document.getElementById("inputField");
    const resultField = document.getElementById("result");
    const restartButton = document.getElementById("restartButton");
    const charactersToTypeField = document.getElementById("charactersToType");

    let currentIndex = 0, correctCount = 0, mistakesCount = 0, errorCount = 0;
    let totalChars = charArray.length, timer;
    let timeRemaining = timeLimit;

    // Timer function
    function startTimer() {
        timer = setInterval(() => {
            if (timeRemaining <= 0) {
                clearInterval(timer);
                resultField.textContent = `Time's up! You finished with ${correctCount} correct characters and ${mistakesCount} mistakes.`;
                inputField.disabled = true;
            } else {
                resultField.textContent = `Time left: ${timeRemaining}s | Correct: ${correctCount} | Mistakes: ${mistakesCount} | Errors: ${errorCount}`;
                timeRemaining--;
            }
        }, 1000);
    }

    // Function to display the characters to type
    function updateCharactersToType() {
        let typedPart = '';
        let remainingPart = '';

        // Split the charArray into typed and remaining parts
        for (let i = 0; i < totalChars; i++) {
            if (i < currentIndex) {
                typedPart += `<span class="typed">${charArray[i]}</span>`;
            } else {
                remainingPart += `<span class="remaining">${charArray[i]}</span>`;
            }
        }

        charactersToTypeField.innerHTML = `${typedPart}${remainingPart}`;
    }

    // Event listener for input field
    inputField.addEventListener("input", () => {
        const userInput = inputField.value;
        const currentChar = charArray[currentIndex];

        if (userInput === currentChar) {
            correctCount++;
            inputField.value = ""; // Clear input after correct character
            currentIndex++;
            updateCharactersToType(); // Update the displayed characters

            if (currentIndex >= totalChars) {
                clearInterval(timer);
                resultField.textContent = `You completed the game! Correct: ${correctCount}, Mistakes: ${mistakesCount}, Errors: ${errorCount}`;
                inputField.disabled = true;
            }
        } else if (userInput.length > 0 && userInput !== currentChar) {
            mistakesCount++;
            errorCount++;  // Increment error count on each incorrect input
            resultField.textContent = `Incorrect! Mistakes: ${mistakesCount} | Errors: ${errorCount}`;
        }
    });

    // Restart game
    restartButton.addEventListener("click", () => {
        currentIndex = 0;
        correctCount = 0;
        mistakesCount = 0;
        errorCount = 0;
        timeRemaining = timeLimit;
        inputField.value = "";
        inputField.disabled = false;
        resultField.textContent = "";
        updateCharactersToType(); // Reset character display
        startTimer();
    });

    // Initial display of characters to type
    updateCharactersToType();
    startTimer();
}

// Call the function with an array of characters and a 30-second timer
const charsToType = ['h', 'e', 'l', 'l', 'o'];
typewriterGame(charsToType, 30);