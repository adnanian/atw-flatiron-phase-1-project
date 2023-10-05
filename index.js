const API_PREFIX = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

// ADD HERE
const MEANINGS_INDEX = 1;

// ADD HERE
const DEFINITION_INDEX = 1;

function getWord(word) {
    return fetch(`${API_PREFIX}${word}`)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
        
            const p = document.getElementById('definitions');
            p.textContent = data[0]["meanings"][0]["definitions"][0]["definition"];
        });
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("We are connected!");

    // Submit Event Listener for Word-Search-Form
    document.getElementById('word-search-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const word = e.target.word.value;
        document.getElementById('display-word').textContent = word;
        console.log(word);
        console.log(getWord(word));
    });

    // MouseOverEvent Listeners
    document.getElementById('display-word').addEventListener('mouseover', (e) => {
        e.target.style.color = 'green';
    });
    document.getElementById('display-word').addEventListener('mouseout', (e) => {
        e.target.style.color = 'black';
    });
});