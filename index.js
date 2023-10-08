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

// Helper function for clearing all children from a given node.
const clearChildrenFromElement = function (node) {
    while (node.firstChild) {
        node.removeChild(node.lastChild);
    }
};

// Helper function for creating table headers, with a given array of header names.
const createTableHeaders = function (headers) {
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
const createTableRow = function (rowData) {
    console.log(rowData.length);
    const tr = document.createElement('tr');
    rowData.forEach((cell) => {
        const td = document.createElement('td');
        td.textContent = cell;
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
            const definitionDisplay = document.getElementById('definition-display');
            clearChildrenFromElement(definitionDisplay);
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
                        const table = document.createElement('table');
                        table.appendChild(createTableHeaders(['#', 'Definition', 'Example(s)']));

                        // Display definition
                        category["definitions"].forEach((definitionSubObject, definitionSubObjectIndex) => {
                            // Retrieve example.
                            let example = definitionSubObject["example"];
                            example = (example === undefined) ? "N/A" : example;
                            table.appendChild(createTableRow([
                                `${wordResultIndex + 1}.${categoryIndex + 1}.${definitionSubObjectIndex + 1}`,
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