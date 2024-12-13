class Mot {
    constructor(id) {
        this.link = 'https://github.com/ZelKr0w/Programmation-Web/blob/2edc899518aa9691965ab6af17173870411a3502/Annexes/mots/mots' + id + '.txt';
        this.textArray = [];
    }

    async loadTextArray() {
        try {
            const response = await fetch(this.link);
            if (!response.ok) throw new Error(`Fehler beim Laden der Datei: ${response.statusText}`);
            const text = await response.text();
            this.textArray = text.split(/\s+/);
            for (let i = textArray.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [textArray[i], textArray[j]] = [textArray[j], textArray[i]];
            }
        } catch (error) {
            console.error("Error:", error);
            this.textArray = [];
        }
    }
}


// Test
const motObj = new Mot('1');
motObj.loadTextArray().then(() => {
    console.log(motObj.textArray);
    document.getElementById('output').textContent = motObj.textArray.join(' ');
});