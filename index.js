document.addEventListener("DOMContentLoaded", () => console.log("We are connected!"));

const API_URL_PREFIX = "http://api.qrserver.com/v1/create-qr-code/?data=";
const SIZE_PREFIX = "&size=";

function testFetchData() {
    console.log(fetchData("Hello World", 100));
}

function testBarcode() {
    return fetch('http://api.qrserver.com/v1/read-qr-code/?fileurl=http%3A%2F%2Fapi.qrserver.com%2Fv1%2Fcreate-qr-code%2F%3Fdata%3DHelloWorld')
        .then((response) => response.text())
        .then((data) => {
            console.log(data);
        });
}

function createBarcode() {
    const img = document.createElement('img');
    img.setAttribute("src", "https://api.qrserver.com/v1/create-qr-code/?data=HelloWorld&amp;size=100x100");
    console.log(img);
    const barDiv = document.getElementById('barcodes');
    console.log(barDiv);
    barDiv.appendChild(img);
}

function fetchData(encodedText, size) {
    return fetch(`${API_URL_PREFIX}${encodedText}${SIZE_PREFIX}${size}x${size}`)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            // Add stuff here
        })
}

// Test function
function fetchFoodData() {
    return fetch('https://world.openfoodfacts.org/api/v0/product/737628064502.json')
        .then((response) => response.json())
        .then((data) => console.log(data));
}

// testFetchData();
testBarcode();
createBarcode();
console.log(fetchFoodData());