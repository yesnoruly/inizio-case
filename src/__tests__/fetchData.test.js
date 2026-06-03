import { describe, it, expect, vi } from 'vitest';
import { fetchDataFx } from '../js/fetchData';

import axios from 'axios';

vi.mock('axios', () => ({
    default: {
        get: vi.fn(() => Promise.resolve({
            data: {
                organic_results: [
                    {
                        title: 'Test Title',
                        url: 'https://example.com/test',
                        snippet: 'A "Hello, world" program is usually a simple computer program that displays on the screen (often the console) a message similar to "Hello, world"'
                    }
                ]
            }
        }))
    }
}));

describe('fetchData', () => {
    it('return array of results', async () => {
        const results = await fetchDataFx('test query', 'api_key');

        expect(Array.isArray(results)).toBe(true)
    })

    it('return at list one result', async () => {
        const results = await fetchDataFx('test query', 'api_key');

        expect(results.length).toBeGreaterThan(0);
    })

    it('each result has title, url and description', async () => {
        const results = await fetchDataFx('test query', 'api_key');

        const firstResult = results[0];

        expect(firstResult).toHaveProperty('title')
        expect(firstResult).toHaveProperty('url')
        expect(firstResult).toHaveProperty('snippet')

        expect(typeof firstResult.title).toBe('string')
        expect(typeof firstResult.url).toBe('string')
        expect(typeof firstResult.snippet).toBe('string')
    });

    it('returns empty array when no results', async () => {
        axios.get.mockResolvedValueOnce({
            data: { organic_results: [] }
        })

        const results = await fetchDataFx('test query', 'api_key')

        expect(results).toEqual([])
    })

    it('throws error when API fails', async () => {
        axios.get.mockRejectedValueOnce(new Error('Network Error'))

        const results = fetchDataFx('test query', 'api_key')

        await expect(results).rejects.toThrow('Network Error')
    })
})