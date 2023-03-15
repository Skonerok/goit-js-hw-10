import './css/styles.css';
import fetchCountries from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const inputRef = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

inputRef.addEventListener('input', debounce(onFormInput, DEBOUNCE_DELAY));

function onFormInput(evt) {
    evt.preventDefault();

    const searchQuerry = evt.target.value.trim();

    if (searchQuerry === '') {
       cleanCountryData()
        return;
    }
    
        fetchCountries(searchQuerry).then(country => {
            cleanCountryData();

                if (country.length > 10) {
                    Notify.info("Too many matches found. Please enter a more specific name.");
                } else if (country.length >= 2 && country.length <= 10) {
                    countryList.innerHTML = createCountryList(country);
                } else {
                    countryInfo.innerHTML = createCountryInfo(country);
                }
            })
            .catch(() => {
                Notify.failure("Oops, there is no country with that name");
            });
};

function createCountryList(countries) {
    return countries.map(({ flags, name }) => {
        return `
        <li class="country-list__item">
        <img class="country-list__img" src="${flags.svg}" alt="${name.official}>
        <p class="country-list__name">${name.official}</p>
        </li>
        `
    })
        .join('');
};

function createCountryInfo(countries) {
    return countries.map(({ flags, name, capital, population, languages }) => {
        return `
        <li class="country-info__item">
        <img class="country-info__img" src="${flags.svg}" alt="${name.official}">
        <h2 class="country-info__name">${name.official}</h2></li>
        <p><span class="country-info__desc">Capital: </span>${capital}</p>
        <p><span class="country-info__desc">Population: </span>${population}</p>
        <p><span class="country-info__desc">Languages: </span>${Object.values(languages).join(', ')}</p>
        `
    })
        .join('');
};

function cleanCountryData() {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
};