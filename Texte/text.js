class Text {
    constructor(id) {
        this.link = '../Annexes/text/text' + id + '.txt';
        this.textArray = [];
    }

    async loadTextArray() {
        try {
            const response = await fetch(this.link);
            if (!response.ok) throw new Error(`Fehler beim Laden der Datei: ${response.statusText}`);
            const text = await response.text();
            this.textArray = text.split(/\s+/);
        } catch (error) {
            console.error("Fehler:", error);
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

