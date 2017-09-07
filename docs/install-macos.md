# Installation – MacOS

## Initial set up

### Install yarn (if not already installed)

```
brew upgrade
brew install yarn
```

### Install watchman

Install `watchman` using [homebrew](https://brew.sh/).

```
brew install watchman
```

Install react-native-cli

```
yarn global add react-native-cli
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

Install [Android Studio](https://developer.android.com/studio/index.html).

Set `ANDROID_HOME` and update your `PATH` (this can/should be done in appropriate .dotfiles):

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/tools/bin:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

Install additional packages (this can also be done from the SDK Manager GUI):

```bash
sdkmanager "platforms;android-23"
sdkmanager "build-tools;23.0.1"

# for react-native-localization
sdkmanager "build-tools;25.0.0"
```

### Run the project in a simulator

Create and run a virtual device in Android Studio:
https://developer.android.com/studio/run/managing-avds.html If you don't already have an Android
project, you'll need to create one in order to access the AVD Manager GUI.

If the emulator starts and quits before showing a phone and you're running Docker, quit Docker (it's
hogging the CPU virtualization feature that allows AVDs to be speedy).

You may also be able to create appropriate AVDs from the command line using something similar to:

```bash
# TODO create something that matches:
# Available Android Virtual Devices:
#     Name: Nexus_5X_API_22
#   Device: Nexus 5X (Google)
#     Path: /Users/seth/.android/avd/Nexus_5X_API_22.avd
#   Target:
#           Based on: Android 5.1 (Lollipop) Tag/ABI: default/x86_64
#     Skin: nexus_5x
#   Sdcard: 100M
avdmanager create avd -n Surveyor -k "system-images;android-22;default;x86_64"
```

To start the emulator from the command line (it probably won't work), run:

```bash
# TODO this probably won't work, due to
# https://stackoverflow.com/questions/42554337/cannot-launch-avd-in-emulatorqt-library-not-found
emulator -avd Surveyor
```

With a running virtual device, run the following to start the app and see logs:

```
yarn run android
```

The above script runs both `react-native run-android` to build the APK and put it on the running virtual device and to tail the logs using `react-native log-android`.

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
$ adb reverse tcp:8081 tcp:8081
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
