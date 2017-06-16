#!/usr/bin/env node
const path = require("path");

require("epipebomb")();

const { compileSurvey } = require("..");

const argv = process.argv.slice(2);

if (argv.length === 0) {
  console.error("Usage: compile-survey /path/to/survey.yaml");
  process.exit(1);
}

compileSurvey(path.resolve(argv.shift()), (err, survey) => {
  if (err) {
    throw err;
  }

  process.stdout.write(JSON.stringify(survey));
});
