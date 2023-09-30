/* 
    In frameworks like react we have routers built-in for us.
    But for Vanilla JS we have to specifiy manually which code 
    should run for which page.
    // Location object -> https://www.javascripttutorial.net/javascript-bom/javascript-location/
*/

const global = {
  currentPage: window.location.pathname,
};

// Highlight Active Link
function highlightActiveLink() {
  const navLinks = document.querySelectorAll('.nav-link a');
  navLinks.forEach((link) => {
    link.getAttribute('href') === global.currentPage &&
      link.classList.add('active');
  });
}

// Error
function showErrorMessage() {}

// Show Spinner
function showSpinner(container) {
  const spinner = container.children[1];
  spinner.classList.add('show');
}

// Hide Spinner
function hideSpinner(container) {
  const spinner = container.children[1];
  spinner.classList.add('hide');
}

// Fetch Data
async function fetchData(endpoint, params = {}) {
  const API_URL = 'https://api.themoviedb.org/3';
  const API_TOKEN =
    'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ZGE1MzkwNDg2YWJiMGVjMzEzZTkxM2NmMTg0MDZkOSIsInN1YiI6IjY1MTc4YTdjZDQ2NTM3MDllMDA2MjcwYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.iw6TG1sCyAv8psbBrVxgUbstYb_AFpzYtyHnjms9dQI';
  const res = await fetch(API_URL + endpoint, {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
  });
  if (!res.ok) throw new Error('Some Error Occurred');
  const data = await res.json();
  return data;
}

function displayMovies(movies) {
  movies.forEach((movie) => {
    // Creating Elements
    const card = document.createElement('div');
    const img = document.createElement('img');
    const title = document.createElement('p');
    const releaseDate = document.createElement('p');
    const [year, month, day] = movie.release_date.split('-');

    // Setting Attributes
    card.classList.add('card');
    img.setAttribute(
      'src',
      movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : './images/no-image.jpg'
    );
    title.textContent = movie.title;
    releaseDate.textContent = `Release: ${day}/${month}/${year}`;

    // Appending Elements
    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(releaseDate);
    document.querySelector('.movie-cards-container').appendChild(card);
  });
}
function displayTVShows(shows) {
  shows.forEach((show) => {
    // Creating Elements
    const card = document.createElement('div');
    const img = document.createElement('img');
    const title = document.createElement('p');
    const releaseDate = document.createElement('p');
    const [year, month, day] = show.first_air_date.split('-');

    // Setting Attributes
    card.classList.add('card');
    img.setAttribute(
      'src',
      show.poster_path
        ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
        : './images/no-image.jpg'
    );
    title.textContent = show.name;
    releaseDate.textContent = `Release: ${day}/${month}/${year}`;

    // Appending Elements
    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(releaseDate);
    document.querySelector('.show-cards-container').appendChild(card);
  });
}

// Script for Home/Movies
async function initMovies() {
  const popularMoviesContainer = document.querySelector(
    '.popular-movies-container'
  );
  showSpinner(popularMoviesContainer);
  try {
    setTimeout(async () => {
      const { results: movies } = await fetchData('/movie/popular');
      hideSpinner(popularMoviesContainer);
      displayMovies(movies);
    }, 1000);
  } catch (err) {
    showErrorMessage();
  }
}

// Script for Shows
async function initTVShows() {
  const popularShowsContainer = document.querySelector(
    '.popular-shows-container'
  );
  showSpinner(popularShowsContainer);
  try {
    setTimeout(async () => {
      const { results: shows } = await fetchData('/tv/popular');
      console.log(shows);
      hideSpinner(popularShowsContainer);
      displayTVShows(shows);
    }, 1000);
  } catch (err) {
    showErrorMessage();
  }
}

// Script for Movie Details
function initMovieDetails() {}

// Script for TV Details
function initTVDetails() {}

// Script for Search
function initSearch() {}

// Init App
function init() {
  switch (global.currentPage) {
    case '/':
    case '/index.html':
      initMovies();
      break;
    case '/shows.html':
      initTVShows();
      break;
    case '/movie-details.html':
      initMovieDetails();
      break;
    case '/search.html':
      initSearch();
      break;
    case '/tv-details.html':
      initTVDetails();
  }
  highlightActiveLink();
}

document.addEventListener('DOMContentLoaded', init);
