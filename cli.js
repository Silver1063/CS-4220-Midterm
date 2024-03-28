import { searchByKeyword } from './api.js';
import { Command } from 'commander';

// Create a new instance of Command
const program = new Command();

// Define the program description and version
program
  .version('1.0.0')
  .description('CLI tool for searching Launch Library 2 API');

// Add a search command to search based on a keyword
program
  .command('search <keyword>')
  .description('search based on your selected API using a keyword')
  .action(async (keyword) => {
    try {
      const searchResults = await searchByKeyword(keyword);
      console.log('Search results:');
      displayResults(searchResults);
    } catch (error) {
      console.error('Error:', error.message);
    }
  });


// Parse command-line arguments
program.parse(process.argv);

// Function to display search results
function displayResults(results) {
  for (const category in results) {
    if (results.hasOwnProperty(category)) {
      console.log(`--- ${category.charAt(0).toUpperCase() + category.slice(1)} ---`);
      console.log(`Count: ${results[category].count}`);
      console.log('Results:');
      results[category].results.forEach(result => {
        console.log(JSON.stringify(result, null, 2));
      });
      console.log('\n');
    }
  }
}
