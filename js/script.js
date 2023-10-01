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
function showSpinner() {
  const spinner = document.querySelector('.spinner');
  spinner.classList.add('show');
}

// Hide Spinner
function hideSpinner() {
  const spinner = document.querySelector('.spinner');
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

/* ------------------------------ Add Background Image --------------------------------- */
function addBackDropImage(imageUrl) {
  const div = document.createElement('div');
  div.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${imageUrl})`;
  div.style.height = '100vh';
  div.style.width = '100vw';
  div.style.position = 'absolute';
  div.style.backgroundSize = 'cover';
  div.style.top = '0';
  div.style.left = '0';
  div.style.zIndex = '-1';
  div.style.opacity = '0.1';
  document.querySelector('.main--container').appendChild(div);
}

/* ------------------------Display Movies------------------------- */
function displayMovies(movies) {
  movies.forEach((movie) => {
    // Creating Elements
    const card = document.createElement('div');
    const img = document.createElement('img');
    const title = document.createElement('p');
    const releaseDate = document.createElement('p');
    const [year, month, day] = movie.release_date.split('-');

    // Setting Attributes
    card.setAttribute('id', movie.id);
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
    document
      .querySelector('.movie-cards-container')
      .addEventListener('click', displayMovieDetails);
  });
}

/* ------------------------Display Movie Details------------------------- */
async function displayMovieDetails(e) {
  showSpinner();
  let movieId = '';
  if (e) {
    if (!e.target.nodeName === 'UL') return;
    movieId = e.target.classList.contains('card')
      ? e.target.getAttribute('id')
      : e.target.parentElement.getAttribute('id');
    window.location = `movie-details.html?id=${movieId}`;
  } else {
    movieId = window.location.search.split('=')[1];
  }
  try {
    const {
      title,
      overview,
      genres,
      poster_path,
      release_date,
      vote_average,
      backdrop_path,
    } = await fetchData(`/movie/${movieId}`);
    hideSpinner();
    const [year, month, day] = release_date.split('-');
    // Get Elements
    const detailsContainer = document.querySelector('.details-container');
    document
      .querySelector('.back-to-movies-btn-container')
      .addEventListener('click', () => window.history.back());
    // Creating Elements
    const movieImageContainer = document.createElement('div');
    const image = document.createElement('img');
    const div = document.createElement('div');
    const heading2 = document.createElement('h2');
    const movieRating = document.createElement('div');
    const icon = document.createElement('i');
    const releaseDate = document.createElement('p');
    const movieDescription = document.createElement('p');
    const genresContainer = document.createElement('div');
    const movieGenres = document.createElement('p');
    const movieGenresList = document.createElement('ul');
    const genresItem1 = document.createElement('li');
    const genresItem2 = document.createElement('li');
    const genresItem3 = document.createElement('li');

    // Setting Attributes
    movieImageContainer.setAttribute('class', 'movie-image-container');
    image.setAttribute(
      'src',
      poster_path
        ? `https://image.tmdb.org/t/p/w500${poster_path}`
        : './images/no-image.jpg'
    );
    image.setAttribute('alt', 'Movie Image');
    movieRating.setAttribute('class', 'movie-rating');
    icon.setAttribute('class', 'fa fa-solid fa-star');
    icon.style.color = 'gold';
    releaseDate.setAttribute('class', 'release-date');
    movieDescription.setAttribute('class', 'movie-description');
    genresContainer.setAttribute('class', 'genres-container');
    movieGenres.setAttribute('class', 'genres');
    movieGenresList.setAttribute('class', 'movie-genres-list');
    genresItem1.setAttribute('class', 'genres-item');
    genresItem2.setAttribute('class', 'genres-item');
    genresItem3.setAttribute('class', 'genres-item');

    // Setting Content
    heading2.textContent = title;
    releaseDate.textContent = `Release Date: ${day}/${month}/${year}`;
    movieDescription.textContent = overview;
    movieGenres.textContent = 'Genres';
    genresItem1.textContent = genres[0].name;
    genresItem2.textContent = genres[1].name;
    genresItem3.textContent = genres[2].name;

    // Appending Elements
    movieImageContainer.appendChild(image);
    movieRating.append(icon, `${vote_average.toFixed(1)}/10`);
    movieGenresList.appendChild(genresItem1);
    movieGenresList.appendChild(genresItem2);
    movieGenresList.appendChild(genresItem3);
    genresContainer.appendChild(movieGenres);
    genresContainer.appendChild(movieGenresList);
    detailsContainer.appendChild(movieImageContainer);
    detailsContainer.appendChild(heading2);
    detailsContainer.appendChild(movieRating);
    detailsContainer.appendChild(releaseDate);
    detailsContainer.appendChild(movieDescription);
    detailsContainer.appendChild(genresContainer);
    addBackDropImage(backdrop_path);
  } catch (err) {
    console.log(err);
  }
}

