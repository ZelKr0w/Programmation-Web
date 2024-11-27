class Mot{
    constructor(name, link, difficulty) {
        this.name = name;
        this.link = link;
        this.diff = difficulty;
    }
//fonction qui prend un fichier texte avec un mot par ligne et le met dans un tableau avec fectch
function textDansTab(lien){
    fetch('lien')
    .then(response => response.text()) // response est l'object retourné par fetch, response.text convertit notre reponse en string
    .then(text => {
        const array = text.split('\n'); // Split by newline to create an array
        console.log(array);
    })
    .catch(error => {
        console.error('Error loading the array:', error);
     });
    }