## Firefox specific stuff

- `host_permissions` are optional so we have to be sure to request them.
- `chrome.storage.session.setAccessLevel` is not available so limiting options to the current session is disabled.

BUGS:
- content scripts are not registered on startup!!!

## Testing

To test the extension on Firefox on Android:

```shell
npm install -g web-ext

# Find your device ID and the apk ID:
adb devices
adb shell cmd package list packages | grep org.mozilla

cd firefox
web-ext run -t firefox-android --adb-device XXX --firefox-apk org.mozilla.firefox
```
