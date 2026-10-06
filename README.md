# KidView

A kids' app for Android and iPhone: parent-approved videos and songs that play offline, coloring pages for ages 2 to 10, games (checkers, tic tac toe, Word Tiles, Town Tycoon, word search, crossword), kid profiles, learning questions before videos, and a parent PIN screen lock.

The app itself is the web app in `www/`, packaged as native apps with [Capacitor](https://capacitorjs.com).

## Android

Every push to `main` builds the app on GitHub. Download `KidView.apk` from the **latest** release on the repo's Releases page, open it on the phone, and allow installing from your browser when Android asks.

On Android, turning on Screen lock in the Grown-ups area pins KidView (Android's lock task mode), so Home, Recents and notifications can't take a child out. Android asks once to confirm pinning. The native code is `android/app/src/main/java/com/superduty335/kidview/KidLockPlugin.java`.

To build locally instead: install Android Studio, then `npm install` and `npm run android`.

## iPhone and iPad

iOS apps must be built on a Mac with Xcode: `npm install`, then `npm run ios`, pick your iPhone and press Run. Installing on your own phone works with a free Apple ID; the App Store needs an Apple Developer account. On iPhone, use Guided Access for a full lock (steps are in the app).

## Changing the app

Edit the files in `www/` (or edit the web copy and run `scripts/copy-web.sh <folder>`), then `npx cap sync`.

## Publishing to the stores

Google Play and the App Store need a signed release build, store listings, and a privacy policy. Apps for children also have to meet Google Play's Families policy and Apple's Kids Category rules.
