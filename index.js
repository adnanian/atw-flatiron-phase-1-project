// THE MAIN NON-AUTH API
const API_PREFIX = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

// LINK TO GOOGLE SEARCH WHEN THE API FAILS TO RETRIEVE A DEFINITION FOR A WORD
const WEB_SEARCH_URL_PREFIX = 'https://www.google.com/search?q=define+';

// URL FOR THE LOCAL DB.JSON FILE - WHERE ALL SAVED WORDS ARE STORED.
const GLOSSARY_RESOURCE = 'http://localhost:3000/glossary';

// Helper function for correct grammar when displaying data.
const correctArticleForSpeechPart = function (partOfSpeech) {
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
const capitalize = function (word) {
    return word[0].toUpperCase() + word.slice(1);
};

// Helper function for clearning all children from a given node with an id. Returns the node afterwards.
const emptyElementById = function (id) {
    const node = document.getElementById(id);
    while (node.firstChild) {
        node.removeChild(node.lastChild);
    }
    return node;
};

/*
Helper function that does the following:
- Creates a table element.
- Adds headers to the table with a given array of header names.
- Returns the table.
*/
const startTable = function (headers) {
    const table = document.createElement('table');
    const tr = document.createElement('tr');
    headers.forEach((header) => {
        const th = document.createElement('th');
        th.textContent = header;
        tr.appendChild(th);
    });
    table.appendChild(tr);
    return table;
};


// Helper function for creating table rows, with a given array of data.
const createTableRow = function (rowData) {
    console.log(rowData.length);
    const tr = document.createElement('tr');
    rowData.forEach((cell) => {
        const td = document.createElement('td');
        if (cell instanceof Element) {
            td.appendChild(cell);
        } else {
            td.textContent = cell;
        }
        tr.appendChild(td); 
    });
    return tr;
};

/*
TODO
*/
function getWord(word) {
    let statusCode;
    return fetch(`${API_PREFIX}${word}`)
        .then((response) => {
            statusCode = response.status;
            console.log(`Status Code: ${statusCode}`);
            return response.json();
        })
        .then((data) => {
            console.log(data);
            // Clear definitionDisplay
            const definitionDisplay = emptyElementById('definition-display');
            if (statusCode === 404) {
                // Add error Title - No definitions found
                const errorHeader = document.createElement('h3');
                errorHeader.textContent = data.title;
                definitionDisplay.appendChild(errorHeader);
                // Display message and resolution
                const errorMessage = document.createElement('p');
                errorMessage.textContent = `${data.message}\n${data.resolution}\n`;
                definitionDisplay.appendChild(errorMessage);
                // Allow option to go to the web
                const webSearchButton = document.createElement('button');
                webSearchButton.setAttribute('class', 'navigation-button');
                webSearchButton.textContent = 'Find Definition(s) on the Web';
                webSearchButton.addEventListener('click', (e) => {
                    window.open(`${WEB_SEARCH_URL_PREFIX}${word}`, '_blank').focus();
                });
                definitionDisplay.appendChild(webSearchButton);
            } else {
                data.forEach((wordResult, wordResultIndex) => {
                    // Display phonetic and play pronunciation of the word.
                    const phonetic = document.createElement('h3');
                    phonetic.textContent = wordResult["phonetic"];
                    phonetic.addEventListener('mouseenter', (e) => {
                        e.target.style.color = 'red';
                        const audioObject = wordResult["phonetics"].find((phoneticObject) => phoneticObject.audio !== '');
                        if (audioObject !== undefined) {
                            new Audio(audioObject.audio).play();
                        }
                    });
                    phonetic.addEventListener('mouseleave', (e) => e.target.style.color = 'black');
                    definitionDisplay.appendChild(phonetic);

                    /*
                    I substitute the word, "meaning", with "category". In the context
                    of the free dictionary API, is what I interpret to be a collection
                    of related definitions of a word.
                    */
                    wordResult["meanings"].forEach((category, categoryIndex) => {
                        // Categorize
                        const partOfSpeech = category["partOfSpeech"];
                        const categoryHeader = document.createElement('h4');
                        categoryHeader.textContent = `Category ${wordResultIndex + 1}.${categoryIndex + 1} - As ${correctArticleForSpeechPart(partOfSpeech)} ${capitalize(partOfSpeech)}`;
                        const table = startTable(['#', 'Definition', 'Example(s)']);

                        // Display definition
                        category["definitions"].forEach((definitionSubObject, definitionSubObjectIndex) => {
                            // Retrieve example.
                            let example = definitionSubObject["example"];
                            example = (example === undefined) ? "N/A" : example;
                            const wordAdderButton = document.createElement('button');
                            wordAdderButton.setAttribute('class', 'navigation-button');
                            wordAdderButton.textContent = `${wordResultIndex + 1}.${categoryIndex + 1}.${definitionSubObjectIndex + 1}`;
                            wordAdderButton.setAttribute('title', 'Click on this numbered button to add this word and all other data in this row to your glossary.');
                            wordAdderButton.addEventListener('click', () => {
                                addToGlossary(word, phonetic.textContent, definitionSubObject["definition"], example)
                            });

                            table.appendChild(createTableRow([
                                wordAdderButton,
                                definitionSubObject["definition"],
                                example]));
                        });
                        definitionDisplay.appendChild(categoryHeader);
                        definitionDisplay.appendChild(table);
                    });
                });
            }
        });
}

/*
TODO
*/
function loadGlossary() {
    return fetch(GLOSSARY_RESOURCE)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            // Clear definitionDisplay
            const definitionDisplay = emptyElementById('definition-display');
            const table = startTable(['#', 'Word', 'Phonetic', 'Definition', 'Example', 'Edit', 'Delete']);
            data.forEach((savedWord) => {
                // Edit button
                const editButton = document.createElement('button');
                editButton.setAttribute('class' , 'word-manipulation');
                editButton.textContent = '&#916;';
                editButton.style.backgroundColor = 'blue';
                editButton.addEventListener('click', () => updateSavedWord(savedWord));
                // Delete button
                const deleteButton = document.createElement('button');
                deleteButton.setAttribute('class', 'word-manipulation');
                deleteButton.textContent = 'X';
                deleteButton.style.backgroundColor = 'red';
                deleteButton.addEventListener('click', () => removeFromGlossary(savedWord));
                table.appendChild(createTableRow([savedWord.id, savedWord.word, savedWord.phonetic, savedWord.definition, savedWord.example, editButton, deleteButton]));
            });
            definitionDisplay.appendChild(table);
        });
}

