# Video Editor Android

A React Native Android video editor app using [@zlucksolutions/react-native-video-editor](https://github.com/zlucksolutions/react-native-video-editor).

## Features
- Select a video or photo from the device
- Open the native editor
- Trim, crop, add background music, text overlays and voice-over
- Build a debug APK with GitHub Actions

## Build an APK
1. Open the **Actions** tab in this repository.
2. Select **Build Android APK**.
3. Click **Run workflow** on the `android-app` branch.
4. Open the completed workflow run and download the `video-editor-android-debug-apk` artifact.

The first Android build generates the native Android project from Expo config. The APK is a debug build for testing, not a Play Store release.

## Local development
```bash
npm install
npx expo prebuild --platform android
npx expo run:android
```

The native editor host is mounted once at the application root, as required by the SDK.
