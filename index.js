const axios = require('axios');
const cheerio = require('cheerio');

const args = process.argv.slice(2);
console.log(args);

const date = new Date();

const snipe = () => {
  console.log("Sniping...");
  console.log(new Date() - date);
}

setTimeout(snipe, 10000);
