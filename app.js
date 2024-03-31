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
            '  ' + i + ' ' + id_prefix[result.id[0]] + ': ' + result.name
        );
        i++;
    }

    const selection = reader.question('Enter your selection: ');

    // test me
    if (selection < 0 || selection >= resultCount || isNaN(selection)) {
        console.log('Invalid selection, defaulted to option 0');
        selection = 0;
    }

    const selected = results[selection];
    const type = selected.id[0];

    let details = null;

    if (cache) {
        details = (await find('search_cache', selected.id)).details;
    }

    if (details == null) {
        details = await getAndCacheDetails(selected.id);
        console.log('Details retrieved from api...');
    } else {
        console.log('Details retrieved from cache...');
    }

    //console.log(details);

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
    console.log('    Name:                ', details.name);
    console.log('    Age:                 ', details.age);
    console.log('    Date of Birth:       ', details.date_of_birth);
    console.log('    Agency:              ', details.agency.name);
    console.log('    Currently in space:  ', details.in_space);
    console.log('    Biography:');
    console.log(details.bio);
};

const displayLaunchDetails = (details) => {
    console.log('----------- Launch Details -----------');
    console.log('    Launch Name:         ', details.name);
    console.log('    Launch Status:       ', details.status.name);
    console.log('    Launch Description:');
    console.log(details.status.description);
    console.log('    Rocket Name:         ', details.rocket.configuration.name);
    console.log('    Rocket Description:');
    console.log(details.rocket.configuration.description);
};

const displayEventDetails = (details) => {
    console.log('----------- Event Details -----------');
    console.log('    Event Name:          ', details.name);
    console.log('    Type:                ', details.type.name);
    console.log('    Location:            ', details.location);
    console.log('    Video Link:          ', details.video_url);
    console.log('    News Link:           ', details.news_url);
    console.log('    Description:');
    console.log(details.description);
};

export const history = async () => {
    try {
        const searchHistory = await find('search_history');
        let i = 0;
        console.log('Search Log Most to Least Recent');
        for (const search of searchHistory.reverse()) {
            console.log(
                `\tSearch ${i++}\tKeyword: ${search.search}\tResult Count: ${
                    search.resultCount
                }`
            );
        }
    } catch (error) {
        throw new Error(`Error retrieving previous search: ${error.message}`);
    }
};
