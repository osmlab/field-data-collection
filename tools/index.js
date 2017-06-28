const fs = require("fs");
const path = require("path");

const async = require("async");
const dataURI = new (require("datauri"))();
const mapnik = require("mapnik");
const recursive = require("recursive-readdir");
const uniq = require("lodash.uniq");
const uniqBy = require("lodash.uniqby");
const yaml = require("js-yaml");

const getParser = type => {
  switch (type.toLowerCase()) {
    case "json":
      return JSON.parse;

    case "yml":
    case "yaml":
      return yaml.safeLoad;

    default:
      throw new Error(`Unsupported type: ${type}`);
  }
};

const parse = (path, type, callback) =>
  fs.readFile(path, (err, body) => {
    if (err) {
      return callback(err);
    }

    try {
      return callback(null, getParser(type)(body));
    } catch (err) {
      return callback(new SyntaxError(`${err.message} in ${path}`));
    }
  });

const loadCategory = ({ basePath }, category, callback) =>
  parse(
    path.resolve(basePath, "categories", category + ".json"),
    "json",
    callback
  );

const loadField = ({ basePath }, fieldName, callback) =>
  parse(
    path.resolve(basePath, "fields", fieldName + ".json"),
    "json",
    callback
  );

const loadPreset = ({ basePath }, presetName, callback) =>
  parse(
    path.resolve(basePath, "presets", presetName + ".json"),
    "json",
    callback
  );

const renderIconAsPNG = ({ basePath }, icon, callback) => {
  const filename = path.resolve(basePath, "icons", icon + ".svg");

  return fs.readFile(filename, (err, svgBytes) => {
    if (err) {
      return callback(err);
    }

    return mapnik.Image.fromSVGBytes(
      svgBytes,
      {
        scale: 2
      },
      (err, image) => {
        if (err) {
          return callback(err);
        }

        return image.encode("png", (err, buffer) => {
          if (err) {
            return callback(err);
          }

          return callback(null, {
            buffer,
            icon
          });
        });
      }
    );
  });
};

