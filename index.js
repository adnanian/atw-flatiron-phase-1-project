// THE MAIN NON-AUTH API
const API_PREFIX = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

// LINK TO GOOGLE SEARCH WHEN THE API FAILS TO RETRIEVE A DEFINITION FOR A WORD
const WEB_SEARCH_URL_PREFIX = 'https://www.google.com/search?q=define+';

// URL FOR THE LOCAL DB.JSON FILE - WHERE ALL SAVED WORDS ARE STORED.
const GLOSSARY_RESOURCE = 'http://localhost:3000/glossary';

/*
* The following consonants represent an index of an array of table row data.
* In this context, the table row data would be from the glossary that was
* displayed to the user after successfully calling a fetch request.
*/

// In a table row of data for a saved word, this value is the index of the word's phonetic pronunciation.
const PHONETIC_INDEX = 2;

// In a table row of data for a saved word, this value is the index of the word's definition.
const DEFINITION_INDEX = 3;

// In a table row of data for a saved word, this value is the index of the word's example usage.
const EXAMPLE_INDEX = 4;

// If this variable is true, then when the dialog form is submitted, the inputs will replace the values of those in the target json object.
// If this variable is false, then when the dialog form is submitted, a new json object will be created.
let updatingSavedWord = false;

// If true, then methods that rely on the glossary to be currently displayed with run successfully.
let glossaryLoaded = false;

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
Uses a fetch request to retrieve a word from the free dicitonary API, typed in the user via form,
and all its information that the API contains regarding it.
*/
function getWord(word) {
    glossaryLoaded = false;
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

            // If no definition is found, the appropriate message is displayed to the user.
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
                document.getElementById('adder').disabled = false;
            } else {

                // Word and definitions are found.
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

                        // Categorize (create category number in the form of #.#)
                        const partOfSpeech = category["partOfSpeech"];
                        const categoryHeader = document.createElement('h4');
                        categoryHeader.textContent = `Category ${wordResultIndex + 1}.${categoryIndex + 1} - As ${correctArticleForSpeechPart(partOfSpeech)} ${capitalize(partOfSpeech)}`;
                        const table = startTable(['#', 'Definition', 'Example(s)']);

                        // Display definition
                        category["definitions"].forEach((definitionSubObject, definitionSubObjectIndex) => {

                            // Retrieve example.
                            let example = definitionSubObject["example"];
                            example = (example === undefined) ? "N/A" : example;

                            // Create a button with the text as a subcategory in the format of #.#.#.
                            const wordAdderButton = document.createElement('button');
                            wordAdderButton.setAttribute('class', 'navigation-button');
                            wordAdderButton.textContent = `${wordResultIndex + 1}.${categoryIndex + 1}.${definitionSubObjectIndex + 1}`;
                            wordAdderButton.setAttribute('title', 'Click on this numbered button to add this word and all other data in this row to your glossary.');
                            wordAdderButton.addEventListener('click', () => {
                                addToGlossary(word, phonetic.textContent, definitionSubObject["definition"], example)
                            });

                            // Add definition to table.
                            table.appendChild(createTableRow([
                                wordAdderButton,
                                definitionSubObject["definition"],
                                example]));
                        });
                        definitionDisplay.appendChild(categoryHeader);
                        definitionDisplay.appendChild(table);
                    });
                });
                document.getElementById('adder').setAttribute('disabled', 'true');
            }
        });
}

/*
Requests all objects to be retrieved from the db.json file.
Displays all saved words from the db.json file to the user.
Each object in the file has five attributes in it (including the id).
*/
function loadGlossary() {
    glossaryLoaded = true;
    document.getElementById('adder').setAttribute('disabled', 'true');
    return fetch(GLOSSARY_RESOURCE)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            // Clear definitionDisplay
            const definitionDisplay = emptyElementById('definition-display');

            // Start a new table of saved words.
            // Note: # is not the id, but the row number.
            const table = startTable(['#', 'Word', 'Phonetic', 'Definition', 'Example', 'Edit', 'Delete']);

            // Display each object as a table row.
            data.forEach((savedWord, savedWordIndex) => {
                let row;
                // Edit button - which allows the user to edit any attribute of the word object.
                const editButton = document.createElement('button');
                editButton.setAttribute('class' , 'word-manipulation');
                editButton.textContent = '<=';
                editButton.style.backgroundColor = 'blue';
                editButton.addEventListener('click', () => updateSavedWord(savedWord));

                // Delete button - which allows the user to remove the word from the glossary.
                const deleteButton = document.createElement('button');
                deleteButton.setAttribute('class', 'word-manipulation');
                deleteButton.textContent = 'X';
                deleteButton.style.backgroundColor = 'red';

                /*
                When a word is removed from the glossary, it first takes the row off
                the table, then proceeds to correct the row numbers of the rows
                superceding the deleted row.
                */
                deleteButton.addEventListener('click', () => {

                    // Delete word.
                    let removedWordIndex = savedWordIndex;
                    row.remove();
                    removeFromGlossary(savedWord.id);
                    const tableRows = Array.from(table.children);

                    /*
                    The letter, 'j', represents the new word number in the glossary table.
                    The initial value is the row previous to that which has been removed.
                    The last value is the last row in the table.
                    THe loop iterates from that range to renumber the rows.
                    */
                    for (let j = removedWordIndex; j < tableRows.length; j++) {
                        // const tableRowData = Array.from(tableRows[j].children);
                        // console.log(`Table data at index ${j}: ${tableRowData[0].textContent} - ${tableRowData[1].textContent}`);
                        tableRows[j].querySelector('td').textContent = j;
                    }
                });

                // Add row to table
                row = createTableRow([savedWordIndex + 1, savedWord.word, savedWord.phonetic, savedWord.definition, savedWord.example, editButton, deleteButton]);
                table.appendChild(row);
            });
            definitionDisplay.appendChild(table);
        });
}

