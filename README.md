# Sitincator

"Sitincator" is [Simplificator's](https://www.simplificator.com) meeting room display system. It consists of a React/Electron app running on a Raspberry Pi 3, which is connected to a touch screen display.

The system shows the current occupancy of the meeting room on the display, all meetings of the current day and allows to make a reservation for 15 or 30 minutes. Sitincator reads the meeting information from Google Calendar.

## Software

Clone the repository and build a package for the Raspberry Pi:

    git clone https://github.com/simplificator/sitincator.git
    npm install
    npm run build:pi

The package for the Raspberry Pi now resides in `./Sitincator-linux-armv7l`. You can launch the app by calling `./Sitincator-linux-armv7l/Sitincator`.

## Hardware

Required components for the displays:

- Original Raspberry Pi touch screen 7”, https://www.pi-shop.ch/raspberry-pi-7-touch-screen-display-mit-10-finger-capacitive-touch
- Raspberry Pi 3, https://www.pi-shop.ch/raspberry-pi-3
- Display case for the Raspberry Pi and its touchscreen, https://www.pi-shop.ch/raspberry-pi-7-touchscreen-display-frame-noir

## Development Setup

- Follow [Google's guide][1] to obtain the OAuth JSON file and store it in `config/client_secret.json`.
- Tell Sitincator which calendar to use: `export CALENDAR_ID='...'`
- Start it: `npm start`

[1]: https://developers.google.com/google-apps/calendar/quickstart/nodejs#step_1_turn_on_the_api_name
