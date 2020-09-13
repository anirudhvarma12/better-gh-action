const fs = require("fs");
const { exec } = require("child_process");

function parseURLFromIssueTitle(title) {
  return title.replace("Suggestion:", "").trim();
}

function findExistingMatchForUrl(url, list) {
  return list.findIndex((listItem) => {
    const match = url.match(new RegExp(listItem.urlPattern));
    return match;
  });
}

function setEnv(key, value) {
  exec(`echo "::set-env name=${key}::${value}"`, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
}

function setupPRVariables(suggestionForUrl, suggestedUrl) {
  setEnv("BETTER_PR_TITLE", `New Suggestion for ${suggestionForUrl} - ${suggestedUrl}`);
  setEnv("BETTER_COMMIT_MESSAGE", `Add ${suggestedUrl} as a suggested alternative to ${suggestionForUrl}`);
}

fs.readFile(`${process.env.GITHUB_WORKSPACE}/defaultlist.json`, function (err, file) {
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }
  const database = JSON.parse(file.toString());
  const gh_context = JSON.parse(process.env.gh_context);
  const issueTitle = gh_context.event.issue.title;
  const [suggestedUrl, name, ...descriptions] = gh_context.event.issue.body.split("\n");
  const url = parseURLFromIssueTitle(issueTitle);
  const existingIndex = findExistingMatchForUrl(url, database);
  console.log("Index for url", url, existingIndex);
  const newItem = { url: suggestedUrl.trim(), name: name.trim(), desc: descriptions.join() };
  console.log("New Item", newItem);
  if (existingIndex === -1) {
      const item = {
          urlPattern: url,
          alternatives: [newItem],
        };
        database.push(item);
    } else {
        database[existingIndex].alternatives.push(newItem);
    }
    fs.writeFileSync(`${process.env.GITHUB_WORKSPACE}/defaultlist.json`, JSON.stringify(database, null, 4));
    setupPRVariables(url, suggestedUrl.trim());
    console.log(process.env.BETTER_PR_TITLE, process.env.BETTER_COMMIT_MESSAGE);
});
