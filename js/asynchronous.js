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

// Promises and the Fetch API
// Promise - An object that is used as an placeholder for the future result of an asynchronously delivered value.
// Promise - A container for an asynchronously delivered value.
// Promise - A container for a future value
// Promise - It has three states - Pending Promise, Settled Promise has 2 types - Fulfilled Promise, Rejected Promise
// Promise - Promise will be settled only once
// Fullfilled promise - Success! The value is available
// Rejected Promise - There was some error during the async task

// Syntax
const request = fetch(`https://restcountries.com/v2/name/portugal`);
console.log(request); // Result - Promise {<pending>}

// Consuming Promises
// Detailed Code:
const getCountryData1 = function (country) {
  fetch(`https://restcountries.com/v2/name/${country}`) // fetch will return a promise. Now use the then method onto it to handle the promise
    .then(function (response) {
      console.log(response); // response is the result of the fetch method.
      return response.json(); // response.json() will return a new promise. json() is used to read the data.
    })
    .then(function (data) {
      console.log(data); // Result - [{…}]

      const [dataOne] = data;
      console.log(dataOne); // Result - {name: 'Portugal', topLevelDomain: Array(1), alpha2Code: 'PT', alpha3Code: 'PRT', callingCodes: Array(1), …}

      // Calling the renderCountry function
      renderCountry(dataOne); // Result - This will render the data to the UI
    });
};

getCountryData1("portugal");

// Simplified Code:
const getCountryData2 = (country) => {
  fetch(`https://restcountries.com/v2/name/${country}`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      const [dataOne] = data;
      renderCountry(dataOne);
    });
};

getCountryData2("portugal");

////////////////////////////////////////////////////////
// Chaining Promises
const getCountryAndNeighbourData1 = (country) => {
  fetch(`https://restcountries.com/v2/name/${country}`)
    .then((response) => {
      return response.json();
    })
    .then((datafetchOne) => {
      console.log(datafetchOne); // Result - [{…}]
      const [dataOne] = datafetchOne;
      console.log(dataOne);

      renderCountry(dataOne);

      // Check for Neighbour Countries
      const neighbourData = dataOne.borders;
      console.log(neighbourData); // Result - ['CAN', 'MEX']

      const [neighbour] = dataOne.borders;
      console.log(neighbour); // Result - CAN

      if (!neighbour) return;

      return fetch(`https://restcountries.com/v2/alpha/${neighbour}`);
    })
    .then((response) => {
      return response.json();
    })
    .then((dataFetchTwo) => {
      console.log(dataFetchTwo); // Result - {…}

      const dataTwo = dataFetchTwo;
      console.log(dataTwo); // Result - {…}
      renderCountry(dataTwo);
    });
};

getCountryAndNeighbourData1("usa");

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Handling Rejected Promises - Handling Errors also known as Catching Errors

// Creating Error Message function
const renderError = function (msg) {
  countriesContainer.insertAdjacentText("beforeend", msg);
};

// Creating a function to get country and neighbour country data
const getCountryAndNeighbourData2 = (country) => {
  fetch(`https://restcountries.com/v2/name/${country}`)
    .then((response) => {
      return response.json();
    })
    .then((dataFetchOne) => {
      console.log(dataFetchOne);

      const [dataOne] = dataFetchOne;
      console.log(dataOne); // Result - [{…}]
      renderCountry(dataOne);

      const neighbourData = dataOne.borders;
      console.log(neighbourData); // Result - ['CAN', 'MEX']

      const [neighbour] = dataOne.borders;
      console.log(neighbour); // Result - CAN

      if (!neighbour) return;

      return fetch(`https://restcountries.com/v2/alpha/${neighbour}`);
    })
    .then((response) => {
      return response.json();
    })
    .then((dataFetchTwo) => {
      console.log(dataFetchTwo); // Result - {…}

      const dataTwo = dataFetchTwo;
      console.log(dataTwo); // Result - {…}
      renderCountry(dataTwo);
    })
    .catch((err) => {
      console.error(`${err}`);
      renderError(`Something Went Wrong 🙁🙁🙁 ${err.message}, Try Again!`);
    }) // it will handle/catch the error
    .finally(() => {
      countriesContainer.style.opacity = 1;
    }); // this will execute no matter whether we get a Response or Error.
};

// Getting the data on click of the button
btn.addEventListener("click", () => {
  getCountryAndNeighbourData2("germany");
});

