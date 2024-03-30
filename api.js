import axios from "axios";

const base = "https://lldev.thespacedevs.com/2.2.0";

export const searchByKeyword = async (keyword) => {
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
// astronaut  with id 1ABC -> id = 01ABC
// launch     with id 1ABC -> id = 11ABC
// so on and so forth

const endpoints = { 0: "astronaut", 1: "launch", 2: "event" };

export const getDetailsByID = async (id) => {
  try {
    // Get the endpoint from the first character of id
    const endpoint = endpoints[id[0]];
    const item_id = sid.slice(1);
    const response = await axios.get(
      `${base}/${endpoint}/${encodeURIComponent(item_id)}/`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      `Error gettting Details Launch Library 2 API by ID: ${error.message}`
    );
  }
};

let result = await searchByKeyword("Bob");
console.log(result);
