const body = document.querySelector('body')

function CreatePage() {
    CreateHeader() ;
    CreateFooter() ;
}

function CreateHeader() {

}
function CreateFooter() {
    /** Create footer for all pages */
    const footer = "<footer> <p>Fait par</p><ul><li>Axel BOUTIE</li><li>Melwan KOUTAINE</li><li>Lasse KUHNT</li><li>Lorcan JOHNSON</li></ul></footer>" ;
    body.appendChild(footer) ;
}

