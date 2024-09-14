const json = require("../package.json");

for (const key in json.scripts) {
  console.log(key);
}
