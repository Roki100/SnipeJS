const fs = require('fs')

const printTitle = () => {
  const title = fs.readFileSync("./util/title.txt").toString();
  console.log(title);
}

exports.printTitle = printTitle;
