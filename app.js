// import necessary modules
import axios from "axios";
import url from "url";
import path from "path";
import fs from "fs";
import reader from "readline-sync";
import { searchByKeyword, getDetailsByID } from "./api.js";
import { find, create } from "./db.js";
import { get } from "https";

export const search = async (keyword, cache = false) => {
  // perform initial api search
  const results = await searchByKeyword(keyword);
  const resultCount = results.length;

  // save search history
  const search_data = { search: keyword, resultCount: resultCount };
  await create("search_history", search_data);

  // case where no results found
  if (resultCount == 0) {
    console.log("No results found.");
    return;
  }

  // present list of search results
  console.log("Search Results");
  const id_prefix = { a: "Astronaut", l: "Launch", e: "Event" };
  let i = 0;
  for (const result of results) {
    console.log("  " + i + " " + id_prefix[result.id[0]] + ": " + result.name);
    i++;
  }

  let selection = 0;
  selection = reader.question("Enter your selection: ");

  if (selection < 0 || selection >= resultCount || isNaN(selection)) {
    console.log("Invalid selection, defaulted to option 0");
    selection = 0;
  }

  const selected = results[selection];
  const type = selected.id[0];

  let details = null;

  if (cache) {
    details = (await find("search_cache", selected.id)).details;
  }

  if (details == null) {
    details = await getAndCacheDetails(selected.id);
    console.log("Details retrieved from api...");
  } else {
    console.log("Details retrieved from cache...");
  }

  switch (type) {
    case "a":
      displayAstronautDetails(details);
      break;
    case "l":
      displayLaunchDetails(details);
      break;
    case "e":
      displayEventDetails(details);
      break;
  }
};

const getAndCacheDetails = async (id) => {
  const details = await getDetailsByID(id);
  const data = { id: id, details: details };
  await create("search_cache", data);
  return details;
};

const displayAstronautDetails = (details) => {
  console.log("----------- Astronaut Details -----------");
  console.log("    Name:                ", details.name);
  console.log("    Age:                 ", details.age);
  console.log("    Date of Birth:       ", details.date_of_birth);
  console.log("    Agency:              ", details.agency.name);
  console.log("    Currently in space:  ", details.in_space);
  console.log("    Biography:");
  console.log(details.bio);
  //console.log(details.Error);
};

const displayLaunchDetails = (details) => {
  console.log("----------- Launch Details -----------");
  console.log("    Launch Name:         ", details.name);
  console.log("    Launch Status:       ", details.status.name);
  console.log("    Launch Description:");
  console.log(details.status.description);
  console.log("    Rocket Name:         ", details.rocket.configuration.name);
  console.log("    Rocket Description:");
  console.log(details.rocket.configuration.description);
  //console.log(details.Error);
};

const displayEventDetails = (details) => {
  console.log("----------- Event Details -----------");
  console.log("    Event Name:          ", details.name);
  console.log("    Type:                ", details.type.name);
  console.log("    Location:            ", details.location);
  console.log("    Video Link:          ", details.video_url);
  console.log("    News Link:           ", details.news_url);
  console.log("    Description:");
  console.log(details.description);
  //console.log(details.Error);
};

//--------------------------------------------------------------------------------------------
////////////////////////////////////////////////////////////////////////////////////////

/**
 * Retrieves the previous search from the search history
 * @returns {Promise<Object|null>} the previous search retrieved from the history
 * @throws {Error} an error if there's an issue retrieving the previous search
 */
const getPreviousSearch = async () => {
  try {
    const searchHistory = await find("search_history");
    const previousSearch = searchHistory.pop();
    return previousSearch;
  } catch (error) {
    throw new Error(`Error retrieving previous search: ${error.message}`);
  }
};

/**
 * Displays the previous search to the user in a user-friendly format
 * @param {Object|null} previousSearch - the previous search to display
 */
const displayPreviousSearch = (previousSearch) => {
  if (!previousSearch) {
    console.log("No previous search available.");
  } else {
    console.log("Previous Search:");
    console.log(`Search: ${previousSearch.search}`);
    console.log(`Result Count: ${previousSearch.resultCount}`);
  }
};

// Function to handle the previous search logic
const previous = async () => {
  try {
    const previousSearch = await getPreviousSearch();
    displayPreviousSearch(previousSearch);
  } catch (error) {
    console.error(error.message);
  }
};

//Call the function to display the previous search
// previous();

