const config = {
  development: require("./development"),
  production: require("./production")
};

const env = process.env.NODE_ENV || "development";
module.exports = config[env];
