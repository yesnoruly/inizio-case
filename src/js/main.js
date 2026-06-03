import { fetchDataFx } from "./fetchData";
import { downloadJSON } from "./downloadJSON";

const API_KEY = process.env.API_KEY;

let resultsData = [];

const searchForm = document.querySelector('.search__form');
const searchInput = document.querySelector('.search__query')
const searchButton = document.querySelector('.search__button');
const downloadButton = document.querySelector('.search__download');
const resultsContainer = document.querySelector('.results__list');
const statusContainer = document.querySelector('.status');

searchForm.addEventListener('submit', (e) => {
    e.preventDefault()
    handleSearch()
})

downloadButton.addEventListener('click', e => { 
    resultsData.length > 0 && downloadJSON(resultsData)
 })

async function handleSearch() {
    const query = searchInput.value.trim();

    if (!query) return;

    resultsContainer.innerHTML = '<p>Loading...</p>'
    statusContainer.innerHTML = '';
    statusContainer.className = 'status';
    downloadButton.classList.remove('search__download--active')

    try {
        resultsData = await fetchDataFx(query, API_KEY);

        if (resultsData.length === 0) {
            resultsContainer.innerHTML = '<p class="status--error">Nothing found</p>';
            return
        }

        resultsContainer.innerHTML = resultsData.map((item, i) => `
            <li class="item">
                <a class="item__title" href="${item.url}" target="_blank">${i + 1}. ${item.title}</a>
                <p class="item__description">${item.snippet}</p>
            </li>
        `).join('');

        statusContainer.innerHTML = `Loaded ${resultsData.length} results`
        downloadButton.classList.add('search__download--active')
    } catch (err) {
        resultsContainer.innerHTML = `<p class="status--error">${err.message}</p>`
    }
}