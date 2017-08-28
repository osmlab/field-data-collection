# Building APKs

## Building debug APKS with bundled JavaScript

### Bundle the js

> Make sure you're in the root directory of the project before running the above command

```
react-native bundle --dev true --platform android --entry-file index.android.js --bundle-output ./android/app/build/intermediates/assets/debug/index.android.bundle --assets-dest ./android/app/build/intermediates/res/merged/debug
```

### Create the debug APK

```
cd android && ./gradlew assembleDebug
```

### Install the APK on a device/emulator

```
adb install app/build/outputs/apk/app-debug.apk
```

> The above assumes you're still in the `android` directory after completing the build. If you're in the root directory of the project, use `android/app/build/outputs/apk/app-debug.apk` as the path to the APK.

Based on this: https://stackoverflow.com/questions/35283959/build-and-install-unsigned-apk-on-device-without-the-development-server

## Building APKs for release

See these react-native docs: https://facebook.github.io/react-native/docs/signed-apk-android.html

Short version:

Create a key

```
keytool -genkey -v -keystore observe.keystore -alias observe -keyalg RSA -keysize 2048 -validity 10000
```
