class Phrase {
    constructor(id) {
        this.link = 'https://github.com/ZelKr0w/Programmation-Web/tree/2edc899518aa9691965ab6af17173870411a3502/Annexes/phrase/phrase' + id + '.txt';
        this.textArray = [];
    }

    async loadTextArray() {
        try {
            const response = await fetch(this.link);
            if (!response.ok) throw new Error(`Fehler beim Laden der Datei: ${response.statusText}`);
            const text = await response.text();
            this.textArray = text.split(/\s+/);
            const lines = text.split('\n');
            this.textArray = this.shuffleArray(lines);
        } catch (error) {
            console.error("Error:", error);
            this.textArray = [];
        }
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}


// Test
const textObj = new Phrase('1');
textObj.loadTextArray().then(() => {
    console.log(textObj.textArray);
    document.getElementById('output').textContent = textObj.textArray.join(' ');
});
