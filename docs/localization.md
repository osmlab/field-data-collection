# Localization

Translations of app-level code are currently stored in the [locale](../locale) directory of this repository.

## Creating a new translation

1. Create a new JavaScript file for the language using the two-letter country code as the filename in the `locale` directory. For example: `es.js`.
2. Inside that file, export an object with all the translations. Use [locale/en.js](../locale/en.js) as an example.
3. Inside [locale/index.js](../locale/index.js) import the new localization file and add it to the object being passed to `new LocalizedStrings()`.
