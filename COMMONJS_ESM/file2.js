const { a: x } = require("./file1.js");
const { a: y } = require("./file3.js");

// const add = require("./utilities/add.js")
// console.log("additions: ",add(x, y));

const { add, sub } = require("./utilities");

console.log("additions:", add(x, y));
console.log("subtruction:", sub(x, y));

// console.log(x, y);
