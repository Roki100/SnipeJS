const axios = require('axios');
const util = require('./util');
const config = require('./config.json')

const args = process.argv.slice(2);

let uuid, auth
let credentials = {}

const snipe = () => {
  axios.post(
    "https://api.mojang.com/user/profile/"+uuid+"/name",
    credentials,
    {headers: {
      "Authorization": auth
    }}
  ).then(function (response){
      if(response.status == 200) console.log("Name Sniped!");
  }).catch(function (error) {
      errorLog(error.response.data);
  });
}

const errorLog = (msg) => {
  console.log(msg);
  process.exit();
}

//Verifies if name is snipeable, times sniping function
const snipeSetup = async () => {
    let uuidReq = await axios.get("https://api.mojang.com/users/profiles/minecraft/"+args[0]);
    if(uuidReq.status != 200) errorLog("Failed! Error "+uuidReq.status+": "+uuidReq.statusText);
    let pastNames = await axios.get("https://api.mojang.com/user/profiles/"+uuidReq.data.id+"/names");
    if(pastNames.data.length == 1) errorLog("Failed! Name is taken.");
    let name = pastNames.data[pastNames.data.length-2].name
    let time = pastNames.data[pastNames.data.length-1].changedToAt + 3196800000;
    if(time - new Date() < 0) errorLog("Failed! Name is taken.");
    setTimeout(snipe, time - new Date())
    console.log("Sucess! Sniping "+name+" in "+(time - new Date())+"ms")
    credentials = {name: name, password: config.password}
};

//Verifies if credentials for account in config are valid
const accountSetup = async () => {
  if (config.username == undefined) errorLog("Failed! No Username for Sniper.");
  if (config.bearer == undefined) errorLog("Failed! No Token for Sniper.");
  if (config.password == undefined) errorLog("Failed! No Password for Sniper.");


  let uuidReq = await axios.get("https://api.mojang.com/users/profiles/minecraft/"+config.username);
  if(uuidReq.status != 200){
    if(uuidReq.status == 204) errorLog("Failed! Incorrect username provided for bot.");
    else errorLog("Failed! Error "+uuidReq.status+": "+uuidReq.statusText);
  }

  uuid = uuidReq.data.id;
  auth = "Bearer " +config.bearer;
  let getQuestions = await axios.get(
    "https://api.mojang.com/user/security/challenges",
    {headers: {
      "Authorization": auth
    }}
  ).catch(function (error) {
    errorLog(error.response.data);
  });

  if(getQuestions.status != 200) errorLog("Failed! Error "+getQuestions.status+": "+getQuestions.statusText);

  let answer = [];

  for(let i=0; i<3; i++){
    answer.push({
        id: getQuestions.data[i].answer.id,
        answer: config.questions[i]
    });
  }

  let answerPost = await axios.post(
    "https://api.mojang.com/user/security/location",
    answer,
    {headers: {
      "Authorization": auth
    }}
  ).catch(function (error) {
    errorLog(error.response.data);
  });

  if(answerPost.status != 204) errorLog("Failed! Error "+answerPost.status+": "+answerPost.statusText);

  console.log("Sucess! Credentials for "+config.username+" verified.");
}

util.printTitle();

snipeSetup();
accountSetup();
