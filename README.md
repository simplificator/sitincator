# Sitincator

![Sitincator](https://github.com/simplificator/sitincator/raw/gh-pages/images/sitincator.png)

`Sitincator` is [Simplificator's](https://www.simplificator.com) meeting room display system. It consists of a React/Electron app running on a Raspberry Pi 3, which is connected to a touch screen display.

The system shows the current occupancy of the meeting room on the display, all meetings of the current day and allows to make a reservation for 15 or 30 minutes. Sitincator reads the meeting information from Google Calendar (once every minute).

## Hardware

Required components for the displays:

- Original Raspberry Pi touch screen 7”, https://www.pi-shop.ch/raspberry-pi-7-touch-screen-display-mit-10-finger-capacitive-touch
- Raspberry Pi 3, https://www.pi-shop.ch/raspberry-pi-3
- Display case for the Raspberry Pi and its touchscreen, https://www.pi-shop.ch/raspberry-pi-7-touchscreen-display-frame-noir

## Software

### Installation on the Raspberry Pi

To install the binary:

    curl -ssL https://github.com/simplificator/sitincator/raw/master/scripts/automatic_updates.sh | bash

#### Configuration

- Follow [Google's guide][1] to obtain the OAuth JSON file and store it in `config/client_secret.json`.
- Start the application: `/home/pi/Sitincator/Sitincator`
- You are asked to enter the calendar ID (the calendar ID can be found on the settings page of your calendar in Google Calendar)
- Open the link printed in your terminal, login with the same user as before to obtain the OAuth JSON file and authorize the app to access Google's API. You now get a token in the browser. Enter that token in the terminal's prompt.
- If your Raspberry Pi is not already in portrait mode, append the following to your `/boot/config.txt`: `display_rotate=1 90 degrees`

#### Start the Application

Run the following in a terminal:

    /home/pi/Sitincator/Sitincator

### Development Setup

It is not recommended to run the following setup on a Raspberry Pi. The installation of the correct node version and the required npm packages is quite a burden for the Raspberry Pi and takes a long time to complete, if successful. The setup has been tested on recent versions of OS X.

Node requirement: `v6`

    git clone git://github.com/simplificator/sitincator.git
    cd sitincator
    npm install

- Follow the instructions above (`Installation on the Raspberry Pi -> Configuration`). Before starting the application, start webpack (note that this process is blocking, you could also start it in the background): `npm run watch`
- During development, start the application by calling `npm start`

#### Local Production Environment

To start the application in production environment on your development machine:

    npm run build
    npm run start-prod

#### Building the Package for the Raspberry Pi

It is recommended to build the package for the Raspberry Pi on an x86 machine:

    scripts/pack_pi.sh

The package for the Raspberry Pi now resides in `/tmp/sitincator/Sitincator-linux-armv7l`. You can launch the app by copying the directory to your Raspberry Pi 3 and calling `./Sitincator-linux-armv7l/Sitincator`.

Note that you need to configure `config` and `credentials` as outlined in `Configuration`.

[1]: https://developers.google.com/google-apps/calendar/quickstart/nodejs#step_1_turn_on_the_api_name

