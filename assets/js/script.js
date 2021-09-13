const API_KEY = "0ZDpIAcsFcyG8Tn_6aZxrNtEakA";
const API_URL = "https://ci-jshint.herokuapp.com/api";
// using Bootstrap Modal function 
const resultsModal = new bootstrap.Modal(document.getElementById("resultsModal"));

// the button Check Key, that opens the modal - and also does the GET request to the API
document.getElementById("status").addEventListener("click", e => getStatus(e));

// the button Run Checks, that sends the data to be checked - POST request
document.getElementById("submit").addEventListener("click", e => postForm(e));

// check the form for the "options" label data - combine the values into one string
function processOptions(form) {
    let optArray = [];
    // each option is currently like: ["options", "es6"] etc. repeated for each option
    // iterate through the form entries. 
    // if the first item is "options"
    // then add the second item (will be e.g. "es6" etc) to the optArray
    for (let entry of form.entries()) {
            if(entry[0] === "options") {
                optArray.push(entry[1]);
            }
        }
    
    // use delete method of FormData to delete all occurrences of options
    form.delete("options");
    // add the new options, using the optArray converted to a string using .join method
    // join method by default separates the items with a comma so don;t need to specify this
    form.append("options", optArray.join());
    // options is now like: ["options", "es6","es8",etc]
    // return the new form to be used by postForm to POST to API
    return form;
}

// POST form data to the API 
async function postForm(e) {
    // checksform, after passing it through processOptions, and using FormData interface
    const form = processOptions(new FormData(document.getElementById("checksform")));

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
        // call the function to display error to user, before the throw as throw stops code
        displayException(data);
        throw new Error(data.error);
    }
}

// display the results of the POST request to the API, display them in the Modal
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
        // call the function to display error to user, before the throw as throw stops code
        displayException(data);
        throw new Error(data.error);
    }
}

function displayStatus(data) {
    document.getElementById("resultsModalTitle").textContent = "API Key Status";
    document.getElementById("results-content").textContent = `Your key is valid until ${data.expiry}`;
    //Bootstrap modal function
    resultsModal.show();
}

function displayException(data) {
    let heading = "An Exception Occurred";
    // using the error information from the returned data from API, to display to user
    let results = `<div>The API returned status code ${data.status_code}</div>`;
    results += `<div>Error number: <strong>${data.error_no}</strong></div>`;
    results += `<div>Error text: <strong>${data.error}</strong></div>`;

    // add the content to the heading and content sections of modal
    document.getElementById("resultsModalTitle").textContent = heading;
    document.getElementById("results-content").innerHTML = results;
    //Bootstrap modal function
    resultsModal.show();
}