// TODO
function addToGlossary(word, phonetic = "", definition = "", example ="") {
    const dialog = document.getElementById('glossary-dialog');
    dialog.showModal();
    dialog.querySelector('#form-purpose').textContent = "Add to Glossary";
    dialog.querySelector('#word-to-add').textContent = word;
    dialog.querySelector('#phonetic-field').value = phonetic;
    dialog.querySelector('#definition-field').value = definition;
    dialog.querySelector('#example-field').value = example;
    dialog.querySelector('#glossary-form').addEventListener('submit', (e) => {
        e.preventDefault();
        dialog.close();
        const promise = fetch(GLOSSARY_RESOURCE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Accept": "application/json"
            },
            body: JSON.stringify(
                {
                    word: e.target.querySelector('#word-to-add').textContent,
                    phonetic: e.target.querySelector('#phonetic-field').value,
                    definition: e.target.querySelector('#definition-field').value,
                    example: e.target.querySelector('#example-field').value
                }    
            )
        })
        .then((response) => response.json())
        .then((newWord) => {
            console.log("New word added!");
            console.log(newWord);
        });
        console.log(promise);
    });
}

// TODO
function updateSavedWord(word) {

}

// TODO
function removeFromGlossary(word) {

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

    // Click Events for the navigational buttons
    document.getElementById('loader').addEventListener('click', () => {
        document.getElementById('display-word').textContent = "GLOSSARY OF SAVED WORDS LOADED";
        console.log(loadGlossary());
    });

});