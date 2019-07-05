#!/bin/sh
# Script to build a release package to upload to Github

GIT_DIR=$(pwd)
cd /tmp
rm -rf sitincator
# rm -rf sitincator
git clone $GIT_DIR
cd sitincator

NODE_ENV=development npm install
NODE_ENV=production node_modules/.bin/webpack -p --config webpack.prod.config.js
# rm -rf node_modules

# NODE_ENV=production npm install
rm -rf Sitincator-linux-armv7l
npm run pack:pi
rm Sitincator-linux-armv7l/resources/app/{config,credentials}/*
zip -yr Sitincator-linux-armv7l.zip Sitincator-linux-armv7l/*
