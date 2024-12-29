class Mot {
    constructor(link) {
        this.link = link;// une fois que le github sera en publique et bien organisé, on mettra id a la place de link
                        // pour avoir un truc du type "http://raw.ghitub.zelkr0w/projet-web/mot/ + id+ ".txt"
        this.tabMots = [];
        this.tailleTab = 0;  // Initialisation de tailleTab
    }

    async loadTextArray() {
        try {
            const response = await fetch(this.link);
            if (!response.ok) throw new Error(`Erreur lors du chargement du fichier : ${response.statusText}`);
            const text = await response.text();
            this.tabMots = text.split(/\s+/);  // Divise le texte en un tableau de mots
            this.tailleTab = this.tabMots.length;  
        } catch (error) {
            console.error("Erreur :", error);
            this.tabMots = [];  // En cas d'erreur, réinitialise le tableau
            this.tailleTab = 0;  // Si une erreur se produit, la taille est 0
        }
    }
}

//ici il faudrait ajouter une boucle if pour decider du lien(id) en fonction de la difficulté choisi par l'utilisateur 
const sourcemot= new Mot("https://raw.githubusercontent.com/kkrypt0nn/wordlists/refs/heads/main/wordlists/passwords/nord_vpn.txt")
console.log(sourcemot.tailleTab)

function Timer(){
    var sec = 30;
    var timer = setInterval(function(){
        document.getElementById("TimerDisplay").innerHTML='00:'+sec;
        sec--;
        if (sec < 0) {
            clearInterval(timer);
        }
    }, 1000);
}


function addClass(el, name) {
    el.className += ' ' + name;
    // ''le nom de la classe deja existante //rajoute le name
}

function removeClass(el,name){
    el.className=el.className.replace(name,'');//enelve le name
}

function selecMot(){
    let indexHasard =  Math.floor(Math.random()*sourcemot.tailleTab)
    return sourcemot.tabMots[indexHasard];
}
function separateurMot(mot){
    return `<div class="word">
            <span class="letter"> 
            ${mot.split('').join('</span><span class="letter")>')}</span></div>`;
}
async function newGame() {
    await sourcemot.loadTextArray();
    let i = 0 
    for (i; i<30; i++){
        document.getElementById("words").innerHTML += separateurMot(selecMot());

    }
     addClass(document.querySelector(".word"),"current")
     addClass(document.querySelector(".letter"),"current")
}

document.getElementById("typeBox").addEventListener("keyup", ev=>{
    const key=ev.key
    const currentLetter= document.querySelector(".letter.current")
    const currentWord= document.querySelector(".word.current")
    const expected= currentLetter?.innerHTML.trim() || ' ';//si on a pas de CurrentLetter, alors forcement on a un espace
    const isLetter= key.length === 1 && key !==' ';
    const isSpace = key === ' ';
    const isBackspace = key ==='Backspace';
    const isFirstLetter = currentLetter === currentWord.firstChild;
    
        if(isLetter){
            if(currentLetter){
                 if(key===expected){
                    addClass(currentLetter, "correct") 
                    removeClass(currentLetter,"current")
                   if(currentLetter.nextElementSibling){// on check si on a bien une lettre apres la lettre actuelle
                        addClass(currentLetter.nextSibling, "current")
                    }
                 }
                 else{
                    addClass(currentLetter, "incorrect")
                    removeClass(currentLetter,"current")
                    if(currentLetter.nextElementSibling){
                        addClass(currentLetter.nextSibling, "current")
                    }
                }
           
            }
        }
        if (isSpace) {
            if (expected !== ' ') {
              const lettersToInvalidate = [...document.querySelectorAll('.word.current .letter:not(.correct,.incorrect)')];
              lettersToInvalidate.forEach(letter => {
                addClass(letter, 'incorrect');
              });
                }
            removeClass(currentWord,"current")
            addClass(currentWord.nextSibling, "current")
            if (currentLetter) {
                removeClass(currentLetter, 'current');
              }
            addClass(currentWord.nextElementSibling.firstElementChild, "current");
            }
        if (isBackspace) {
            console.log(expected.lastSibling)
            if (currentLetter && isFirstLetter) {
                  //le mot d'avant devient currrent, et donc la derniere lettre de ce current word devient current 
                  removeClass(currentWord, 'current');
                  addClass(currentWord.previousSibling, 'current');
                  removeClass(currentLetter, 'current');
                  addClass(currentWord.previousSibling.lastChild, 'current');
                  removeClass(currentWord.previousSibling.lastChild, 'incorrect');
                  removeClass(currentWord.previousSibling.lastChild, 'correct');
                }
                if (currentLetter && !isFirstLetter) {
                  // move back one letter, invalidate letter
                  removeClass(currentLetter, 'current');
                  addClass(currentLetter.previousSibling, 'current');
                  removeClass(currentLetter.previousSibling, 'incorrect');
                  removeClass(currentLetter.previousSibling, 'correct');
                }
                if (!currentLetter) {
                  addClass(currentWord.lastChild, 'current');
                  removeClass(currentWord.lastChild, 'incorrect');
                  removeClass(currentWord.lastChild, 'correct');
                }
                
            }    
    //bouger lignes et mots
      
});
newGame();