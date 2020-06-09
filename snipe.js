const axios = require('axios');
const util = require('./util');
const args = process.argv.slice(2);

const snipe = () => {
  console.log("Sniping!");
}

const setTimer = async () => {
    let uuidReq = await axios.get("https://api.mojang.com/users/profiles/minecraft/"+args[0]);
    if(uuidReq.status != 200) return console.log("Failed! Error "+uuidReq.status+": "+uuidReq.statusText);
    let pastNames = await axios.get("https://api.mojang.com/user/profiles/"+uuidReq.data.id+"/names");
    if(pastNames.data.length == 1) return console.log("Failed! Name is taken.");
    let name = pastNames.data[pastNames.data.length-2].name
    let time = pastNames.data[pastNames.data.length-1].changedToAt + 3196800000;
    if(time - new Date() < 0) return console.log("Failed! Name is taken.");
    setTimeout(snipe, time - new Date())
    console.log("Sucess! Sniping "+name+" in "+(time - new Date())+"ms")
};

util.printTitle();

setTimer()