// NOTE: options is the first argument so that it can be partially applied prior
// to use by map functions
const resolveField = (options, field, callback) => {
  if (typeof field === "string") {
    return loadField(options, field.replace(/:/g, "/"), callback);
  }

  return loadField(options, field.type.replace(/:/g, "/"), (err, fieldDefn) => {
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

const resolvePreset = (preset, options, callback) =>
  async.map(
    preset.fields,
    async.apply(resolveField, options),
    (err, fields) => {
      if (err) {
        return callback(err);
      }

      return callback(
        null,
        Object.assign(preset, {
          fields
        })
      );
    }
  );

const resolveFields = (fields, options, callback) => {
  if (fields != null) {
    return async.map(fields, async.apply(resolveField, options), callback);
  }

  return setImmediate(callback, null, []);
};

const resolveCategories = (options, callback) => {
  const { basePath } = options;
  const categoryDir = path.join(basePath, "categories");

  return fs.stat(categoryDir, err => {
    if (err) {
      if (err.code === "ENOENT") {
        // no categories available
        return callback(null, []);
      }

      return callback(err);
    }

    return recursive(categoryDir, (err, entries) => {
      if (err) {
        return callback(err);
      }

      const categories = entries.map(x =>
        x
          .replace(path.normalize(categoryDir) + "/", "")
          .replace(path.extname(x), "")
      );

      return async.map(
        categories,
        async.apply(loadCategory, options),
        (err, categories) => {
          if (err) {
            return callback(err);
          }

          return callback(
            null,
            categories.map(x =>
              Object.assign(x, {
                members: x.members.map(m => m.replace("/", "="))
              })
            )
          );
        }
      );
    });
  });
};

const resolveIcons = (options, callback) => {
  const { basePath } = options;
  const iconDir = path.join(basePath, "icons");

  return fs.stat(iconDir, err => {
    if (err) {
      if (err.code === "ENOENT") {
        // no icons available
        return callback(null, []);
      }

      return callback(err);
    }

    return fs.readdir(iconDir, (err, entries) => {
      if (err) {
        return callback(err);
      }

      return async.mapLimit(
        entries
          .filter(x => x.endsWith(".svg"))
          .map(x => x.replace(path.extname(x), "")),
        10,
        async.apply(renderIconAsPNG, options),
        (err, icons) => {
          if (err) {
            return callback(err);
          }

          return callback(
            null,
            icons.map(({ buffer, icon }) => ({
              icon,
              src: dataURI.format(".png", buffer).content
            }))
          );
        }
      );
    });
  });
};

// NOTE: options is the first argument so that it can be partially applied prior
// to use by map functions
const resolveFeatureType = (opts, featureType, callback) => {
  let { preset } = featureType;

  if (typeof featureType === "string") {
    preset = featureType;
  }

  return loadPreset(opts, preset, (err, preset) => {
    if (err) {
      return callback(err);
    }

    const { exclude } = featureType;

    // remove fields that should be excluded
    if (exclude != null) {
      preset.fields = preset.fields.filter(field => !exclude.includes(field));
    }

    return resolvePreset(preset, opts, (err, preset) => {
      if (err) {
        return callback(err);
      }

      const { extend, id, include, name, options, related } = featureType;

      // overrides
      preset.id = id || featureType.replace("/", "=");
      preset.name = name || preset.name;
      preset.related = related || [];

      // stash extension info for post-processing
      if (extend != null) {
        preset.extend = extend;
      }

      // append custom fields
      return resolveFields(include, opts, (err, fields) => {
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

const resolveFeatureTypes = (featureTypes, options, callback) =>
  async.map(featureTypes, async.apply(resolveFeatureType, options), callback);

const listPresets = (presetDir, callback) =>
  recursive(presetDir, (err, entries) => {
    if (err) {
      return callback(err);
    }

    return callback(
      null,
      entries.map(x =>
        x
          .replace(path.normalize(presetDir) + "/", "")
          .replace(path.extname(x), "")
      )
    );
  });

const resolveSurvey = (surveyDefinition, options, callback) => {
  const { feature_types } = surveyDefinition;
  let addFeatureTypes = callback => callback(null, feature_types);

  if (feature_types == null) {
    addFeatureTypes = listPresets.bind(
      null,
      path.join(options.basePath, "presets")
    );
  }

  return addFeatureTypes((err, featureTypes) => {
    if (err) {
      return callback(err);
    }

    return async.parallel(
      {
        categories: async.apply(resolveCategories, options),
        featureTypes: async.apply(resolveFeatureTypes, featureTypes, options),
        icons: async.apply(resolveIcons, options)
      },
      (err, { categories, featureTypes, icons }) => {
        if (err) {
          return callback(err);
        }

        // post-process feature types
        featureTypes = featureTypes.map(ft => {
          if (ft.extend != null) {
            // the original definition of this feature type
            const ftDef = feature_types.find(x => x.id === ft.id);
            // definitions to extend
            const defs = [];

            if (Array.isArray(ft.extend)) {
              defs.push(...feature_types.filter(x => ft.extend.includes(x.id)));
            } else {
              defs.push(feature_types.find(x => x.id === ft.extend));
            }

            let localFields = ft.fields;
            const inheritedFields = [];

            const relatedTypes = ft.related;
            const inhertedRelatedTypes = [];

            defs.forEach(def => {
              if (def.exclude != null) {
                const toRemove = [];

                if (ftDef.include != null) {
                  // resolve the list of included fields to their type
                  const included = ftDef.include.map(i => i.type || i);

                  // locally included fields should override what the parent excludes
                  toRemove.push(
                    ...def.exclude.filter(e => !included.includes(e))
                  );
                } else {
                  toRemove.push(...def.exclude);
                }

                // remove excluded fields
                localFields = localFields.filter(
                  f => !toRemove.includes(f.type)
                );
              }

              // add inherited fields
              const superType = featureTypes.find(x => x.id === def.id);
              inheritedFields.push(...superType.fields);
              inhertedRelatedTypes.push(...superType.related);
            });

            // append + dedupe local fields (both custom + from presets), preferring
            // custom fields
            ft.fields = uniqBy(
              inheritedFields.concat(localFields).reverse(),
              "key"
            ).reverse();

            // append + dedupe related fields
            ft.related = uniq(inhertedRelatedTypes.concat(relatedTypes));

            // clean up after ourselves
            delete ft.extend;
          }

          return ft;
        });

        const observationTypes =
          surveyDefinition.observation_types || featureTypes.map(x => x.id);

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
          categories,
          description,
          editable,
          icons,
          imagery,
          meta,
          name,
          sync,
          version,
          featureTypes,
          observationTypes
        };

        return callback(null, survey);
      }
    );
  });
};

module.exports.compileSurvey = (surveyConfig, callback) => {
  try {
    return resolveSurvey(
      yaml.safeLoad(fs.readFileSync(surveyConfig)),
      {
        basePath: path.dirname(surveyConfig)
      },
      callback
    );
  } catch (err) {
    return callback(err);
  }
};
