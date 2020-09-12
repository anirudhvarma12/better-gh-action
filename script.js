const fs = require("fs");

function parseURLFromIssueTitle(title) {
  return title.replace("Suggestion:", "").trim();
}

function findExistingMatchForUrl(url, list) {
  return list.findIndex((listItem) => {
    const match = url.match(new RegExp(listItem.urlPattern));
    console.log("For URL", url, listItem.urlPattern, match);
    return match;
  });
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
  if (existingIndex === -1) {
    const item = {
      urlPattern: url,
      alternatives: [
        {
          url: suggestedUrl.trim(),
          name: name.trim(),
          desc: descriptions.join(),
        },
      ],
    };
    database.push(item);
  } else {
    database[existingIndex].alternatives.push({
      url: suggestedUrl.trim(),
      name: name.trim(),
      desc: descriptions.join(),
    });
  }
  fs.writeFileSync(`${process.env.GITHUB_WORKSPACE}/defaultlist.json`, JSON.stringify(database));
});
