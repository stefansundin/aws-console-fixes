#!/bin/bash -ex
V=$(cat chrome/manifest.json | grep '"version"' | grep -o "\d*\.\d*\.\d*")
rm -f "aws-console-fixes-$V.zip"
cd chrome
zip -r "../aws-console-fixes-$V.zip" . -x '*.git*' -x '*.DS_Store' -x '*Thumbs.db'
