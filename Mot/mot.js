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

function updateTempInfo() {
  document.getElementById('info').innerHTML = `${tempPartie / 1000} sec`;
}

document.addEventListener('DOMContentLoaded', () => {
  const tempSelect = document.getElementById("tempSelect");

  // Définir la valeur initiale de tempPartie
  tempPartie = parseInt(tempSelect.value, 10) * 1000;
  updateTempInfo(); // Met à jour l'affichage initial

  // Ajouter un écouteur d'événement pour gérer les changements
  tempSelect.addEventListener('change', (event) => {
      tempPartie = parseInt(event.target.value, 10) * 1000;
      updateTempInfo(); // Met à jour l'affichage après changement
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
  await sourcemot.loadTextArray(); // Charger les mots

  // Réinitialiser le contenu de la zone de jeu
  const motsContainer = document.getElementById('mots');
  motsContainer.innerHTML = '';

  // Ajouter les nouveaux mots
  for (let i = 0; i < 200; i++) {
    motsContainer.innerHTML += insertMot(motHasard());
  }
  updateTempInfo();
  // Activer le premier mot et la première lettre
  ajoutClasse(document.querySelector('.mot'), 'actuel');
  ajoutClasse(document.querySelector('.lettre'), 'actuel');

  // Réinitialiser le timer d'information
  document.getElementById('info').innerHTML = (tempPartie / 1000).toString();
}

function playKeySound() {
  const audio = new Audio('keypress.mp3'); // Chemin vers votre fichier audio
  audio.volume = 0.5; // Ajustez le volume si nécessaire
  audio.play().catch((error) => {
      console.error("Erreur lors de la lecture du son :", error);
  });
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
  return correctmots.length / tempSelect.value * 60;
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
    playKeySound();
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
    playKeySound();
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
    
    playKeySound();
  
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

document.getElementById('newGameBtn').addEventListener('click', async () => {
  clearInterval(window.timer); // Stop any ongoing timer
  window.timer = null;
  window.gameStart = null;
  window.pauseTime = 0;

  // Réinitialiser les styles des mots
  const mots = document.querySelectorAll('.mot');
  mots.forEach((mot) => mot.className = 'mot');
  const lettres = document.querySelectorAll('.lettre');
  lettres.forEach((lettre) => lettre.className = 'lettre');

  // Réinitialiser l'interface utilisateur
  document.getElementById('info').innerHTML = `${tempPartie / 1000}`;
  document.getElementById('mots').style.marginTop = '0px';
  document.getElementById('cursor').style.display = 'none';
  supprimeClasse(document.getElementById('game'), 'over');

  // Charger les nouveaux mots et démarrer un nouveau jeu
  await newGame();
});

newGame();
