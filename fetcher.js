const request = require("request");
const url = process.argv[2];
const filePath = process.argv[3];
const fs = require("fs");
const colors = require("colors");

const fetcher = (url) => {
  const splittedArray = filePath.split(".");
  if (splittedArray.length < 3) {
    console.log(`${filePath} is invalid!\nApp has exited!`.red);
    return;
  }
  request(url, (error, response, body) => {
    if (error || response.statusCode !== 200) throw new Error(`Status Code: ${response.statusCode}`);
    fs.exists(filePath, (exists) => {
      if (exists) {
        const readline = require("readline");
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });
        askQuestion(rl, body);
      } else {
        writeFile(filePath, body);
      }
    });
  });
};

fetcher(url);

const writeFile = (path, body) => fs.writeFile(path, body, (err) => {
  if (err) throw new Error("Could not write file!".red);
  fs.stat(path, (error, stats) => {
    console.log(`Downloaded and saved ${stats["size"]} bytes to ${path}!`.green);
  });
});

const askQuestion = (rl, body) => {
  rl.question("File already exists! Would you like to overwrite the file? (Y/N) \t".red , (answer) => {
    const generalizedAnswer = answer.toLowerCase();
    if (generalizedAnswer === "y") {
      console.log("File has been overwritten!".green);
      writeFile(filePath, body);
      rl.close();
    } else if (generalizedAnswer === "n") {
      console.log("Exited the app!".green);
      rl.close();
    } else {
      askQuestion(rl, body);
    }
  });
};