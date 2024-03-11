# About

This browser extension fixes various annoyances in the AWS Management Console.

It consists of a collection of scripts that can be enabled and configured by the user. By default the extension does nothing, all of the functionality has to be opted in.


# Development

## Bootstrap

To build the custom Bootstrap files you need to have Node.js installed and run:

```shell
cd bootstrap
npm install
npm run build
```

This will generate and copy files to `chrome/bootstrap/`.

## Build

```shell
npm install
npm run build
```

## Firefox

The `chrome/` directory contains most of the extension files, and `firefox/` only has the Firefox-specific files.

To load the extension in Firefox, run `npm run build` and then load `firefox/manifest.json` in Firefox.
