#!/usr/bin/env zx

import 'zx/globals';

import fs from 'node:fs/promises';

try {
  await fs.stat('chrome/bootstrap/bootstrap.min.css');
} catch (err) {
  if (err.code === 'ENOENT') {
    console.error(
      'Error: The bootstrap files are missing. Please follow the instructions in README.md.',
    );
  } else {
    throw err;
  }
  process.exit(1);
}

/** @type {import('type-fest').PackageJson} */
const pkg = JSON.parse(await fs.readFile('package.json'));
console.log('version', pkg.version);
await fs.mkdir('dist', { recursive: true });

/** @return {chrome.runtime.ManifestV3} */
async function loadManifest(path) {
  /** @type {chrome.runtime.ManifestV3} */
  const manifest = JSON.parse(await fs.readFile(path));
  if (manifest.version !== pkg.version) {
    console.warn(`Warning: version mismatch in ${path}: ${manifest.version}`);
    await sleep(1000);
  }
  return manifest;
}

const zipArgs = [
  '-x',
  '*.git*',
  '-x',
  '*.DS_Store',
  '-x',
  '*Thumbs.db',
  '-x',
  '*.map',
  '-x',
  '*bootstrap.esm.bundle.js',
  '-x',
  '*.md',
];

// Build for Chrome
{
  const manifest = await loadManifest('chrome/manifest.json');
  const outputPath = `dist/aws-console-fixes-${manifest.version}.zip`;
  await fs.rm(outputPath, { force: true });
  cd('chrome');
  await $`zip -r ../${outputPath} . ${zipArgs}`;
  cd('..');
}

// Build for Firefox
{
  const manifest = await loadManifest('firefox/manifest.json');
  // Copy files from chrome/
  await $`cp -r chrome/{bootstrap,img,options,scripts,*.html,*.js} firefox`;
  const outputPath = `dist/aws-console-fixes-${manifest.version}.xpi`;
  await fs.rm(outputPath, { force: true });
  cd('firefox');
  await $`zip -r ../${outputPath} . ${zipArgs}`;
  cd('..');
}

// Print a diff between the Chrome and Firefox manifest files
await $`diff --color=always chrome/manifest.json firefox/manifest.json || exit 0`;
