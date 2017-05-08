# Installation – MacOS

## Initial set up

### Install react-native-cli and yarn (if not already installed)

```
npm i -g react-native-cli yarn
```

### Clone the repo

```
git clone git@github.com:osmlab/field-data-collection.git
```

### Change directory into the repo

```
cd field-data-collection
```

### Install dependencies

```
yarn install
```

## Android

Install Android Studio.

### Follow the react-native getting started guide for android:

http://facebook.github.io/react-native/docs/getting-started.html

### Run the project in a simulator

Create and run a virtual device in android studio: https://developer.android.com/studio/run/managing-avds.html

```
react-native run-android
```

Access logs:

```
react-native log-android
```

## iOS

### Follow the manual install instructions for iOS

https://github.com/mapbox/react-native-mapbox-gl/blob/master/ios/install.md

### Run the project in a simulator

```
react-native run-ios
```

Access logs:

```
react-native log-ios
```
