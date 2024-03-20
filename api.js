// import necessary modules
import axios from "axios";
import url from "node:url";
import path from "node:path";
import fs from "node:fs";

// in ECMAScript Modules (ESM), __dirname is not available directly like in CommonJS
// use 'url' and 'path' modules to achieve similar functionality
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Write your getPage function here
const getPage = async (url) => {
  try {
    const response = await axios.get(url);
    writeResults(url, response, "success");
  } catch (error) {
    writeResults(url, error.response, "error");
  }
};

// Write your writeResults function here
const writeResults = (url, response, type) => {
  const status = response.status;
  const body = response.data;

  const output = [url, type, status, body.length, Date.now()].join(" | ");

  fs.appendFile(__dirname + "/result.txt", output + "\n", (err) => {
    if (err) throw err;
    console.log('The "data to append" was appended to file!');
  });
};
