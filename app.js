// import necessary modules
import axios from "axios";
import url from "url";
import path from "path";
import fs from "fs";
import * as api from './api.js';
import { find } from './db.js';














//--------------------------------------------------------------------------------------------
////////////////////////////////////////////////////////////////////////////////////////


/**
 * Retrieves the previous search from the search history
 * @returns {Promise<Object|null>} the previous search retrieved from the history
 * @throws {Error} an error if there's an issue retrieving the previous search
 */
const getPreviousSearch = async () => {
    try {
        const searchHistory = await find('search_history');
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
        console.log('No previous search available.');
    } else {
        console.log('Previous Search:');
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
