async function loadTxtFile(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`);
        }
        const data = await response.text();
        return data;
    } catch (error) {
        console.error("Erreur lors du chargement du fichier :", error);
        return null;
    }
}

(async () => {
const test = await loadTxtFile(filePath);
console.log(test[0]); // Affichera le contenu réel du fichier
})();