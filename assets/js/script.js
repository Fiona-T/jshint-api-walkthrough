const API_KEY = "0ZDpIAcsFcyG8Tn_6aZxrNtEakA";
const API_URL = "https://ci-jshint.herokuapp.com/api";
// using Bootstrap Modal function 
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"));

// the button Check Key, that opens the modal - and also does the GET request to the API
document.getElementById("status").addEventListener("click", e => getStatus(e));

// the button Run Checks, that sends the data to be checked - POST request
document.getElementById("submit").addEventListener("click", e => postForm(e));

async function postForm(e) {
    const form = new FormData(document.getElementById("checksform"));

    // a test to ensure form captured the data. Log to console using entries method
    // for (let entry of form.entries()) {
    //     console.log(entry);
    // }

    // make POST request to the API, authorise it with the API_KEY
    // attach the form data as the body of the request 
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Authorization": API_KEY,
        },
        body: form,
    });

    // convert response to json
    const data = await response.json();

    // if ok is true then call display errors (results), otherwise throw Error
    if(response.ok) {
        displayErrors(data);
    } else {
        throw new Error(data.error);
    }
}

function displayErrors(data) {
    let heading = `JSHint Results for ${data.file}`;
    let results = "";

    if(data.total_errors === 0) {
        results = `<div>No errors reported!</div>`;
    } else {
        results = `<div>Total Errors: <span class="error-count">${data.total_errors}</span></div>`;
        for (let error of data.error_list) {
            results += `<div>At line: <span class="line">${error.line}</span>, `;
            results += `column <span class="column">${error.col}:</span></div>`;
            results += `<div class="error">${error.error}</div>`;
        }
    }

    // add the content to the heading and content sections of modal
    document.getElementById("resultsModalTitle").textContent = heading;
    document.getElementById("results-content").innerHTML = results;
    //Bootstrap modal function
    resultsModal.show();
}

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
    document.getElementById("results-content").textContent = `Your key is valid until ${data.expiry}`;
    //Bootstrap modal function
    resultsModal.show();
}