#!/bin/bash -e
if [[ $(git status --porcelain chrome) != "" ]]; then
  echo "Working tree is dirty:"
  git status --porcelain chrome
  exit 1
fi
set -x
V=$(cat chrome/manifest.json | grep '"version"' | grep -o "\d*\.\d*\.\d*")
rm -f "aws-console-fixes-$V.zip"
cd chrome
zip -r "../aws-console-fixes-$V.zip" . -x '*.git*' -x '*.DS_Store' -x '*Thumbs.db'
