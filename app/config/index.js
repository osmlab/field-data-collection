var env = process.env.NODE_ENV || "development";
console.log("weee", require("./" + env));
module.exports = require("./" + env);
