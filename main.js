function RecupNameFile() {
    var nom = window.location.pathname;
    nom = nom.split("/");
    nom = nom[nom.length - 1];
    nom = nom.substr(0, nom.lastIndexOf("."));
    nom = nom.replace(new RegExp("(%20|_|-)", "g"), "");
    return nom ;
}

function SelectTxtHeader() {
    /// Selection de header différents à cause des redirections des balises nav => nécéssaire de diffentier chaque header
    let FileName = RecupNameFile() ;

    let txtheader1 = '<h1> <i id="img" class="fa-regular fa-keyboard"></i> Typing Challenge <i id="img" class="fa-regular fa-keyboard"></i></h1><nav class="nav"><a href=';
    let txtheader2 = 'class="nav-link"><i class="fa-solid fa-house"></i></a><a href=' ;
    let txtheader3 = 'class="nav-link">Texte</a><a href=';
    let txtheader4 = 'class="nav-link">Mot au Hasard</a><a href=';
    let txtheader5 = 'class="nav-link">Phrase au Hasard</a></nav>' ;

    let txtheader = "" ;
    if (FileName === "Selectmoth" || FileName === "Selectphraseh" || FileName === "Selecttext" ) {
        txtheader = txtheader1+'"../index.html"'+txtheader2+'"./Select_text.html"'+txtheader3+'"./Select_mot_h.html"'+txtheader4+'"./Select_phrase_h.html"'+txtheader5 ;
    } 
    else if (FileName === "mot" || FileName === "phrase" || FileName === "Texte") {
        txtheader = txtheader1+'"../index.html"'+txtheader2+'"../Selection/Select_text.html"'+txtheader3+'"../Selection/Select_mot_h.html"'+txtheader4+'"../Selection/Select_phrase_h.html"'+txtheader5 ;
    } 
    else {
        txtheader = txtheader1+'"./index.html"'+txtheader2+'"./Selection/Select_text.html"'+txtheader3+'"./Selection/Select_mot_h.html"'+txtheader4+'"./Selection/Select_phrase_h.html"'+txtheader5 ;
    } ;
    return txtheader ;
}

function CreatePage() {
    CreateHeader() ;
    CreateFooter() ;
}

function CreateHeader() {
    const main = document.querySelector("main") ;
    const body = document.querySelector("body") ;
    const header = document.createElement("header") ;
    header.innerHTML = SelectTxtHeader() ;
    body.insertBefore(header,main) ;
}
function CreateFooter() {
    /** Create footer for all pages */
    const body = document.querySelector("body") ;
    const txtfooter = '<footer> <p>Fait par</p><ul class="nav-link"><li>Axel BOUTIE</li><li>Melwan KOUTAINE</li><li>Lasse KUHNT</li><li>Lorcan JOHNSON</li></ul></footer>' ;
    const footer = document.createElement("footer") ;
    footer.innerHTML = txtfooter ;
    body.appendChild(footer) ;
}

CreatePage();
console.log() ;
