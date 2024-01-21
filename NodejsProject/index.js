import fs from "fs";

let data = "This is a test";

fs.writeFile("test.txt", data, (err) => {
  if (err) console.log(err);
  else {
    console.log("File written successfully\n");
    console.log("The written has the following contents:");
    console.log(fs.readFileSync("test.txt", "utf8"));
  }
});