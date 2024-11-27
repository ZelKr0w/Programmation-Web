class Text {
    constructor(name, link, difficulty) {
        this.name = name;
        this.link = link;
        this.diff = difficulty;
    }

    writeText(id) {
        fetch(this.link)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                return response.text(); // Retourne le contenu du fichier en texte
                
            })
            .then(text => {
                console.log(typeof(text))
                document.getElementById(id).textContent = text; // Affiche le contenu dans la page
            })
            .catch(error => console.error('Erreur lors de la lecture du fichier :', error));
    }
}




// test
//const textObj = new Text('Beispiel', 'Annexes/testText.txt', 'easy');
//textObj.writeText('output');


