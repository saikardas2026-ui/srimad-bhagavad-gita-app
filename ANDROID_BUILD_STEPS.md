# Android Build Steps — শ্রীমদ্ভগবদ্গীতা App

## Prerequisites (on your local machine)
- Node.js 18+, pnpm
- Android Studio (with Android SDK, Java 17+)
- `JAVA_HOME` and `ANDROID_HOME` set in your environment

## Step 1 — Clone & install
```bash
git clone <repo-url>
cd <repo>
pnpm install
```

## Step 2 — Build the web app
```bash
cd artifacts/gita-app
pnpm run build
```
This outputs to `artifacts/gita-app/dist/public/`

## Step 3 — Add Android platform
```bash
npx cap add android
npx cap sync
```

## Step 4 — Add AdMob App ID to AndroidManifest.xml
Open: `android/app/src/main/AndroidManifest.xml`

Add inside the `<application>` tag:
```xml
<meta-data
    android:name="com.google.android.gms.ads.APPLICATION_ID"
    android:value="ca-app-pub-3317914166369405~8758868553" />
```

Also add permissions before `<application>`:
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

## Step 5 — Add AdMob Gradle dependency
In `android/app/build.gradle`, add to `dependencies {}`:
```gradle
implementation 'com.google.android.gms:play-services-ads:23.3.0'
```

## Step 6 — Open in Android Studio & build APK
```bash
npx cap open android
```
Then in Android Studio: Build > Generate Signed Bundle/APK

## AdMob Credentials
- App ID: `ca-app-pub-3317914166369405~8758868553`
- Banner Ad Unit ID: `ca-app-pub-3317914166369405/3036072507`

## Notes
- The web preview on Replit shows a placeholder banner bar (the real AdMob banner
  only renders in the native Android build via Capacitor).
- `src/admob.ts` checks `Capacitor.isNativePlatform()` — on web it silently skips
  all AdMob calls so the web preview is never broken.
