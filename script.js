const fs = require("fs");

console.log("GITHUB", process.env);
fs.readdir(process.env.RUNNER_WORKSPACE, function (err, files) {
  //handling error
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }
  //listing all files using forEach
  files.forEach(function (file) {
    // Do whatever you want to do with the file
    console.log("File,", file);
  });
});