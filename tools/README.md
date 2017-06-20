  # Surveyor Tools

This contains some supporting tools and experiments for managing
Surveyor-related data.

## `compile-survey`

Compiles YAML survey definitions and loads associated presets, fields, and
options.

```
./bin/compile-survey /path/to/survey.yaml
```

## `server`

A server for importing data into the app during development.

Usage:

```
./bin/server /path/to/example/data.xml
```

The server listens at http://127.0.0.1:3000
