const wordsToFind = ["EXEMPLE", "TEST", "JEU", "PROGRAMME", "ORDINATEUR", "ALGORITHME", "DEVELOPPEUR", "LANGAGE", "CODE", "LOGICIEL"];
const gridSize = 10; // Taille de la grille (10x10 dans cet exemple)
let wordGrid = []; // Stockage de la grille de lettres
let timer; // Variable pour le minuteur
let timerStarted = false; // Indicateur si le minuteur a été démarré

// Fonction pour initialiser le jeu
function initGame() {
    createWordGrid();
    displayWordList();
    document.getElementById("timer").textContent = "Temps restant : 03:00";
    document.getElementById("messages").textContent = "";
}

// Fonction pour créer la grille de mots cachés
function createWordGrid() {
    // Générer une grille de lettres aléatoires
    for (let i = 0; i < gridSize; i++) {
        let row = [];
        for (let j = 0; j < gridSize; j++) {
            row.push(generateRandomLetter());
        }
        wordGrid.push(row);
    }

    // Afficher la grille dans le HTML
    const wordGridContainer = document.getElementById("word-grid");
    wordGridContainer.innerHTML = ""; // Effacer la grille précédente

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            let cell = document.createElement("div");
            cell.textContent = wordGrid[i][j];
            wordGridContainer.appendChild(cell);
        }
    }
}

// Fonction pour générer une lettre aléatoire
function generateRandomLetter() {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return alphabet[Math.floor(Math.random() * alphabet.length)];
}

// Fonction pour afficher la liste des mots à trouver
function displayWordList() {
    const wordListContainer = document.getElementById("word-list");
    wordListContainer.innerHTML = ""; // Effacer la liste précédente

    wordsToFind.forEach(word => {
        let li = document.createElement("li");
        li.textContent = word;
        li.addEventListener("click", () => highlightWord(word));
        wordListContainer.appendChild(li);
    });
}

// Fonction pour surligner le mot trouvé dans la grille
function highlightWord(word) {
    const wordGridContainer = document.getElementById("word-grid");
    const cells = wordGridContainer.getElementsByTagName("div");

    for (let cell of cells) {
        cell.style.backgroundColor = "#fff"; // Réinitialiser la couleur de fond de toutes les cellules
    }

    // Trouver le mot dans la grille et le surligner
    let found = false;
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (checkWord(word, i, j, 1, 0) || checkWord(word, i, j, 0, 1) || 
                checkWord(word, i, j, 1, 1) || checkWord(word, i, j, 1, -1)) {
                found = true;
                break;
            }
        }
        if (found) break;
    }

    if (!found) {
        displayMessage("Mot non trouvé dans la grille !");
    }
}

// Fonction pour vérifier si un mot peut être trouvé à partir des coordonnées données et de la direction
function checkWord(word, startRow, startCol, dirRow, dirCol) {
    const wordLength = word.length;
    const endRow = startRow + dirRow * (wordLength - 1);
    const endCol = startCol + dirCol * (wordLength - 1);

    if (endRow < 0 || endRow >= gridSize || endCol < 0 || endCol >= gridSize) {
        return false;
    }

    let found = true;
    for (let i = 0; i < wordLength; i++) {
        const row = startRow + i * dirRow;
        const col = startCol + i * dirCol;
        const cell = wordGrid[row][col];
        const cellElement = document.getElementById("word-grid").childNodes[row * gridSize + col];

        if (cell !== word[i]) {
            found = false;
            break;
        } else {
            cellElement.style.backgroundColor = "#c0ffc0"; // Surligner la cellule
        }
    }

    if (found) {
        displayMessage(`Mot trouvé : ${word}`);
    }

    return found;
}

// Fonction pour réinitialiser le jeu
function resetGame() {
    wordGrid = [];
    clearInterval(timer);
    timerStarted = false;
    document.getElementById("timer").textContent = "Temps restant : 03:00";
    document.getElementById("messages").textContent = "";
    initGame();
}

// Fonction pour démarrer le jeu et le minuteur
function startGame() {
    if (!timerStarted) {
        startTimer(3); // Démarrer un minuteur de 3 minutes
        timerStarted = true;
    }
}

// Fonction pour démarrer un minuteur
function startTimer(minutes) {
    const now = Date.now();
    const then = now + minutes * 60 * 1000;
    displayTimeLeft(minutes * 60);

    timer = setInterval(() => {
        const secondsLeft = Math.round((then - Date.now()) / 1000);
        if (secondsLeft <= 0) {
            clearInterval(timer);
            displayMessage("Temps écoulé !");
            return;
        }
        displayTimeLeft(secondsLeft);
    }, 1000);
}

// Fonction pour afficher le temps restant
function displayTimeLeft(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainderSeconds = seconds % 60;
    const display = `Temps restant : ${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
    document.getElementById("timer").textContent = display;
}

// Fonction pour afficher les messages
function displayMessage(message) {
    const messageContainer = document.getElementById("messages");
    messageContainer.textContent = message;
}

// Fonction pour générer de nouveaux mots
function generateNewWords() {
    // Réinitialiser les mots et la grille
    resetGame();
    // Vous pouvez ici implémenter une logique pour générer une nouvelle liste de mots
    // Pour l'exemple, nous allons mélanger la liste existante
    wordsToFind.sort(() => Math.random() - 0.5);
    displayWordList();
}

// Initialiser le jeu lorsque la page se charge
document.addEventListener("DOMContentLoaded", initGame);