// Display the glossary form to the user so that he/she can add a new entry to the glossary.
// Event listener is inside the event listener of "DOMContentLoaded", which is towrds the bottom of the code.
function addToGlossary(word, phonetic = "", definition = "", example ="") {
    updatingSavedWord = false;
    const dialog = document.getElementById('glossary-dialog');
    dialog.showModal();
    dialog.querySelector('#form-purpose').textContent = "Add to Glossary";
    dialog.querySelector('#word-to-add').textContent = word;
    dialog.querySelector('#phonetic-field').value = phonetic;
    dialog.querySelector('#definition-field').value = definition;
    dialog.querySelector('#example-field').value = example;
}

// Display the glossary form to the user so that he/she can update a currently existing entry to the glossary.
// Event listener is inside the event listener of "DOMContentLoaded", which is towrds the bottom of the code.
function updateSavedWord(wordObject) {
    updatingSavedWord = true;
    const dialog = document.getElementById('glossary-dialog');
    dialog.showModal();
    dialog.querySelector('#form-purpose').textContent = `Update Term #${wordObject.id}`;
    dialog.querySelector('#word-to-add').textContent = wordObject.word;
    dialog.querySelector('#phonetic-field').value = wordObject.phonetic;
    dialog.querySelector('#definition-field').value = wordObject.definition;
    dialog.querySelector('#example-field').value = wordObject.example;
}

// Updates a given word object's information to the glossary table.
// This method should be called only after a PATCH request, and this method will only be succesful if the glossary is currently displayed to the user.
// Event listener is inside the event listener of "DOMContentLoaded", which is towrds the bottom of the code.
function reloadTerm(wordId) {
    try {
        if (!glossaryLoaded) {
            throw error("Glossary must be currently displayed to the user in order for the word object information to be reloaded.");
        }
        return fetch(`${GLOSSARY_RESOURCE}/${wordId}`)
        .then((response) => response.json())
        .then((data) => {
            const tableRow = Array.from(document.querySelector('table').children)[wordId];
            const tableRowArray = Array.from(tableRow.children);
            tableRowArray[PHONETIC_INDEX].textContent = data.phonetic;
            tableRowArray[DEFINITION_INDEX].textContent = data.definition;
            tableRowArray[EXAMPLE_INDEX].textContent = data.example;
        });
    } catch (error) {
        alert(error.message);
    }
}

// Removes a word from the glossary.
function removeFromGlossary(wordId) {
    return fetch(`${GLOSSARY_RESOURCE}/${wordId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            "Accept": "application/json"
        }
    })
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
        console.log(`A word has been removed from the glossary.`);
    });
}

// Begin initializations.
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

    // Add/update term to glossary
    const dialog = document.getElementById('glossary-dialog');
    dialog.querySelector('#submit-form').addEventListener('click', (e) => {
        e.preventDefault();
        dialog.close();
        const form = dialog.querySelector('#glossary-form');
        let promise;

        //  When the user wants to update a word object.
        if (updatingSavedWord) {
            const formPurpose = document.getElementById('form-purpose');
            promise = fetch(`${GLOSSARY_RESOURCE}/${formPurpose.textContent.slice(formPurpose.textContent.length - 1)}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(
                    {
                        word: form.querySelector('#word-to-add').textContent,
                        phonetic: form.querySelector('#phonetic-field').value,
                        definition: form.querySelector('#definition-field').value,
                        example: form.querySelector('#example-field').value
                    }    
                )
            })
            .then((response) => response.json())
            .then((updatedTerm) => {
                console.log("Term updated!");
                console.log(updatedTerm);
                console.log(reloadTerm(updatedTerm.id));
            });
        } else {

            // When the user wants to add a new word object.
            promise = fetch(GLOSSARY_RESOURCE, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(
                    {
                        word: form.querySelector('#word-to-add').textContent,
                        phonetic: form.querySelector('#phonetic-field').value,
                        definition: form.querySelector('#definition-field').value,
                        example: form.querySelector('#example-field').value
                    }    
                )
            })
            .then((response) => response.json())
            .then((newWord) => {
                console.log("New word added!");
                console.log(newWord);
            });
        }
        console.log(promise);
    });
    // Cancel word addition/modification
    dialog.querySelector('#cancel-form').addEventListener('click', () => {dialog.close()});

    // Add word not found in dictionary API to glossary
    document.getElementById('adder').addEventListener('click', () => addToGlossary(document.getElementById('display-word').textContent));

});