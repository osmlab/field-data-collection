#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const argv = process.argv.slice(2);

const formatAsMarkdown = survey => {
  let markdown = [];

  markdown.push(`# ${survey.name}`);
  markdown.push("");
  markdown.push(survey.description.trim());
  markdown.push("");
  markdown.push("## Observation Types");
  markdown.push("");

  const { featureTypes, observationTypes } = survey;

  markdown = observationTypes.reduce((markdown, t) => {
    const type = featureTypes.find(x => x.id === t);

    markdown.push(`### ${type.name}`);
    markdown.push("");

    markdown = Object.keys(type.tags).reduce((markdown, tag) => {
      markdown.push(`* \`${tag}=${type.tags[tag]}\``);

      return markdown;
    }, markdown);

    markdown.push("");
    markdown.push(`Applies to ${type.geometry.join(", ")}.`);
    markdown.push("");

    markdown = type.fields.reduce((markdown, field) => {
      markdown.push(`#### ${field.label} (${field.type})`);
      markdown.push("");

      if (field.tags) {
        console.warn("Multiple tags defined:", field.tags);
      }

      markdown.push(`* \`${field.key}\``);

      if (field.strings != null && field.strings.options != null) {
        markdown.push("");
        markdown.push("##### Options");
        markdown.push("");

        if (Array.isArray(field.strings.options)) {
          markdown = field.strings.options.reduce((markdown, option) => {
            markdown.push(`* [ ] \`${option}\``);

            return markdown;
          }, markdown);
        } else {
          markdown = Object.keys(
            field.strings.options
          ).reduce((markdown, option) => {
            markdown.push(
              `* [ ] ${field.strings.options[option]} (\`${option}\`)`
            );

            return markdown;
          }, markdown);
        }
      }

      markdown.push("");

      return markdown;
    }, markdown);

    if (type.related.length > 0) {
      markdown.push("##### Related");

      markdown = type.related.reduce((markdown, related) => {
        markdown.push(`* ${featureTypes.find(x => x.id === related).name}`);

        return markdown;
      }, markdown);

      markdown.push("");
    }

    return markdown;
  }, markdown);

  return markdown.join("\n");
};

if (argv.length === 0) {
  const stdin = [];

  process.stdin.on("data", chunk => stdin.push(chunk));
  process.stdin.on("end", () => {
    process.stdout.write(
      formatAsMarkdown(JSON.parse(Buffer.concat(stdin).toString()))
    );
  });
} else {
  process.stdout.write(
    formatAsMarkdown(JSON.parse(fs.readFileSync(path.resolve(argv[0]))))
  );
}
