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
const sourcemot= new Mot("https://raw.githubusercontent.com/dwyl/english-words/refs/heads/master/words.txt")
let tempPartie = 30000; // Default value (30 seconds)

document.addEventListener('DOMContentLoaded', () => {
  const tempSelect = document.getElementById("tempSelect");
  tempPartie = parseInt(tempSelect.value, 10) * 1000;

  // Update tempPartie whenever the player changes the selection
  tempSelect.addEventListener('change', (event) => {
    tempPartie = parseInt(event.target.value, 10) * 1000;
    console.log("New tempPartie:", tempPartie); // Debugging log
  });
});
window.timer = null;
window.gameStart = null;
window.pauseTime = 0;
function ajoutClasse(el,name) {
  el.className += ' '+name;
}
function supprimeClasse(el,name) {
  el.className = el.className.replace(name,'');
}

function motHasard() {
  const randomIndex = Math.ceil(Math.random() * sourcemot.tailleTab);
  return sourcemot.tabMots[randomIndex - 1];
}

function insertMot(mot) {
  return `<div class="mot"><span class="lettre">${mot.split('').join('</span><span class="lettre">')}</span></div>`;
}

async function newGame() {
  await sourcemot.loadTextArray(); 
  document.getElementById('mots').innerHTML = '';
  for (let i = 0; i < 200; i++) {
    document.getElementById('mots').innerHTML += insertMot(motHasard());
  }
  ajoutClasse(document.querySelector('.mot'), 'actuel');
  ajoutClasse(document.querySelector('.lettre'), 'actuel');
  document.getElementById('info').innerHTML = (tempPartie / 1000) + '';
  window.timer = null;
}

function motsParMinute() {
  const mots = [...document.querySelectorAll('.mot')];
  const dernierMotEcrit = document.querySelector('.mot.actuel');
  const dernierMotEcritIndex = mots.indexOf(dernierMotEcrit) + 1;
  const motsEcrits = mots.slice(0, dernierMotEcritIndex);
  const correctmots = motsEcrits.filter(mot => {
    const lettres = [...mot.children];
    const lettresIncorrectes = lettres.filter(lettre => lettre.className.includes('incorrect'));
    const correctlettres = lettres.filter(lettre => lettre.className.includes('correct'));
    return lettresIncorrectes.length === 0 && correctlettres.length === lettres.length;
  });
  return correctmots.length / tempPartie * 60000;
}

function gameOver() {
  clearInterval(window.timer);
  ajoutClasse(document.getElementById('game'), 'over');
  const result = motsParMinute();
  document.getElementById('info').innerHTML = `WPM: ${result}`;
}

document.getElementById('game').addEventListener('keyup', ev => {
  const key = ev.key;
  const motActuel = document.querySelector('.mot.actuel');
  const lettreActuelle = document.querySelector('.lettre.actuel');
  const toucheAttendue = lettreActuelle?.innerHTML || ' ';
  const onALettre = key.length === 1 && key !== ' ';
  const onAEspace = key === ' ';
  const onAEfface = key === 'Backspace';
  const premiereLettre = lettreActuelle === motActuel.firstChild;

  if (document.querySelector('#game.over')) {
    return;
  }

  console.log({key,toucheAttendue});

  if (!window.timer && onALettre) {
    window.timer = setInterval(() => {
      if (!window.gameStart) {
        window.gameStart = (new Date()).getTime();
      }
      const actuelTime = (new Date()).getTime();
      const msPassé = actuelTime - window.gameStart;
      const sPassé = Math.round(msPassé / 1000);
      const sRestant = Math.round((tempPartie / 1000) - sPassé);
      if (sRestant <= 0) {
        gameOver();
        return;
      }
      document.getElementById('info').innerHTML = sRestant + '';
    }, 1000);
  }

  if(onALettre){
    if(lettreActuelle){
         if(key===toucheAttendue){
            ajoutClasse(lettreActuelle, "correct") 
            supprimeClasse(lettreActuelle,"actuel")
           if(lettreActuelle.nextSibling){// on check si on a bien une lettre apres la lettre actuelle
                ajoutClasse(lettreActuelle.nextSibling, "actuel")
            }
         }
         else{
            ajoutClasse(lettreActuelle, "incorrect")
            supprimeClasse(lettreActuelle,"actuel")
            if(lettreActuelle.nextSibling){
                ajoutClasse(lettreActuelle.nextSibling, "actuel")
            }
        }
      }
   
  }

  if (onAEspace) {
    if (toucheAttendue !== ' ') {
      const lettresToInvalidate = [...document.querySelectorAll('.mot.actuel .lettre:not(.correct)')];
      lettresToInvalidate.forEach(lettre => {
        ajoutClasse(lettre, 'incorrect');
      });
    }
    supprimeClasse(motActuel, 'actuel');
    ajoutClasse(motActuel.nextSibling, 'actuel');
    if (lettreActuelle) {
      supprimeClasse(lettreActuelle, 'actuel');
    }
    ajoutClasse(motActuel.nextSibling.firstChild, 'actuel');
  }

  if (onAEfface) {
    if (lettreActuelle && premiereLettre) {
      // make prev mot actuel, last lettre actuel
      supprimeClasse(motActuel, 'actuel');
      ajoutClasse(motActuel.previousSibling, 'actuel');
      supprimeClasse(lettreActuelle, 'actuel');
      ajoutClasse(motActuel.previousSibling.lastChild, 'actuel');
      supprimeClasse(motActuel.previousSibling.lastChild, 'incorrect');
      supprimeClasse(motActuel.previousSibling.lastChild, 'correct');
    }
    if (lettreActuelle && !premiereLettre) {
      // move back one lettre, invalidate lettre
      supprimeClasse(lettreActuelle, 'actuel');
      ajoutClasse(lettreActuelle.previousSibling, 'actuel');
      supprimeClasse(lettreActuelle.previousSibling, 'incorrect');
      supprimeClasse(lettreActuelle.previousSibling, 'correct');
    }
    if (!lettreActuelle) {
      ajoutClasse(motActuel.lastChild, 'actuel');
      supprimeClasse(motActuel.lastChild, 'incorrect');
      supprimeClasse(motActuel.lastChild, 'correct');
    }
  }

  // move lines / mots
  if (motActuel.getBoundingClientRect().top > 250) {
    const mots = document.getElementById('mots');
    const margin = parseInt(mots.style.marginTop || '0px');
    mots.style.marginTop = (margin - 35) + 'px';
  }

  // move cursor
  const nextlettre = document.querySelector('.lettre.actuel');
  const nextmot = document.querySelector('.mot.actuel');
  const cursor = document.getElementById('cursor');
  cursor.style.top = (nextlettre || nextmot).getBoundingClientRect().top + 2 + 'px';
  cursor.style.left = (nextlettre || nextmot).getBoundingClientRect()[nextlettre ? 'left' : 'right'] + 'px';
});

document.getElementById('newGameBtn').addEventListener('click', () => {
  gameOver();
  newGame();
});

newGame();
