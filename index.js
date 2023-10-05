const API_PREFIX = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

function getWord(word) {
    return fetch(`${API_PREFIX}${word}`)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            console.log(data.length);
        });
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("We are connected!");
    document.getElementById('word-search-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const word = e.target.word.value;
        console.log(word);
        console.log(getWord(word));
    });
});