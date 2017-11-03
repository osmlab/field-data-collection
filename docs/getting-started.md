# Getting started using Observe

The Observe project consists of two applications:

- a **[mobile app](https://github.com/osmlab/field-data-collection)** for collecting data in the field
- a **[desktop app](https://github.com/osmlab/field-data-coordinator)** for defining surveys and areas of interest, and for aggregating the data collected by mobile apps

## Install

Install the apps by downloading the latest release for each from their GitHub repositories.

- [mobile app](https://github.com/osmlab/field-data-collection/releases/latest)
- [desktop app](https://github.com/osmlab/field-data-coordinator/releases/latest)

### Building the apps from source

To build the apps from source follow the instructions found in their respective GitHub repositories:

- [mobile app](https://github.com/osmlab/field-data-collection/blob/master/docs/install-macos.md)
- [desktop app](https://github.com/osmlab/field-data-coordinator)

## Getting started with the desktop app

- Open the desktop app
- Go to surveys tab
- Import a survey
- Define a geographical area
- Leave the desktop app running so it can sync data with phones that have the mobile app. Make sure your computer is on the same network that phones will be using.

## Getting started with the mobile app

- Open the mobile app
- Press the menu button in the top right
- Press the "Surveys" menu item
- Press "Add new surveys"

## Syncing data between desktop and mobile

To sync data between the desktop and mobile apps we'll make sure the desktop app is running, then do the rest of the steps on the phone.

- Make sure that the phone with the mobile app and the computer with the desktop app are on the same network
- Make sure the desktop app is running
- Open the mobile app
- Press the menu button in the top right
- Press the "My Observations" menu item

## Exporting data from the desktop app

- go to the "Data" tab in the desktop app
- click the "Export" button

The exported data can then be imported into other tools for processing. We can use JOSM, for example, to import data into Open Street Map.

## Creating a survey

A survey is a collection of iD presets and a yaml file that defines survey properties.

See [examples](https://github.com/osmlab/field-data-collection/tree/master/data/surveys) and [docs](https://github.com/osmlab/field-data-collection/tree/master/docs) in the mobile app GitHub repository.
