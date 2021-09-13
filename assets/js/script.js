const API_KEY = "0ZDpIAcsFcyG8Tn_6aZxrNtEakA";
const API_URL = "https://ci-jshint.herokuapp.com/api";
// using Bootstrap Modal function 
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"));

// the button Check Key, that opens the modal 
document.getElementById("status").addEventListener("click", e => getStatus(e));

// GET request to API_URL with API_KEY, pass the results to function that will display them
// asynchronous function - instead of using .then, wrap the function in async function 
async function getStatus(e) {
    // the queryString makes the following: https://ci-jshint.herokuapp.com/api?api_key=thisismykey
    // 'thisismykey' is replaced with the API_KEY, i.e. this is the parameter to provide with the GET request
    const queryString = `${API_URL}?api_key=${API_KEY}`;
    console.log(queryString);

    // await the response from the fetch before proceeding
    const response = await fetch(queryString);

    // await the conversion of the response using json() method
    const data = await response.json();

    // property is set on the response object of ok. 
    // If server returns http status code of 200 then the ok property is set to True
    // if it returns an error then ok property is set to false
    if (response.ok) {
        displayStatus(data);
    } else {
        throw new Error(data.error);
    }
}

function displayStatus(data) {
    document.getElementById("resultsModalTitle").textContent = "API Key Status";
    document.getElementById("results-content").textContent = `Your key is valid until ${data.expiry}`

    resultsModal.show();
}