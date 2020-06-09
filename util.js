const fs = require('fs');

const printTitle = () => {
  console.log(fs.readFileSync("./doc/title.txt").toString());
}

exports.printTitle = printTitle;
