// import necessary modules
import axios from "axios";
import url from "url";
import path from "path";
import fs from "fs";
import reader from "readline-sync";
import { searchByKeyword, getDetailsByID } from "./api.js";
import { find, create } from "./db.js";
import { get } from "https";

let cache = false;

export const search = async (keyword) => {
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

  const selected = results[selection];

  if (cache) {
    const cache_result = await find("search_cache", id);
    if (cache_result) {
    }
  } else {
    const details = await getDetailsByID(selected.id);

    const data = { id: selected.id, details: details };

    await create("search_cache", data);
  }
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
