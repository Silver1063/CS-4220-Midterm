// import necessary modules
import reader from 'readline-sync';
import { searchByKeyword, getDetailsByID } from './api.js';
import { find, create } from './db.js';

export const search = async (keyword, cache = false) => {
    // perform initial api search
    const results = await searchByKeyword(keyword);
    const resultCount = results.length;

    // save search history
    const search_data = { search: keyword, resultCount: resultCount };
    await create('search_history', search_data);

    // case where no results found
    if (resultCount == 0) {
        console.log('No results found.');
        return;
    }

    // present list of search results
    console.log('Search Results');
    const id_prefix = { a: 'Astronaut', l: 'Launch', e: 'Event' };
    let i = 0;
    for (const result of results) {
        console.log(
            '\t' + i + ' ' + id_prefix[result.id[0]] + ': ' + result.name
        );
        i++;
    }

    // Must be mutable so that we can override bad inputs
    let selection = reader.question('Enter your selection: ');

    if (selection < 0 || selection >= resultCount || isNaN(selection)) {
        console.log('Invalid selection, defaulted to option 0');
        selection = 0;
    }

    const selected = results[selection];

    let details = null;

    if (cache) {
        const result = await find('search_cache', selected.id);
        if (result) details = result.details;
    }

    if (details == null) {
        details = await getAndCacheDetails(selected.id);
        console.log('Details retrieved from api...');
    } else {
        console.log('Details retrieved from cache...');
    }

    const type = selected.id[0];
    switch (type) {
        case 'a':
            displayAstronautDetails(details);
            break;
        case 'l':
            displayLaunchDetails(details);
            break;
        case 'e':
            displayEventDetails(details);
            break;
    }
};

const getAndCacheDetails = async (id) => {
    const details = await getDetailsByID(id);
    const data = { id: id, details: details };
    await create('search_cache', data);
    return details;
};

const displayAstronautDetails = (details) => {
    console.log('----------- Astronaut Details -----------');
    console.log('\tName:\t\t\t' + details.name);
    console.log('\tAge:\t\t\t' + details.age);
    console.log('\tDate of Birth:\t\t' + details.date_of_birth);
    console.log('\tAgency:\t\t\t' + details.agency.name);
    console.log('\tCurrently in space:\t' + (details.in_space ? 'Yes' : 'No'));
    console.log('\tBiography:');
    console.log(details.bio);
};

const displayLaunchDetails = (details) => {
    console.log('----------- Launch Details -----------');
    console.log('\tLaunch Name:\t' + details.name);
    console.log('\tLaunch Status:\t' + details.status.name);
    console.log('\tLaunch Description:');
    console.log(details.status.description);
    console.log('\tRocket Name:\t' + details.rocket.configuration.name);
    console.log('\tRocket Description:');
    console.log(details.rocket.configuration.description);
};

const displayEventDetails = (details) => {
    console.log('----------- Event Details -----------');
    console.log('\tEvent Name:\t' + details.name);
    console.log('\tType:\t\t' + details.type.name);
    console.log('\tLocation:\t' + details.location);
    console.log('\tVideo Link:\t' + (details.video_url || 'None Provided'));
    console.log('\tNews Link:\t' + (details.news_url || 'None Provided'));
    console.log('\tDescription:');
    console.log(details.description);
};

export const history = async () => {
    try {
        const searchHistory = await find('search_history');
        let i = 0;
        console.log('Search Log Most to Least Recent');
        for (const search of searchHistory.reverse()) {
            console.log(
                `\tSearch ${i++}\tKeyword: ${search.search}\t\tResult Count: ${
                    search.resultCount
                }`
            );
        }
    } catch (error) {
        throw new Error(`Error retrieving previous search: ${error.message}`);
    }
};
