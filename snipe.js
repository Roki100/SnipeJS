const util = require('./util/util');
const config = require('./json/config.json');
const axios = require('axios');
const cheerio = require('cheerio');

util.printTitle();

//Checks for issues that could be problematic in the future
if(util.ping() == null) util.error("[ERROR] Cannot connect to Mojang API. Verify your connection!");
if(config.username == undefined) util.error("[ERROR] No username in config!");
if(config.password == undefined) util.error("[ERROR] No password in config!");
if(config.bearer == undefined) util.error("[ERROR] No token in config!");
if(config.target == undefined) util.error("[ERROR] No target in config!");

//Setting vars
const uuid = util.getUUID(config.username);
let snipeTime = null;

if(uuid == null) util.error("[ERROR] Failed to fetch your UUID. Make sure your config is correct!");

//Snipe setup
const snipeSetup = async () => {
    const req = await axios("https://namemc.com/name/"+config.target);
    if(req.status != 200) util.error("[ERROR] Could not connect to NameMC.");

    const $ = cheerio.load(req.data);

    if($('.my-1').text().match(/Available/) == null) util.error("[ERROR] "+config.target+" is not available");

    const time = new Date(Object.values(Object.values($('.countdown-timer'))[0].attribs)[1]);

    snipeTime = time.getTime();

    console.log(config.target+" is avaiable on "+time.toString());
}

snipeSetup();
