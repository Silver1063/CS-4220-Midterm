import chalk from "chalk";
import boxen from "boxen";
import yargs from "yargs";

const greeting = chalk.white.bold("GET READY TO LAUNCH SHIT INTO SPACE");

const boxenOptions = {
  padding: 1,
  margin: 1,
  borderStyle: "round",
  borderColor: "green",
  backgroundColor: "#555555",
};
const msgBox = boxen(greeting, boxenOptions);

console.log(msgBox);

const y = yargs();

const options = y.usage("Usage: -n <name>").option("n", {
  alias: "name",
  describe: "Your name",
  type: "string",
  demandOption: true,
}).argv;

const greeting1 = `Hello, ${options.name}!`;

console.log(greeting1);
