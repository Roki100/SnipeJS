const fs = require('fs');
const requestSync = require('sync-request')

const printTitle = () => {
  console.log(fs.readFileSync("./doc/title.txt").toString());
}

const ping = () => {
  const before = new Date();
  const req = requestSync('GET', "https://status.mojang.com/check");
  const after = new Date();

  if(req.statusCode != 200) return null;

  return (after-before);
}

const getUUID = (name) => {
  const req = requestSync('GET', "https://api.mojang.com/users/profiles/minecraft/"+name);

  if(req.statusCode != 200) return null;

  return JSON.parse(req.body).id
}

const error = (msg) => {
  console.log(msg);
  process.exit();
}

exports.printTitle = printTitle;
exports.ping = ping;
exports.error = error;
exports.getUUID = getUUID;
