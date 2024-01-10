const crypto = require("crypto");

console.log(Object.keys(crypto));

const generateRandomId = (length) => {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length);
};

const randomId = generateRandomId(10);
console.log("Random ID:", randomId);