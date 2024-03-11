## Firefox specific stuff

- `host_permissions` are not granted automatically so we have to be sure to request them.
- `chrome.storage.session.setAccessLevel` is not available so limiting options to the current session is disabled.
- Clicking links in the popup does not automatically close the popup, so call `window.close()` when appropriate.

## Testing

To test the extension on Firefox on Android:

```shell
npm install -g web-ext

# Find your device ID and the apk ID:
adb devices
adb shell cmd package list packages | grep org.mozilla

npm run build
cd firefox
web-ext run -t firefox-android --adb-device XXX --firefox-apk org.mozilla.firefox
```
