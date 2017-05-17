# Survey Definitions

Theoretical survey to support GFDRR's [Safer
Schools](https://www.gfdrr.org/global-program-for-safer-schools) program.

```javascript
{
  "schema_version": "0.0.1", // survey schema version
  "version": "0.0.1", // survey version

  // English language display name for this survey.
  "name": "Safer Schools",

  // Armenian language display name for this survey.
  "name:hy": "ավելի ապահով Դպրոցներ",

  // Survey description
  "description": "GFDRR Safer Schools",

  // Can observations be made without knowing who users are?
  "anonymous": true,

  // Can observations not associated with existing features be created?
  // TODO need a better name for this
  "create": true,

  // Are observations created for this survey editable?
  "editable": true,

  // List of associated presets
  // This is an object because a) order doesn't matter, b) keys provide a list
  // (which translates well to YAML), and c) additional metadata is sometimes
  // necessary.
  // TODO some of these are top-level feature types (school, building), some are
  // "mix-ins" that merely add fields to top-level feature types (building,
  // building:condition, etc.)
  "presets": {
    // iD presets, as-is
    "@osm/amenity/school": true,
    "@osm/building": true,
    // TODO building_condition instead? (tag is building:condition)
    "@osm/building/condition": true,
    "@osm/building/material": true,
    "@osm/leisure/pitch": true,
    "@osm/roof/material": true,

    "students": { // custom preset
      "private": true // exclude this from data submitted to OSM
    }
  },

  // Features with these tags can have observations associated with them
  "features": {
    "amenity": "school",
    "leisure": "pitch"
  },

  "sync": {
    "mode": "server", // standalone | peer | server
    "endpoints": {
      "osm": "https://api.openstreetmap.org/",
      "coordinator": "http://birch.local:8000/"
    },
    "p2p": {
      "hash": "ca5cade"
    }
  },

  // TODO do these need content-types / target uses associated with them so that
  // the app knows what to do?
  "attachments": [
    "https://s3.amazonaws.com/surveyor-assets/armenia.mbtiles"
  ],

  "imagery": [
    "http://tile.openstreetmap.org/{z}/{x}/{y}.png", // URL template
    "http://tile.opencyclemap.org/index.json", // TileJSON
    {
      // inline TileJSON
      "name": "Hillshade",
      "bounds": [
        -180,
        -85.05113,
        180,
        85.05113
      ],
      "maxzoom": 22,
      "minzoom": 0,
      "tiles": [
        "http://d34o1q5y1d9is8.cloudfront.net/hillshade/{z}/{x}/{y}.png"
      ]
    }
  ],

  "meta": {
    // TODO borrow from npm's author semantics
    "coordinator": "Seth Fitzsimmons <seth@mojodna.net>",
    "organization": "Pacific Atlas"
    // ...other metadata
  },
}
```

Also available as YAML for readability purposes. This demonstrates how related
observations could be defined.

```yaml
name: Monitoring

presets:
  oil_spill:
    private: true
    related:
      - groundwater_pollution

  trash:
    private: true

  groundwater_pollution:
    private: true
    related:
      - oil_spill
```
