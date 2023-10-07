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

// Helper function for capitalizing the first letter of a given word.
const capitalize = function(word) {
    return word[0].toUpperCase() + word.slice(1);
};

// Helper function for clearing all children from a given node.
const clearChildrenFromElement = function(node) {
    while (node.firstChild) {
        node.removeChild(node.lastChild);
    }
};

// Helper function for creating table headers, with a given array of header names.
const createTableHeaders = function(headers) {
    console.log(headers.length);
    const tr = document.createElement('tr');
    headers.forEach((header) => {
        const th = document.createElement('th');
        th.textContent = header;
        tr.appendChild(th);
    });
    return tr;
};


// Helper function for creating table rows, with a given array of data.
const createTableRow = function(rowData) {
    console.log(rowData.length);
    const tr = document.createElement('tr');
    rowData.forEach((cell) => {
        const td = document.createElement('td');
        td.textContent = cell;
        tr.appendChild(td);
    });
    return tr;
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

/* function displayDefinitionsAsList(data) {
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
} */

function displayDefinitionsAsTable(data) {
    const definitionDisplay = document.getElementById('definition-display');
    clearChildrenFromElement(definitionDisplay);
    for (let i = 0; i < data.length; i++) {
        // Create phonetic and play audio.
        const phonetic = document.createElement('h4');
        phonetic.textContent = data[i]["phonetic"];
        phonetic.addEventListener('mouseenter', (e) => {
            e.target.style.color = 'red';
            const audioObject = data[i]["phonetics"].find((phoneticObject) => phoneticObject.audio !== '');
            new Audio(audioObject.audio).play();
        });
        phonetic.addEventListener('mouseleave', (e) => e.target.style.color = 'black');
        definitionDisplay.appendChild(phonetic);

        for (let j = 0; j < data[i]["meanings"].length; j++) {

            const partOfSpeech = data[i]["meanings"][j]["partOfSpeech"];

            // Create category
            const category = document.createElement('h4');
            category.textContent = `Category ${i + 1}.${j + 1} - As ${correctArticleForSpeechPart(partOfSpeech)} ${capitalize(partOfSpeech)}`;
            const table = document.createElement('table');
            table.appendChild(createTableHeaders(['#', 'Definition', 'Example(s)']));

            // Create table data
            for (let k = 0; k < data[i]["meanings"][j]["definitions"].length; k++) {
                // Retrieve example.
                let example = data[i]["meanings"][j]["definitions"][k]["example"];
                example = (example === undefined) ? "N/A" : example;
                table.appendChild(createTableRow([`${i+1}.${j+1}.${k+1}`, data[i]["meanings"][j]["definitions"][k]["definition"], example]));
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
        e.target.word.value = "";
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