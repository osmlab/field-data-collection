# Installation – MacOS

## Initial set up

### Install react-native-cli and yarn (if not already installed)

```
npm install -g react-native-cli yarn
```

### Clone the repo

```
git clone https://github.com/osmlab/field-data-collection.git
```

### Change directory into the repo

```
cd field-data-collection
```

### Install dependencies

```
yarn
```

## Android

Install Android Studio.

[Follow the react-native getting started guide for
Android.](http://facebook.github.io/react-native/docs/getting-started.html)

Install additional packages (this can also be done from the GUI):

```bash
# for react-native-localization
sdkmanager "build-tools;25.0.0"
```

### Run the project in a simulator

Create and run a virtual device in android studio: https://developer.android.com/studio/run/managing-avds.html

```
react-native run-android
```

Access logs:

```
react-native log-android
```

### Run the project on a real device

Enable USB debugging, plug in, and check that `adb` can see the device:

```bash
$ adb devices
List of devices attached
0123456789ABCDEF	device
```

Build the app; the resulting APK should automatically be copied to the device:

```bash
$ react-native run-android
```

(Newer versions of `react-native` allow specific devices to be targeted using `--deviceId 0123456789ABCDEF`.)

If it fails to install the app on the device, the APK can be copied manually:

```bash
$ adb install android/app/build/outputs/apk/app-debug.apk
```

Access logs:

```bash
$ react-native log-android
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
