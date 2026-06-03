import axios from "axios";

export async function fetchDataFx(query, apiKey) {
    const { data } = await axios.get('https://api.serpstack.com/search', {
        params: {
            access_key: apiKey,
            query: query
        }
    })

    return data.organic_results?.map(item => ({
        title: item.title,
        url: item.url,
        snippet: item.snippet || '' 
    })) || []
}