/* ------------------------Display All TV Shows------------------------- */
function displayTVShows(shows) {
  shows.forEach((show) => {
    // Creating Elements
    const card = document.createElement('div');
    const img = document.createElement('img');
    const title = document.createElement('p');
    const releaseDate = document.createElement('p');
    const [year, month, day] = show.first_air_date.split('-');

    // Setting Attributes
    card.setAttribute('id', show.id);
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
    document
      .querySelector('.show-cards-container')
      .addEventListener('click', displayTVShowDetails);
  });
}

/* ------------------------Display TV Show Details------------------------- */
async function displayTVShowDetails(e) {
  showSpinner();
  let showId = '';
  if (e) {
    if (!e.target.nodeName === 'UL') return;
    showId = e.target.classList.contains('card')
      ? e.target.getAttribute('id')
      : e.target.parentElement.getAttribute('id');
    window.location = `tv-details.html?id=${showId}`;
  } else {
    showId = window.location.search.split('=')[1];
  }
  try {
    const {
      name,
      overview,
      poster_path,
      first_air_date,
      vote_average,
      backdrop_path,
    } = await fetchData(`/tv/${showId}`);
    hideSpinner();
    const [year, month, day] = first_air_date.split('-');
    // Get Elements
    const detailsContainer = document.querySelector('.details-container');
    document
      .querySelector('.back-to-shows-btn-container')
      .addEventListener('click', () => window.history.back());
    // Creating Elements
    const showImageContainer = document.createElement('div');
    const image = document.createElement('img');
    const div = document.createElement('div');
    const heading2 = document.createElement('h2');
    const showRating = document.createElement('div');
    const icon = document.createElement('i');
    const releaseDate = document.createElement('p');
    const showDescription = document.createElement('p');

    // Setting Attributes
    showImageContainer.setAttribute('class', 'show-image-container');
    image.setAttribute(
      'src',
      poster_path
        ? `https://image.tmdb.org/t/p/w500${poster_path}`
        : './images/no-image.jpg'
    );
    image.setAttribute('alt', 'Show Image');
    showRating.setAttribute('class', 'show-rating');
    icon.setAttribute('class', 'fa fa-solid fa-star');
    icon.style.color = 'gold';
    releaseDate.setAttribute('class', 'release-date');
    showDescription.setAttribute('class', 'show-description');

    // Setting Content
    heading2.textContent = name;
    releaseDate.textContent = `Release Date: ${day}/${month}/${year}`;
    showDescription.textContent = overview;

    // Appending Elements
    showImageContainer.appendChild(image);
    showRating.append(icon, `${vote_average.toFixed(1)}/10`);
    detailsContainer.appendChild(showImageContainer);
    detailsContainer.appendChild(heading2);
    detailsContainer.appendChild(showRating);
    detailsContainer.appendChild(releaseDate);
    detailsContainer.appendChild(showDescription);
    addBackDropImage(backdrop_path);
  } catch (err) {
    console.log(err);
  }
}

// Script for Home/Movies
async function initMovies() {
  showSpinner();
  try {
    setTimeout(async () => {
      const { results: movies } = await fetchData('/movie/popular');
      hideSpinner();
      displayMovies(movies);
    }, 1000);
  } catch (err) {
    showErrorMessage();
  }
}

// Script for Shows
async function initTVShows() {
  showSpinner();
  try {
    setTimeout(async () => {
      const { results: shows } = await fetchData('/tv/popular');
      console.log(shows);
      hideSpinner();
      displayTVShows(shows);
    }, 1000);
  } catch (err) {
    showErrorMessage();
  }
}

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
      displayMovieDetails();
      break;
    case '/search.html':
    case 'search':
      initSearch();
      break;
    case '/tv-details.html':
    case '/tv-details':
      displayTVShowDetails();
  }
  highlightActiveLink();
}

document.addEventListener('DOMContentLoaded', init);
