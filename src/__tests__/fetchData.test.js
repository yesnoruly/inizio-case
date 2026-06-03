import { describe, it, expect, vi } from 'vitest';
import { fetchDataFx } from '../js/fetchData';

import axios from 'axios';

vi.mock('axios', () => ({
    default: {
        get: vi.fn(() => Promise.resolve({
            data: {
                organic_results: [
                    {
                        position: 1,
                        displayed_url: 'https://www.helloworldcs.org/',
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
    it('return object with results and raw', async () => {
        const data = await fetchDataFx('test query', 'api_key');

        expect(data).toHaveProperty('results')
        expect(data).toHaveProperty('raw')
    })

    it('return at list one result', async () => {
        const { results } = await fetchDataFx('test query', 'api_key');

        expect(results.length).toBeGreaterThan(0);
    })

    it('result contains parsed data', async () => {
        const { results } = await fetchDataFx('test query', 'api_key');

        expect(results[0]).toHaveProperty('title')
        expect(results[0]).toHaveProperty('url')
        expect(results[0]).toHaveProperty('snippet')
        expect(results[0]).not.toHaveProperty('position')
    });

    it('properties of the result of the corresponding type', async () => {
        const { results } = await fetchDataFx('test query', 'api_key')

        expect(typeof results[0]).toBeTypeOf('string')
        expect(typeof results[0]).toBeTypeOf('string')
        expect(typeof results[0]).toBeTypeOf('string')
    })

    it('returns empty array when no results', async () => {
        axios.get.mockResolvedValueOnce({
            data: { organic_results: [] }
        })

        const { results, raw } = await fetchDataFx('test query', 'api_key')

        expect(results).toEqual([])
        expect(raw).toEqual([])
    })

    it('raw contains organic results full response', async () => {
        const { raw } = await fetchDataFx('test query', 'api_key')

        expect(raw[0]).toHaveProperty('displayed_url')
        expect(raw[0]).toHaveProperty('position')
    })

    it('throws error when API fails', async () => {
        axios.get.mockRejectedValueOnce(new Error('Network Error'))

        const data = fetchDataFx('test query', 'api_key')

        await expect(data).rejects.toThrow('Network Error')
    })
})