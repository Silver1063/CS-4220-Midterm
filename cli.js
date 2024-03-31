import { search, history } from './app.js';
import { Command } from 'commander';

// Create a new instance of Command
const program = new Command();
const options = program.opts();

// Define the program description and version
program
    .version('1.0.0')
    .description('CLI tool for searching Launch Library 2 API');

// Add a cache option for searches
program.option('-c, --cache', 'Use local cache to make searches, default off');

// Add a search command to search based on a keyword
program
    .command('search <keyword>')
    .description('Search based on your selected API using a keyword')
    .action(async (keyword) => {
        try {
            await search(keyword, options.cache);
        } catch (error) {
            console.error('Error:', error.message);
        }
    });

// History command
program
    .command('history')
    .description('Display the search history')
    .action(async () => {
        try {
            await history();
        } catch (error) {
            console.error('Error:', error.message);
        }
    });

// Parse command-line arguments
program.parse(process.argv);
