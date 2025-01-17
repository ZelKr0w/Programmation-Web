function afficherOptions() {
  const tempSelect = document.querySelector('select#tempSelect').parentElement;
  const nivSelect = document.querySelector('select#NivSelect').parentElement;

  tempSelect.style.display = 'block';
  nivSelect.style.display = 'block';
}
// Fonction de sélection du niveau
function choixNiveau() {
  const niveau = document.getElementById("NivSelect").value;
  const niveaux = {
      "lv1": "id1",
      "lv2": "id2",
      "lv3": "id3"
  };
  return niveaux[niveau] || "id1"; // Par défaut, retourne `id1` si le niveau est introuvable
}

// Classe Mot pour la gestion des mots
class Mot {
  constructor() {
      this.lien = this.recupLien();
      this.tabMots = [];
      this.tailleTab = 0;
  }

  recupLien() {
      return "https://raw.githubusercontent.com/ZelKr0w/Programmation-Web/refs/heads/master/Annexes/mots/" + choixNiveau();
  }

  updatelien() {
      this.lien = this.recupLien();
  }

  async loadTextArray() {
      try {
          const response = await fetch(this.lien);
          if (!response.ok) {
              throw new Error(`Erreur lors du chargement du fichier : ${response.statusText}`);
          }
          const text = await response.text();
          this.tabMots = text.split(/\s+/); // Divise le contenu en un tableau de mots
          this.tailleTab = this.tabMots.length; // Met à jour la taille du tableau
      } catch (error) {
          console.error("Erreur :", error);
          this.tabMots = []; // Vide le tableau en cas d'erreur
          this.tailleTab = 0;
      }
  }
}

// Instance de la classe Mot
const sourcemot = new Mot();

// Gestion de l'événement de changement de niveau
document.getElementById("NivSelect").addEventListener("change", async () => {
    sourcemot.updatelien(); // Met à jour le lien de l'instance
    await sourcemot.loadTextArray(); // Recharge les mots avec le nouveau lien
    console.log("Mots chargés pour le nouveau niveau :", sourcemot.tabMots);

    // Redémarrer le jeu après changement de niveau
    await newGame();
});

// Gestion du timer et du temps de jeu
let tempPartie = 30000; // Valeur par défaut (30 secondes)

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

// Fonctions utilitaires pour la gestion des classes CSS
function ajoutClasse(el, name) {
  el.className += ' ' + name;
}

function supprimeClasse(el, name) {
  el.className = el.className.replace(name, '');
}

// Fonction pour récupérer un mot au hasard
function motHasard() {
  const randomIndex = Math.ceil(Math.random() * sourcemot.tailleTab);
  return sourcemot.tabMots[randomIndex - 1];
}

// Fonction pour insérer un mot dans le HTML
function insertMot(mot) {
  return `<div class="mot"><span class="lettre">${mot.split('').join('</span><span class="lettre">')}</span></div>`;
}

// Fonction pour démarrer un nouveau jeu
async function newGame() {
  
  await sourcemot.loadTextArray(); // Charger les mots

  // Réinitialiser le contenu de la zone de jeu
  const motsContainer = document.getElementById('mots');
  motsContainer.innerHTML = '';

  // Ajouter les nouveaux mots
  for (let i = 0; i < 200; i++) {
      motsContainer.innerHTML += insertMot(motHasard());
  
  }
  afficherOptions();
  updateTempInfo();


  // Activer le premier mot et la première lettre
  ajoutClasse(document.querySelector('.mot'), 'actuel');
  ajoutClasse(document.querySelector('.lettre'), 'actuel');

  // Réinitialiser le timer d'information
  document.getElementById('info').innerHTML = (tempPartie / 1000).toString();
}
// Fonction pour jouer un son à chaque frappe de touche
function playKeySound() {
  const audio = new Audio('keypress.mp3'); // Chemin vers votre fichier audio
  audio.volume = 0.5; // Ajustez le volume si nécessaire
  audio.play().catch((error) => {
      console.error("Erreur lors de la lecture du son :", error);
  });
}

// Fonction pour calculer les mots par minute
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
  return correctmots.length / parseInt(tempSelect.value, 10) * 60;
}

// Fonction de fin de jeu
function gameOver() {
  clearInterval(window.timer);
  ajoutClasse(document.getElementById('game'), 'over');
  const result = motsParMinute();
  localStorage.setItem("resultat", result);
  document.getElementById('info').innerHTML = `WPM: ${result}`;
  window.location.href = 'pagefin.html';
}

// Gestion des événements de touche
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
         if(key === toucheAttendue){
            ajoutClasse(lettreActuelle, "correct"); 
            supprimeClasse(lettreActuelle,"actuel");
            if(lettreActuelle.nextSibling) { // Check if next letter exists
                ajoutClasse(lettreActuelle.nextSibling, "actuel");
            }
         }
         else{
            ajoutClasse(lettreActuelle, "incorrect");
            supprimeClasse(lettreActuelle,"actuel");
            if(lettreActuelle.nextSibling){
                ajoutClasse(lettreActuelle.nextSibling, "actuel");
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
        // Vérifie s'il existe un mot précédent
        if (motActuel.previousSibling) {
            // Rend le mot précédent actuel et active la dernière lettre
            supprimeClasse(motActuel, 'actuel');
            ajoutClasse(motActuel.previousSibling, 'actuel');
            supprimeClasse(lettreActuelle, 'actuel');
            ajoutClasse(motActuel.previousSibling.lastChild, 'actuel');
            supprimeClasse(motActuel.previousSibling.lastChild, 'incorrect');
            supprimeClasse(motActuel.previousSibling.lastChild, 'correct');
        }
    }

    if (lettreActuelle && !premiereLettre) {
        // Déplace la sélection vers la lettre précédente
        supprimeClasse(lettreActuelle, 'actuel');
        ajoutClasse(lettreActuelle.previousSibling, 'actuel');
        supprimeClasse(lettreActuelle.previousSibling, 'incorrect');
        supprimeClasse(lettreActuelle.previousSibling, 'correct');
    }

    if (!lettreActuelle) {
        // Si aucune lettre actuelle, active la dernière lettre du mot actuel
        ajoutClasse(motActuel.lastChild, 'actuel');
        supprimeClasse(motActuel.lastChild, 'incorrect');
        supprimeClasse(motActuel.lastChild, 'correct');
    }
}

  // Bouger le cursuer
  const nextlettre = document.querySelector('.lettre.actuel');
  const nextmot = document.querySelector('.mot.actuel');
  const cursor = document.getElementById('cursor');
  cursor.style.top = (nextlettre || nextmot).getBoundingClientRect().top + 2 + 'px';
  cursor.style.left = (nextlettre || nextmot).getBoundingClientRect()[nextlettre ? 'left' : 'right'] + 'px';
});

// Gestion du bouton pour démarrer un nouveau jeu
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

//pour flouter le choix du temps et du niveau quand on commence à écrire
document.addEventListener("DOMContentLoaded", function() {
  

  const gameElement = document.getElementById('game');
  const tempSelect = document.querySelector('select#tempSelect').parentElement;
  const nivSelect = document.querySelector('select#NivSelect').parentElement;
  const headerElement = document.getElementById('header');

  
  gameElement.addEventListener('focus', () => {
      tempSelect.style.display = 'none';
      nivSelect.style.display = 'none';
  });

  
  
})
// Démarrer un nouveau jeu au chargement de la page
newGame();

