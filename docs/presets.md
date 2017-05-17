# Presets

iD editor preset and field types are defined in JSON files located under the
[data/presets folder of the iD
repository](https://github.com/openstreetmap/iD/tree/master/data/presets).

Custom presets can (and should) be defined to augment those. See [iD's preset
README.md](https://github.com/openstreetmap/iD/blob/master/data/presets/README.md)
for more information on preset definition.

Surveyor does not appear to need to modify the preset schema (yet?), as
additional information (i.e. whether the data associated with a preset should be
kept private) can be defined in the survey.

## Extensions

Additional options (for stock or shared field types) can be provided by matching
the `presets/fields/<type>.json` convention, as
`presets/options/tag/<type>.json`. See
[`data/presets/options/README.md`](../data/presets/options/README.md) for more
information.

## Tools

[id-presets-builder](https://github.com/digidem/id-presets-builder) can be used to manage presets and translations.
