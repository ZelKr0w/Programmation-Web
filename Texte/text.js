class Text {
    constructor(name, difficulty) {
        this.name = name;
        this.link = '../Annexes/text/text' + difficulty + '.txt';
        this.diff = difficulty;
    }

    writeText(targetId) {
        fetch(this.link)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                return response.text(); // Retourne le contenu du fichier en texte
                
            })
            .then(text => {
                console.log(typeof(text))
                document.getElementById(targetId).textContent = text; // Affiche le contenu dans la page
            })
            .catch(error => console.error('Erreur lors de la lecture du fichier :', error));
    }

    /**
    textArray() {
        try {
            // Textdatei laden
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Fehler beim Laden der Datei: ${response.statusText}`);
            
            // Textinhalt als String lesen
            const text = await response.text();
            
            // Wörter in ein Array aufteilen
            const words = text.split(/\s+/); // Trenne bei Leerzeichen, Tabs und neuen Zeilen
            return words;
        } catch (error) {
            console.error("Fehler:", error);
            return [];
        }
    }
    */
}




// test
const textObj = new Text('exemple', 'hard');
textObj.writeText('output');


