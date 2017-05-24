#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const async = require("async");
require("epipebomb")();
const uniqBy = require("lodash.uniqby");
const yaml = require("js-yaml");

const argv = process.argv.slice(2);

if (argv.length === 0) {
  console.error("Usage: compile-survey /path/to/survey.yaml");
  process.exit(1);
}

const surveyConfig = path.resolve(argv.shift());
const BASE_PATH = path.dirname(surveyConfig);
const PRESET_PATH = path.resolve(BASE_PATH, "..", "presets", "presets");
const FIELD_PATH = path.resolve(BASE_PATH, "..", "presets", "fields");
const OPTION_PATH = path.resolve(BASE_PATH, "..", "presets", "options");

let surveyDefinition;

try {
  surveyDefinition = yaml.safeLoad(fs.readFileSync(surveyConfig));
} catch (err) {
  throw err;
}

const getParser = type => {
  switch (type.toLowerCase()) {
    case "json":
      return JSON.parse;

    case "yml":
    case "yaml":
      return yaml.safeLoad;

    default:
      throw new Exception(`Unsupported type: ${type}`);
  }
};

const parse = (path, type, callback) => {
  return fs.readFile(path, (err, body) => {
    if (err) {
      return callback(err);
    }

    try {
      return callback(null, getParser(type)(body));
    } catch (err) {
      console.warn(err.stack);
      return callback(err);
    }
  });
};

const loadField = (fieldName, callback) => {
  // TODO cache
  return parse(path.resolve(FIELD_PATH, fieldName + ".json"), "json", callback);
};

const loadPreset = (presetName, callback) => {
  // TODO cache
  return parse(
    path.resolve(PRESET_PATH, presetName + ".json"),
    "json",
    callback
  );
};

const resolvePreset = (preset, callback) => {
  return async.map(preset.fields, loadField, (err, fields) => {
    if (err) {
      return callback(err);
    }

    return callback(
      null,
      Object.assign(preset, {
        fields
      })
    );
  });
};

const resolveField = (field, callback) => {
  if (typeof field === "string") {
    return loadField(field.replace(/:/g, "/"), callback);
  }

  return loadField(field.type.replace(/:/g, "/"), (err, fieldDefn) => {
    if (err) {
      return callback(err);
    }

    if (field.options != null) {
      fieldDefn.strings = fieldDefn.strings || {};
      fieldDefn.strings.options = field.options;
    }

    // set private option
    if (field.private != null) {
      fieldDefn.private = field.private;
    }

    return callback(null, fieldDefn);
  });
};

const resolveFields = (fields, callback) => {
  if (fields != null) {
    return async.map(fields, resolveField, callback);
  }

  return setImmediate(callback, null, []);
};

const resolveFeatureType = (featureType, callback) => {
  const { preset } = featureType;

  return loadPreset(preset, (err, preset) => {
    if (err) {
      return callback(err);
    }

    const { exclude } = featureType;

    // remove fields that should be excluded
    if (exclude != null) {
      preset.fields = preset.fields.filter(field => !exclude.includes(field));
    }

    return resolvePreset(preset, (err, preset) => {
      if (err) {
        return callback(err);
      }

      const { extend, id, include, name, options } = featureType;

      // overrides
      preset.id = id;
      preset.name = name || preset.name;

      // stash extension info for post-processing
      if (extend != null) {
        preset.extend = extend;
      }

      // append custom fields
      return resolveFields(include, (err, fields) => {
        if (err) {
          return callback(err);
        }

        preset.fields.push(...fields);

        // populate custom options
        if (options != null) {
          Object.keys(options).forEach(key => {
            const opts = options[key];

            const field = preset.fields.find(f => f.key === key);

            if (field != null) {
              field.strings = field.strings || {};
              field.strings.options = opts;
            }
          });
        }

        return callback(null, preset);
      });
    });
  });
};

const resolveFeatureTypes = (featureTypes, callback) => {
  return async.map(featureTypes, resolveFeatureType, callback);
};

const resolveSurvey = (surveyDefinition, callback) => {
  const { feature_types } = surveyDefinition;

  return resolveFeatureTypes(feature_types, (err, featureTypes) => {
    if (err) {
      return callback(err);
    }

    featureTypes = featureTypes.map(ft => {
      if (ft.extend != null) {
        // the original definition of this feature type
        const ftDef = feature_types.find(x => x.id == ft.id);
        // definitions to extend
        const defs = [];

        if (Array.isArray(ft.extend)) {
          defs.push(...feature_types.filter(x => ft.extend.includes(x.id)));
        } else {
          defs.push(feature_types.find(x => x.id == ft.extend));
        }

        let localFields = ft.fields;
        const inheritedFields = [];

        defs.forEach(def => {
          if (def.exclude != null) {
            const toRemove = [];

            if (ftDef.include != null) {
              // resolve the list of included fields to their type
              const included = ftDef.include.map(i => i.type || i);

              // locally included fields should override what the parent excludes
              toRemove.push(...def.exclude.filter(e => !included.includes(e)));
            } else {
              toRemove.push(...def.exclude);
            }

            // remove excluded fields
            localFields = localFields.filter(f => !toRemove.includes(f.type));
          }

          // add inherited fields
          const superType = featureTypes.find(x => x.id == def.id);
          inheritedFields.push(...superType.fields);
        });

        // append + dedupe local fields (both custom + from presets), preferring
        // custom fields
        ft.fields = uniqBy(
          inheritedFields.concat(localFields).reverse(),
          "key"
        ).reverse();

        // clean up after ourselves
        delete ft.extend;
      }

      return ft;
    });

    const observationTypes = surveyDefinition.observation_types;

    const {
      attachments,
      description,
      imagery,
      meta,
      name,
      sync,
      version
    } = surveyDefinition;
    let { anonymous, editable } = surveyDefinition;

    // defaults
    if (anonymous == null) {
      anonymous = true;
    }

    if (editable == null) {
      editable = true;
    }

    const survey = {
      anonymous,
      attachments,
      description,
      editable,
      imagery,
      meta,
      name,
      sync,
      version,
      featureTypes,
      observationTypes
    };

    return callback(null, survey);
  });
};

resolveSurvey(surveyDefinition, (err, survey) => {
  if (err) {
    throw err;
  }

  process.stdout.write(JSON.stringify(survey));
});
