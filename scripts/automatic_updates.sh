#!/bin/bash

rm /tmp/Sitincator-linux-armv7l.zip
wget -P /tmp `curl -s https://api.github.com/repos/simplificator/sitincator/releases | grep browser_download_url | head -n 1 | cut -d '"' -f 4`

rm -rf /tmp/Sitincator-linux-armv7l
cd /tmp
unzip /tmp/Sitincator-linux-armv7l.zip

killall Sitincator
cp -R /tmp/Sitincator-linux-armv7l/* /home/pi/Sitincator/
/home/pi/Sitincator/Sitincator
