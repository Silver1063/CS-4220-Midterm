import axios from "axios";

const base = "https://lldev.thespacedevs.com/2.2.0";

export const searchByKeyword = async (keyword) => {
  try {
    // Contains results of search, if empty we didn't find anything :(
    const results = [];

    // Make separate requests to each relevant endpoint for searching by keyword
    const [astronautsResponse, launchesResponse, eventsResponse] =
      await Promise.all([
        axios.get(`${base}/astronaut/?search=${encodeURIComponent(keyword)}`),
        axios.get(`${base}/launch/?search=${encodeURIComponent(keyword)}`),
        axios.get(`${base}/event/?search=${encodeURIComponent(keyword)}`),
      ]);

    const astronauts = astronautsResponse.data.results;
    const launches = launchesResponse.data.results;
    const events = eventsResponse.data.results;

    // need to prepend an identifier to id so we can figure out the correct endpoint later
    // there is probably a more succinct way to write this but idk this works whatever
    for (const astronaut of astronauts) {
      results.push({
        name: astronaut.name,
        id: "a" + astronaut.id,
      });
    }
    for (const launch of launches) {
      results.push({
        name: launch.name,
        id: "l" + launch.id,
      });
    }
    for (const event of events) {
      results.push({
        name: event.name,
        id: "e" + event.id,
      });
    }
    return results;
  } catch (error) {
    throw new Error(
      `Error searching Launch Library 2 API by keyword: ${error.message}`
    );
  }
};

// old implementation, left as reference
export const oldSearchByKeyword = async (keyword) => {
  try {
    // Make separate requests to each relevant endpoint for searching by keyword
    const [astronautsResponse, launchesResponse, eventsResponse] =
      await Promise.all([
        axios.get(`${base}/astronaut/?search=${encodeURIComponent(keyword)}`),
        axios.get(`${base}/launch/?search=${encodeURIComponent(keyword)}`),
        axios.get(`${base}/event/?search=${encodeURIComponent(keyword)}`),
      ]);

    // Extract data from responses
    const astronauts = astronautsResponse.data;
    const launches = launchesResponse.data;
    const events = eventsResponse.data;

    // Combine and format the results from all categories
    const combinedResults = {
      astronauts,
      launches,
      events,
    };

    return combinedResults;
  } catch (error) {
    throw new Error(
      `Error searching Launch Library 2 API by keyword: ${error.message}`
    );
  }
};

// since ID may clash depending on which endpoint the data is from, astronaut, launch, event, etc,
// treat the first character of id as a category identifier eg
// astronaut  with id 1ABC -> id = a1ABC
// launch     with id 1ABC -> id = l1ABC
// so on and so forth
export const getDetailsByID = async (id) => {
  try {
    const endpoints = { a: "astronaut", l: "launch", e: "event" };
    // Get the endpoint from the first character of id
    const endpoint = endpoints[id[0]];
    const item_id = id.slice(1);
    const response = await axios.get(
      `${base}/${endpoint}/${encodeURIComponent(item_id)}/`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `Error getting Details Launch Library 2 API by ID: ${error.message}`
    );
  }
};
