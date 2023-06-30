console.info("start");

const fs = require("fs");

fs.readdir("C:/Users", (err, files) => {
  console.warn(files);
});
