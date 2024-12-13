class Text {
    constructor(id) {
        this.link = 'https://github.com/ZelKr0w/Programmation-Web/blob/2edc899518aa9691965ab6af17173870411a3502/Annexes/text/text' + id + '.txt';
        this.textArray = [];
    }

    async loadTextArray() {
        try {
            const response = await fetch(this.link);
            if (!response.ok) throw new Error(`Fehler beim Laden der Datei: ${response.statusText}`);
            const text = await response.text();
            this.textArray = text.split(/\s+/);
        } catch (error) {
            console.error("Error:", error);
            this.textArray = [];
        }
    }
}




// Test
const textObj = new Text('1');
textObj.loadTextArray().then(() => {
    console.log(textObj.textArray);
    document.getElementById('output').textContent = textObj.textArray.join(' ');
});

