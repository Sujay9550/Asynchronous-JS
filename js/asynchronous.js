`use strict`;

// DOM Selectors
const countriesContainer = document.querySelector(".countries");
const btn = document.querySelector(".btn-country");
const imagesContainer = document.querySelector(".images");

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* 
  API Details:

1: https://restcountries.com/v2/name/${country}

2: https://restcountries.com/v2/alpha/${neighbour}

3: https://geocode.xyz/${lat},${lng}?geoit=json

*/

// Asynchronous Javascript - AJAX , API's

// AJAX Call - Older Method

// Creating a function to get the data of the country
const getCountryData = function (country) {
  const request = new XMLHttpRequest();
  request.open("GET", `https://restcountries.com/v2/name/${country}`);
  request.send();

  request.addEventListener("load", function () {
    console.log(this.responseText);

    // Converting received data to JSON
    const receivedData = JSON.parse(this.responseText);
    console.log(receivedData); // Result - [{…}]

    // Converting JSON to JS Object
    const [data] = JSON.parse(this.responseText);
    console.log(data); // Result - {name: 'United States of America', topLevelDomain: Array(1), alpha2Code: 'US', alpha3Code: 'USA', callingCodes: Array(1), …}

    const html = `<article class="country">
    <img class="country__img" src="${data.flag}" />
    <div class="country__data">
      <h3 class="country__name">${data.name}</h3>
      <h4 class="country__region">${data.region}</h4>
      <p class="country__row"><span>👫</span>${(
        +data.population / 1000000
      ).toFixed(1)}</p>
      <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
      <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
    </div>
  </article>`;

    // Inserting HTML to the page
    countriesContainer.insertAdjacentHTML("beforeend", html);
    countriesContainer.style.opacity = 1;
  });
};

getCountryData("usa");

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Sequence of AJAX Call

// Creating rendering data function
const renderCountry = function (data) {
  const html = `<article class="country">
    <img class="country__img" src="${data.flag}" />
    <div class="country__data">
      <h3 class="country__name">${data.name}</h3>
      <h4 class="country__region">${data.region}</h4>
      <p class="country__row"><span>👫</span>${(
        +data.population / 1000000
      ).toFixed(1)}</p>
      <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
      <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
    </div>
  </article>`;

  // Inserting HTML to the page
  countriesContainer.insertAdjacentHTML("beforeend", html);
  countriesContainer.style.opacity = 1;
};

// Creating a function to get the data of the country and its neighbouring countries

const getCountryAndNeighbourData = function (country) {
  // First AJAX Call
  const requestOne = new XMLHttpRequest();
  requestOne.open("GET", `https://restcountries.com/v2/name/${country}`);
  requestOne.send();

  requestOne.addEventListener("load", function () {
    console.log(this.responseText);

    const receivedDataOne = JSON.parse(this.responseText);
    console.log(receivedDataOne); // Result - [{…}]

    // Converting JSON to JS Object
    const [dataOne] = JSON.parse(this.responseText);
    console.log(dataOne);

    // Calling the renderCountry function
    renderCountry(dataOne);

    // Getting Neighbour Countries
    const [neighbour] = dataOne.borders;
    console.log(neighbour);

    // Checking for the existence of Neighbour Countries
    if (!neighbour) return;

    // Second AJAX Call
    const requestTwo = new XMLHttpRequest();
    requestTwo.open("GET", `https://restcountries.com/v2/alpha/${neighbour}`);
    requestTwo.send();

    requestTwo.addEventListener("load", function () {
      console.log(this.responseText);

      const receivedDataTwo = JSON.parse(this.responseText);
      console.log(receivedDataTwo);

      const dataTwo = JSON.parse(this.responseText);
      console.log(dataTwo);

      // Calling the renderCountry function
      renderCountry(dataTwo);
    });
  });
};

getCountryAndNeighbourData("usa");

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
