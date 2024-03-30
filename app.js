// import necessary modules
import axios from "axios";
import url from "url";
import path from "path";
import fs from "fs";
import { searchByKeyword, getDetailsByID } from "./api.js";
import { find, create } from "./db.js";

let cache = false;

export const search = async (keyword) => {
  const results = await searchByKeyword(keyword);
  let resultCount = 0;
  for (let property in results) {
    resultCount += results[property].count
  }

  const data = { search: keyword, resultCount: resultCount };

  await create("search_history", data);

  if (cache) {
  } else {
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
    console.log(`Query: ${previousSearch.query}`);
    console.log(`Timestamp: ${previousSearch.timestamp}`);
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

const test = await search("Bob");
const test1 = await search("Jane");
const test2 = await search("Vald");
const test3 = await search("Skate");
