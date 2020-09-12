const fs = require("fs");

fs.readFile(`${process.env.GITHUB_WORKSPACE}/defaultlist.json`, function (err, file) {
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }
  const database = JSON.parse(file.join());
  const issueTitle = gh_context.event.issue;
  const issueDescription = gh_context.event.body;
  console.log("Number of links", database.length);
  console.log("Issue Title", issueTitle, "Description", issueDescription);
});