// Throwing Errors Manually
const getCountryAndNeighbourData3 = (country) => {
  fetch(`https://restcountries.com/v2/name/${country}`)
    .then((response) => {
      console.log(response);

      // Error Handling - 1
      if (!response.ok) throw new Error(`Country Not Found ${response.status}`); // response.ok = false, response.status = 404

      return response.json();
    })
    .then((dataFetchOne) => {
      console.log(dataFetchOne);

      const [dataOne] = dataFetchOne;
      console.log(dataOne);
      renderCountry(dataOne);

      const neighbourData = dataOne.borders;
      console.log(neighbourData);

      const [neighbour] = dataOne.borders;
      console.log(neighbour);

      return fetch(`https://restcountries.com/v2/alpha/${neighbour}`);
    })
    .then((response) => {
      console.log(response);

      // Error handling - 2
      if (!response.ok) throw new Error(`Country Not Found ${response.status}`); // response.ok = false, response.status = 404

      return response.json();
    })
    .then((dataFetchTwo) => {
      console.log(dataFetchTwo);

      const dataTwo = dataFetchTwo;
      console.log(dataTwo);
      renderCountry(dataTwo);
    })
    .catch((err) => {
      console.error(`${err} 🙁🙁🙁`);
      renderError(`Something Went Wrong 🙁🙁🙁 ${err.message}, Try Again!`);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

// Getting the data on click of the button
btn.addEventListener("click", () => {
  getCountryAndNeighbourData3("germanyg");
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Throwing Errors Manually - Refactored/Simplified Code
// Creating a reusable getJSON function
const getJSON = (url, errorMsg = `Something Went Wrong`) => {
  return fetch(url).then((response) => {
    console.log(response);

    // Error Handling
    if (!response.ok) throw new Error(`${errorMsg} ${response.status}`);

    return response.json();
  });
};

// Creating a function to get the Country and Neighbour data
const getCountryAndNeighbourData4 = (country) => {
  getJSON(`https://restcountries.com/v2/name/${country}`, "Country Not Found")
    .then((dataFetchOne) => {
      console.log(dataFetchOne);

      const [dataOne] = dataFetchOne;
      console.log(dataOne);
      renderCountry(dataOne);

      const neighbourData = dataOne.borders;
      console.log(neighbourData);

      const [neighbour] = dataOne.borders;
      console.log(neighbour);

      if (!neighbour) throw new Error("Neighbour Not Found");

      return getJSON(
        `https://restcountries.com/v2/alpha/${neighbour}`,
        "Country Not Found"
      );
    })
    .then((dataFetchTwo) => {
      console.log(dataFetchTwo);

      const dataTwo = dataFetchTwo;
      console.log(dataTwo);
      renderCountry(dataTwo);
    })
    .catch((err) => {
      console.log(`${err} 🙁🙁🙁`);
      renderError(`Something Went Wrong 🙁🙁🙁 ${err.message}, Try Again!`);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

btn.addEventListener("click", () => {
  getCountryAndNeighbourData4("germany");
});

// Exercise: 1 - Getting the geolocation data
const getLocation = (lat, lng) => {
  fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`)
    .then((response) => {
      console.log(response);

      if (!response.ok)
        throw new Error(`Problem With Geocoding ${response.status}`);

      return response.json();
    })
    .then((locationFetch) => {
      console.log(locationFetch);
      console.log(`You are in ${locationFetch.city}, ${locationFetch.country}`);

      return fetch(
        `https://restcountries.com/v2/name/${locationFetch.country}`
      );
    })
    .then((response) => {
      console.log(response);

      if (!response.ok) throw new Error(`Country Not Found ${response.status}`);

      return response.json();
    })
    .then((dataFetch) => {
      console.log(dataFetch);

      const [dataOne] = dataFetch;
      console.log(dataOne);
      renderCountry(dataOne);
    })
    .catch((err) => {
      console.error(`${err} 🙁🙁🙁`);
      console.log(`${err.message}`);
      renderError(`Something Went Wrong 🙁🙁🙁 ${err.message}, Try Again!`);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

getLocation(52.508, 13.381);
getLocation(19.037, 72.873);
getLocation(-33.933, 18.474);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Asynchronous Behind the Scenes
// Regular Callbacks goes into Callback Queue
// Callbacks of the promises goes into MICROTASKS QUEUE. Callbacks of the promises are called Microtasks
// MICROTASKS QUEUE - This has priority over the callback queue

// Event Loop in Practice (Can be used for explanation)
console.log("Test Start");

setTimeout(() => {
  console.log("Zero Second Timer");
}, 0);

Promise.resolve("Resolved Promise 1").then((res) => {
  console.log(res);
});

Promise.resolve("Resolved Promise 2").then((res) => {
  for (let i = 0; i < 1000000000; i++) {}

  console.log(res);
});

console.log("Test End");

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Building a Simple Promise
// A Promise contains one function called Executer function. Executer function carries 2 parameters called resolve, reject
const lotteryPromise = new Promise(function (resolve, reject) {
  console.log("Lottery draw is happening");

  setTimeout(() => {
    if (Math.random() >= 0.5) {
      resolve("You Win 💰");
    } else {
      reject(new Error("You lost your money"));
    }
  }, 2000);
});

// Consuming the built promise
lotteryPromise
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.error(err);
  });

// Promisifying - This means converting Callback based asynchronous behaviour to Promise based asynchronous behaviour

// Promisifying the setTimeout Function
const wait = (seconds) => {
  return new Promise(function (resolve) {
    setTimeout(resolve, seconds * 1000);
  });
};

// Consuming the Promise
wait(2)
  .then(() => {
    console.log("I waited for 2 seconds");
    return wait(1);
  })
  .then(() => {
    console.log("I waited for 1 seconds");
  });

wait(1)
  .then(() => {
    console.log("1 Second Passed");
    return wait(1);
  })
  .then(() => {
    console.log("2 Second Passed");
    return wait(1);
  })
  .then(() => {
    console.log("3 Second Passed");
    return wait(1);
  })
  .then(() => {
    console.log("4 Second Passed");
    return wait(1);
  });

// Creating Resolved and Rejected Promises immediately
Promise.resolve("This Promise is Resolved").then((res) => {
  console.log(res);
});

Promise.reject("This Promise is Rejected").catch((err) => {
  console.error(err);
});

////////////////////////////////////////////////////////////

// Promisifying the Geolocation API
// Geolocation API - accepts the 2 callback functions. One is the success function & the other is Error function

// General Method
const getPositionGM = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve(position);
      },
      (err) => {
        reject(err);
      }
    );
  });
};

// Consuming Promise
getPositionGM()
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.error(err);
  });

