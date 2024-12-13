function RecupNameFile() {
    var nom = window.location.pathname;
    nom = nom.split("/");
    nom = nom[nom.length - 1];
    nom = nom.substr(0, nom.lastIndexOf("."));
    nom = nom.replace(new RegExp("(%20|_|-)", "g"), "");
    return nom ;
}

function CreatePage() {
    CreateHeader() ;
    CreateFooter() ;
}

function CreateHeader() {
    const main = document.querySelector("main") ;
    const body = document.querySelector("body") ;
    let FileName = RecupNameFile() ;
    let txtheader = "" ;
    if (FileName === "Selectmoth" || FileName === "Selectphraseh" || FileName === "Selecttext" ) {
        txtheader = '<header><h1>Typing Challenge</h1><i id="img" class="fa-regular fa-keyboard"></i><nav class="nav"><a href="../index.html"><i class="fa-solid fa-house"></i></a><a href="./Select_text.html">Texte</a><a href="./Select_mot_h.html">Mot au Hasard</a><a href="./Select_phrase_h.html">Phrase au Hasard</a></nav></header>' ;
    } 
    else {
        txtheader = '<header><h1>Typing Challenge</h1><i id="img" class="fa-regular fa-keyboard"></i><nav class="nav"><a href="./index.html"><i class="fa-solid fa-house"></i></a><a href="./Selection/Select_text.html">Texte</a><a href="./Selection/Select_mot_h.html">Mot au Hasard</a><a href="./Selection/Select_phrase_h.html">Phrase au Hasard</a></nav></header>' ;
    } ;
    const header = document.createElement("header") ;
    header.innerHTML = txtheader ;
    body.insertBefore(header,main) ;
}
function CreateFooter() {
    /** Create footer for all pages */
    const body = document.querySelector("body") ;
    const txtfooter = "<footer> <p>Fait par</p><ul><li>Axel BOUTIE</li><li>Melwan KOUTAINE</li><li>Lasse KUHNT</li><li>Lorcan JOHNSON</li></ul></footer>" ;
    const footer = document.createElement("footer") ;
    footer.innerHTML = txtfooter ;
    body.appendChild(footer) ;
}

CreatePage();
console.log() ;
