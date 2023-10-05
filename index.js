const API_PREFIX = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

// ADD HERE
const MEANINGS_INDEX = 1;

// ADD HERE
const DEFINITION_INDEX = 1;

// Helper function for correct grammar when displaying data.
const correctArticleForSpeechPart = function(partOfSpeech) {
    switch (partOfSpeech.toLowerCase()) {
        case 'adjective':
        case 'article':
        case 'adverb':
        case 'interjection':
            return 'an';
        default:
            return 'a';
    }
};

const capitalize = function(word) {
    return word[0].toUpperCase() + word.slice(1);
};

function getWord(word) {
    return fetch(`${API_PREFIX}${word}`)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            //displayDefinitionsAsList(data);
            displayDefinitionsAsTable(data);
        });
}

function displayDefinitionsAsList(data) {
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

function displayDefinitionsAsTable(data) {
    const definitionDisplay = document.getElementById('definition-display');
    definitionDisplay.innerHTML = "";
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i]["meanings"].length; j++) {

            const partOfSpeech = data[i]["meanings"][j]["partOfSpeech"];

            // Create category
            const category = document.createElement('h4');
            category.textContent = `Category ${i + 1}.${j + 1} - As ${correctArticleForSpeechPart(partOfSpeech)} ${capitalize(partOfSpeech)}`;
            const table = document.createElement('table');
            table.innerHTML = `
            <tr>
                <th>#</th>
                <th>Definition</th>
                <th>Example(s)</th>
            </tr>
            `;

            // Create table data
            for (let k = 0; k < data[i]["meanings"][j]["definitions"].length; k++) {
                const defEntry = document.createElement('tr');
                // Retrieve example.
                let example = data[i]["meanings"][j]["definitions"][k]["example"];
                example = (example === undefined) ? "" : example;
                defEntry.innerHTML = 
                    `
                    <td>${i+1}.${j+1}.${k+1}</td>
                    <td>${data[i]["meanings"][j]["definitions"][k]["definition"]}</td>
                    <td>${example}</td>
                    `;
                table.appendChild(defEntry);
            }
        definitionDisplay.appendChild(category);
        definitionDisplay.appendChild(table);
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