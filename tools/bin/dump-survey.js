#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const argv = process.argv.slice(2);

const formatAsMarkdown = survey => {
  console.log("#", survey.name);
  console.log();
  console.log(survey.description.trim());
  console.log();
  console.log("## Observation Types");
  console.log();

  const { featureTypes, observationTypes } = survey;

  observationTypes.forEach(t => {
    const type = featureTypes.find(x => x.id === t);

    console.log("###", type.name);

    console.log();

    Object.keys(type.tags).forEach(tag => {
      console.log("* `%s=%s`", tag, type.tags[tag]);
    });

    console.log();
    console.log("Applies to %s.", type.geometry.join(", "));
    console.log();

    type.fields.forEach(field => {
      console.log("#### %s (%s)", field.label, field.type);
      console.log();

      if (field.tags) {
        console.warn("Multiple tags defined:", field.tags);
      }

      console.log("* `%s`", field.key);

      if (field.strings != null) {
        console.log();
        console.log("##### Options");
        console.log();

        Object.keys(field.strings.options).forEach(option => {
          console.log("* [ ] %s (`%s`)", field.strings.options[option], option);
        });
      }

      console.log();
    });

    if (type.related.length > 0) {
      console.log("##### Related");

      type.related.forEach(related => {
        console.log("*", featureTypes.find(x => x.id === related).name);
      });

      console.log();
    }
  });
};

let survey;

if (argv.length === 0) {
  const stdin = [];

  process.stdin.on("data", chunk => stdin.push(chunk));
  process.stdin.on("end", () => {
    formatAsMarkdown(JSON.parse(Buffer.concat(stdin).toString()));
  });
} else {
  formatAsMarkdown(JSON.parse(fs.readFileSync(path.resolve(argv[0]))));
}
