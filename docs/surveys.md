# Survey Definitions

Theoretical survey to support GFDRR's [Safer
Schools](https://www.gfdrr.org/global-program-for-safer-schools) program.

```javascript
{
  // survey schema version
  "schema_version": "0.0.1",

  // survey version
  "version": "0.0.1",

  // English language display name for this survey.
  "name": "Safer Schools",

  // Armenian language display name for this survey.
  "name:hy": "ավելի ապահով Դպրոցներ",

  // Survey description
  "description": "GFDRR Safer Schools",

  // Can observations be made without knowing who users are?
  "anonymous": true,

  // Are observations created for this survey editable?
  "editable": true,

  // feature types that we a) know about, b) can modify, c) can associate
  // observations with
  "feature_types": [
    {
      "id": "amenity=school",

      // TODO alternately "amenity": "school" (would remove ability to infer
      // preset name)
      "key": "amenity",
      "value": "school",

      // (this could even be inferred from <key>/<value>)
      "preset": "@osm/amenity/school",

      // additional fields
      "include": [
        {
          // custom type
          "type": "students",

          // exclude this from data submitted to OSM
          "private": true
        },
        {
          "type": "notes",

          // override the default key name (from the field configuration)
          "key": "gfdrr:notes",
          "private": true
        }
      ],

      // related feature types that can be suggested for creation or association
      // of new observations (edits)
      "related": [
        "building=school"
      ],
    },
    {
      "id": "building=school",
      "key": "building",
      "value": "school",

      // (this could even be inferred from <key>/<value>)
      "preset": "@osm/building/school"

      // additional fields not included in the preset by default
      "include": [
        "building:condition",
        "building:material",
        "roof:material",
        {
          "type": "notes",
          "private": true
        }
      ]
    },
    {
      "id": "leisure=pitch",
      "key": "leisure",
      "value": "pitch"

      // (this could even be inferred from <key>/<value>)
      "preset": "@osm/leisure/pitch",
      "name": "Playing Field", // override preset name
      "include": [
        {
          "type": "notes",
          "private": true
        }
      ]
    }
  ],

  // feature types that can be created (if this is empty or absent, features can
  // only be edited)
  "observation_types": [
    // aliases to previous-defined feature types
    "amenity=school",
    "building=school",
    {
      "key": "environment",
      "value": "standing_water"

      // (this could even be inferred from <key>/<value>)
      // TODO alternately key/value could be loaded from this
      "preset": "environment/standing_water",
      "private": true
    }
  ],

  "sync": {
    "mode": "server", // standalone | peer | server
    "endpoints": {
      "osm": "https://api.openstreetmap.org/",
      "coordinator": "http://birch.local:8000/"
    },
    "p2p": {
      "hash": "ca5cade5"
    }
  },

  // TODO document the list of types that Surveyor understands
  "attachments": [
    {
      "type": "mbtiles",
      "source": "https://s3.amazonaws.com/surveyor-assets/armenia.mbtiles"
    },
    {
      // ID that can be referenced in feature_types or observation_types when
      // specifying attachments to collect
      "id": "sample-form",
      "type": "xform",
      "source": "https://s3.amazonaws.com/surveyor-assets/sample-form.xml"
    }
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
        "http://something.cloudfront.net/hillshade/{z}/{x}/{y}.png"
      ]
    }
  ],

  "meta": {
    // these can also be objects containing name, email, url, similar to how
    // package.json handles people
    "coordinator": "Seth Fitzsimmons <seth@mojodna.net>",
    "organization": "OpenStreetMap (https://openstreetmap.org/)"
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