// Improved Method
const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

getPosition()
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.error(err);
  });

// Exercise 1: Improving by getting the User Location Data
const getLocation1 = () => {
  getPosition()
    .then((response) => {
      console.log(response);

      // Destructuring latitude and longitude
      const { latitude: lat, longitude: lng } = response.coords;
      console.log(lat, lng);

      // Returning a new promise
      return fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
    })
    .then((response) => {
      console.log(response);

      if (!response.ok)
        throw new Error(`Problem With Geocoding ${response.status}`);

      // Returning new Promise
      return response.json();
    })
    .then((locationFetch) => {
      console.log(locationFetch);
      console.log(`You are in ${locationFetch.city}, ${locationFetch.country}`);

      // Returning new Promise
      return fetch(
        `https://restcountries.com/v2/name/${locationFetch.country}`
      );
    })
    .then((response) => {
      console.log(response);

      if (!response.ok) throw new Error(`Country Not Found ${response.status}`);

      // Returning new Promise
      return response.json();
    })
    .then((dataFetch) => {
      console.log(dataFetch);

      // Destructuring the Data
      const [dataOne, dataTwo] = dataFetch;

      // Rendering the Data
      renderCountry(dataTwo);
    })
    .catch((err) => {
      console.log(`${err} 🙁🙁🙁`);
      console.error(`${err.message}`);
      renderError(`Something Went Wrong 🙁🙁🙁 ${err.message}, Try Again!`);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

btn.addEventListener("click", getLocation1);

// Exercise 2:
const wait1 = (seconds) => {
  return new Promise(function (resolve, reject) {
    setTimeout(resolve, seconds * 1000);
  });
};

const createImage = (imgPath) => {
  return new Promise(function (resolve, reject) {
    const img = document.createElement("img");
    img.src = imgPath;

    img.addEventListener("load", function () {
      imagesContainer.append(img);
      resolve(img);
    });

    img.addEventListener("error", function () {
      reject(new Error("Image Not Found"));
    });
  });
};

// Global Variable
let currentImage;

createImage("img/img-1.jpg")
  .then((img) => {
    currentImage = img;
    console.log("Image 1 Loaded");
    return wait1(2);
  })
  .then(() => {
    currentImage.style.display = "none";
    return createImage("img/img-2.jpg");
  })
  .then((img) => {
    currentImage = img;
    console.log("Image 2 Loaded");
    return wait1(2);
  })
  .then(() => {
    currentImage.style.display = "none";
  })
  .catch((err) => {
    console.error(err);
  });

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Consuming Promises with Async/Await
// Async - Async Function will always return a Promise
// Await - will stop the code execution at this point untill the promise is fullfilled

// Explanation
const getLocation2 = async (country) => {
  const response = await fetch(`https://restcountries.com/v2/name/${country}`);
  console.log(response);

  const responseJson = await response.json();
  console.log(responseJson);

  const [dataOne] = responseJson;
  renderCountry(dataOne);
};

getLocation2("portugal");

// Application/Illustration

const getLocation3 = async () => {
  // Geolocation
  const position = await getPosition();
  console.log(position);

  // Destructuring latitude and longitude
  const { latitude: lat, longitude: lng } = position.coords;
  console.log(lat, lng);

  // Reverse Geocoding
  const responseGeo = await fetch(
    `https://geocode.xyz/${lat},${lng}?geoit=json`
  );
  console.log(responseGeo);

  const dataGeo = await responseGeo.json();
  console.log(dataGeo);

  const responseCountry = await fetch(
    `https://restcountries.com/v2/name/${dataGeo.country}`
  );
  console.log(responseCountry);

  const dataCountry = await responseCountry.json();
  console.log(dataCountry);

  const [dataOne, dataTwo] = dataCountry;
  console.log(dataOne);
  renderCountry(dataTwo);
};

getLocation3();

// Error Handling in Async function with try and catch method
const getLocation4 = async () => {
  try {
    const position = await getPosition();
    console.log(position);

    // Destructuring latitude and longitude
    const { latitude: lat, longitude: lng } = position.coords;
    console.log(lat, lng);

    // Reverse Geocoding
    const resGeo = await fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
    console.log(resGeo);

    // Error Handling 1:
    if (!resGeo.ok) throw new Error(`Problem with Geocoding ${resGeo.status}`);

    const dataGeo = await resGeo.json();
    console.log(dataGeo);

    const resCountry = await fetch(
      `https://restcountries.com/v2/name/${dataGeo.country}`
    );

    console.log(resCountry);

    // Error Handling 2:
    if (!resCountry.ok)
      throw new Error(`Country Not Found ${resCountry.status}`);

    const dataCountry = await resCountry.json();
    console.log(dataCountry);

    // Destructuring countries
    const [dataOne, dataTwo] = dataCountry;
    renderCountry(dataTwo);
  } catch (err) {
    console.error(`${err} 🙁🙁🙁`);
    renderError(`Something Went Wrong 🙁🙁🙁 ${err.message}, Try Again!`);
  }
};

btn.addEventListener("click", getLocation4);

// Returning Values from Async Functions
const getLocation5 = async () => {
  try {
    const position = await getPosition();
    console.log(position);

    // Destructuring latitude and longitude
    const { latitude: lat, longitude: lng } = position.coords;
    console.log(lat, lng);

    // Reverse Geocoding
    const resGeo = await fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
    console.log(resGeo);

    // Error handling 1:
    if (!resGeo.ok) throw new Error(`Problem With Geocoding ${resGeo.status}`);

    const dataGeo = await resGeo.json();
    console.log(dataGeo);

    const resCountry = await fetch(
      `https://restcountries.com/v2/name/${dataGeo.country}`
    );
    console.log(resCountry);

    // Error Handling 2:
    if (!resCountry.ok)
      throw new Error(`Country Not Found ${resCountry.status}`);

    const dataCountry = await resCountry.json();
    console.log(dataCountry);

    // Destructuring Country Data
    const [dataOne, dataTwo] = dataCountry;
    renderCountry(dataTwo);

    // Returning Values from async function
    return `You are in ${dataGeo.city}, ${dataGeo.country}`;
  } catch (err) {
    console.error(`${err} 🙁🙁🙁`);
    renderError(`Something Went Wrong 🙁🙁🙁 ${err.message}, Try Again!`);
    countriesContainer.style.opacity = 1;

    // Rethrowing Error - Reject Promise returned from async function
    throw err;
  }
};

console.log("1: Getting the location");

// Getting the returned value from the async function - Old Method
getLocation5()
  .then((city) => {
    console.log(`2: ${city}`);
  })
  .catch((err) => {
    console.error(`${err.message}`);
  })
  .finally(() => {
    console.log("3: Finished Getting Location");
  });

// Getting the returned value from the async function - Modern Method (Create async function using IIFE concept)
(async function () {
  try {
    const city = await getLocation5();
    console.log(`2: ${city}`);
  } catch (err) {
    console.error(`${err.message}`);
  }
  console.log("Finished Getting Location");
})();

// Running Promises Sequentially
const get3Countries = async (c1, c2, c3) => {
  try {
    const [dataOne] = await getJSON(`https://restcountries.com/v2/name/${c1}`);
    const [dataTwo] = await getJSON(`https://restcountries.com/v2/name/${c2}`);
    const [dataThree] = await getJSON(
      `https://restcountries.com/v2/name/${c3}`
    );

    console.log([dataOne.capital, dataTwo.capital, dataThree.capital]);
  } catch (err) {
    console.error(`${err}`);
  }
};

get3Countries("portugal", "canada", "tanzania");

// Running Promises in Parallel
// Promise.all - will return a new promise that runs a series of promises together.
// Note: If any one of the promise gets reject, then the whole promise.all gets rejects as well
const get3Countries1 = async (c1, c2, c3) => {
  try {
    const data = await Promise.all([
      getJSON(`https://restcountries.com/v2/name/${c1}`),
      getJSON(`https://restcountries.com/v2/name/${c2}`),
      getJSON(`https://restcountries.com/v2/name/${c3}`),
    ]);

    console.log(data);
    console.log(
      data.map((element) => {
        return element[0].capital;
      })
    ); // Result - (3) [{…}, {…}, {…}]
  } catch (err) {
    console.error(`${err}`);
  }
};

get3Countries1("portugal", "canada", "tanzania");

// Other Promise Combinators: Race, AllSettled and Any

// Promise.race - receives an array of promises and returns a promise.
// Note: Promise.race - returns the first Settled promise (Either Fulfilled or Rejected)
// Promise.race - returns only one result and not an array of results

(async function () {
  const result = await Promise.race([
    getJSON(`https://restcountries.com/v2/name/italy`),
    getJSON(`https://restcountries.com/v2/name/mexico`),
    getJSON(`https://restcountries.com/v2/name/egypt`),
  ]);

  console.log(result[0]);
})();

const timeout = function (sec) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error("Request Took Too Long"));
    }, sec * 1000);
  });
};

