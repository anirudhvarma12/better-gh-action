const fs = require("fs");

fs.readFile(`${process.env.GITHUB_WORKSPACE}/defaultlist.json`, function (err, file) {
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }
  const database = JSON.parse(file.toString());
  const gh_context = JSON.parse(process.env.gh_context);
  const issueTitle = gh_context.event.issue;
  const issueDescription = gh_context.event.body;
  console.log("Number of links", database.length);
  console.log("Issue Title", issueTitle, "Description", issueDescription);
});
