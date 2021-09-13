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

    // if ok is true then log to console, otherwise throw Error
    if(response.ok) {
        console.log(data);
    } else {
        throw new Error(data.error);
    }

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
    document.getElementById("results-content").textContent = `Your key is valid until ${data.expiry}`
    //Bootstrap modal function
    resultsModal.show();
}