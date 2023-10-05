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
            displayDefinitions(data);
        });
}

function displayDefinitions(data) {
    const definitionsList = document.getElementById('definitions-list');
    definitionsList.innerHTML = "";
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i]["meanings"].length; j++) {
            for (let k = 0; k < data[i]["meanings"][j]["definitions"].length; k++) {
                const li = document.createElement('li');
                li.textContent = data[i]["meanings"][j]["definitions"][k]["definition"];
                definitionsList.appendChild(li);
            }
        }
    }
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

    // Click Event for word
    document.getElementById('display-word').addEventListener('click', (e) => {
        try {
            
        } catch (error) {
            console.error(error.message);
        }
    })
});