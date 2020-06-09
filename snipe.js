const axios = require('axios');
const util = require('./util');
const args = process.argv.slice(2);

const snipe = () => {
  console.log("Sniping!");
}

const setTimer = async () => {
    let uuidReq = await axios.get("https://api.mojang.com/users/profiles/minecraft/"+args[0]);
    let pastNames = await axios.get("https://api.mojang.com/user/profiles/"+uuidReq.data.id+"/names");
    let name = pastNames.data[pastNames.data.length-2].name
    let time = pastNames.data[pastNames.data.length-1].changedToAt + 3196800000 - new Date();
    setTimeout(snipe, time)
    console.log("Sucess! Sniping "+name+" in "+time+"ms")
};

util.printTitle();

setTimer()