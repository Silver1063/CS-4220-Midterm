import axios from 'axios';

const base = 'https://lldev.thespacedevs.com/2.2.0';

export async function searchByKeyword(keyword) {
  try {
    // Make separate requests to each relevant endpoint for searching by keyword
    const [astronautsResponse, launchesResponse, eventsResponse] = await Promise.all([
      axios.get(`${base}/astronaut/?search=${encodeURIComponent(keyword)}`),
      axios.get(`${base}/launch/?search=${encodeURIComponent(keyword)}`),
      axios.get(`${base}/event/?search=${encodeURIComponent(keyword)}`)
    ]);

    // Extract data from responses
    const astronauts = astronautsResponse.data;
    const launches = launchesResponse.data;
    const events = eventsResponse.data;

    // Combine and format the results from all categories
    const combinedResults = {
      astronauts,
      launches,
      events
    };

    return combinedResults;
  } catch (error) {
    throw new Error(`Error searching Launch Library 2 API by keyword: ${error.message}`);
  }
}
