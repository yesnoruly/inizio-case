import { fetchDataFx } from "./fetchData";
import { downloadJSON } from "./downloadJSON";

const API_KEY = process.env.API_KEY;

let resultsData = [];
let rawData = null;

const searchForm = document.querySelector('.search__form');
const searchInput = document.querySelector('.search__query')
const searchButton = document.querySelector('.search__button');
const downloadButton = document.querySelector('.search__download');
const resultsList = document.querySelector('.results__list');
const status = document.querySelector('.status');

searchForm.addEventListener('submit', (e) => {
    e.preventDefault()
    handleSearch()
})

downloadButton.addEventListener('click', e => {
    downloadJSON(rawData)
})

async function handleSearch() {
    const query = searchInput.value.trim();

    if (!query) return;

    resultsList.innerHTML = '<li>Loading...</li>'
    status.innerHTML = '';
    downloadButton.classList.remove('search__download--active')

    try {
        const { results: resultsData, raw: rawData } = await fetchDataFx(query, API_KEY);

        if (resultsData.length === 0) {
            resultsList.innerHTML = '<li>Nothing found</li>';
            return
        }

        resultsList.innerHTML = resultsData.map((item, i) => `
            <li class="item">
                <a class="item__title" href="${item.url}" target="_blank">${i + 1}. ${item.title}</a>
                <p class="item__description">${item.snippet}</p>
            </li>
        `).join('');

        status.innerHTML = `Loaded ${resultsData.length} results`
        downloadButton.classList.add('search__download--active')

    } catch (err) {
        resultsList.innerHTML = `<li class="status--error">${err.message}</li>`
    }
}