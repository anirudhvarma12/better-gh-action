const fs = require("fs");

console.log("GITHUB", process.env);
fs.readFile(`${process.env.RUNNER_WORKSPACE}/defaultlist.json`, function (err, file) {
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }
  console.log("FILE ", file.length);
  //   const list = JSON.parse(file.join());
});