Promise.race([
  getJSON(`https://restcountries.com/v2/name/mexico`),
  timeout(1.5),
])
  .then((res) => {
    console.log(res[0]);
  })
  .catch((err) => {
    console.error(err);
  });

// Promise.allSettled - Takes an array of promises and returns an array of all the settled promises
// Promise.allSettled - will return an array of results even if one of the promise is rejected

Promise.allSettled([
  Promise.resolve("Success"),
  Promise.reject("Error"),
  Promise.resolve("Another Success"),
])
  .then((res) => {
    console.log(res); // Result - (3) [{…}, {…}, {…}]
  })
  .catch((err) => {
    console.error(err);
  });

// Promise.any [ES2021] - takes an array of multiple promises and returns the first fulfilled promise
// Promise.any - will ignore the rejected promises. The result will always be a fulfilled promise

Promise.any([
  Promise.resolve("Success"),
  Promise.reject("Error"),
  Promise.resolve("Another Success"),
]).then((res) => {
  console.log(res);
});

// Exercise 3: Improving the createImage function using Async Await Feature
const wait2 = (seconds) => {
  return new Promise(function (resolve) {
    setTimeout(resolve, seconds * 1000);
  });
};

const createImage2 = (imgPath) => {
  return new Promise(function (resolve, reject) {
    const img = document.createElement("img");
    img.src = imgPath;

    img.addEventListener("load", () => {
      imagesContainer.append(img);
      resolve(img);
    });

    img.addEventListener("error", () => {
      reject(new Error("Image Not Found"));
    });
  });
};

// Part 1:

const loadAndPause = async () => {
  try {
    // Load Image 1
    let img = await createImage2("img/img-1.jpg");
    console.log("Loaded Image 1");
    await wait2(2);

    img.style.display = "none";

    // Load Image 2
    img = await createImage2("img/img-2.jpg");
    console.log("Loaded Image 2");
    await wait2(2);

    img.style.display = "none";
  } catch (err) {
    console.error(err);
  }
};

// loadAndPause();

// Part 2:
const loadAll = async (imgArray) => {
  try {
    const imgs = imgArray.map(async (img) => {
      return await createImage2(img);
    });
    console.log(imgs); // Result - [Promise, Promise, Promise]

    const imgsElement = await Promise.all(imgs);
    console.log(imgsElement); // Result - (3) [img, img, img]

    imgsElement.forEach((element) => {
      element.classList.add("parallel");
    });
  } catch (err) {
    console.error(err);
  }
};

loadAll(["img/img-1.jpg", "img/img-2.jpg", "img/img-3.jpg"]);
