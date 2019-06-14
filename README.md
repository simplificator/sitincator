# Sitincator

## Warning
**We are no longer actively maintaining this. You are welcome to fork the repository and contribute there.**


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
- To add a custom title to the screens (e.g. to identify a specific room this display is for), edit `sitincator.json` (created during the calendar ID setup) and modify the `title` entry.

#### Start the Application

Run the following in a terminal:

    /home/pi/Sitincator/Sitincator

### Development Environment Setup and Startup

It is not recommended to run the following setup on a Raspberry Pi. The installation of the correct node version and the required npm packages is quite a burden for the Raspberry Pi and takes a long time to complete, if successful. The setup has been tested on recent versions of OS X.

Node requirement: `v6`

    git clone git://github.com/simplificator/sitincator.git
    cd sitincator
    npm install

Follow the instructions above (`Installation on the Raspberry Pi -> Configuration`). 

Start webpack (note that this process is blocking, you could also start it in the background): 

    npm run watch

Start the application in development mode (windowed, with debugging information):

    npm start

#### Local Production Environment

To start the application in production environment on your development machine:

    npm run build
    npm run start-prod

#### Building the Package for the Raspberry Pi

It is recommended to build the package for the Raspberry Pi on an x86 machine:

    scripts/pack_pi.sh

The package for the Raspberry Pi now resides in `/tmp/sitincator/Sitincator-linux-armv7l`. You can launch the app by copying the directory to your Raspberry Pi 3 and calling `./Sitincator-linux-armv7l/Sitincator`.

Note that you need to configure `config` and `credentials` as outlined in `Configuration`.

### Configuration of the Raspberry Pi

Below you find some starting points to configure the Raspberry Pi for Sitincator.

Create a script `start_meeting_room_app` using the following command to start Sitincator and initialize the Raspberry Pi's touch screen to portrait format. It also prevents the display from going into sleep mode.

    cat > /home/pi/start_meeting_room_app << EOF
    DISPLAY=":0" xinput --set-prop 'FT5406 memory based driver' 'Coordinate Transformation Matrix'  0 1 0 -1 0 1 0 0 1

    DISPLAY=":0" xset s off
    DISPLAY=":0" xset -dpms
    DISPLAY=":0" xset s noblank
    
    cd /home/pi/Sitincator/
    DISPLAY=":0" /home/pi/Sitincator/Sitincator --disable-pinch
    EOF
    chmod +x /home/pi/start_meeting_room_app

To automatically start Sitincator when the Raspberry Pi boots, run the following command to add the script `start_meeting_room_app` to autostart:

    echo '@/home/pi/start_meeting_room_app' >> /home/pi/.config/lxsession/LXDE-pi/autostart

To save some power, add the following cronjobs to automatically turn the display on and off:

    # Cronjobs definition: crontab -e
    0 7    *   *   *   /home/pi/display_turn_on
    0 18   *   *   *   /home/pi/display_turn_off

    cat > /home/pi/display_turn_on << EOF
    DISPLAY=":0" xset dpms force on

    DISPLAY=":0" xset s off
    DISPLAY=":0" xset -dpms
    DISPLAY=":0" xset s noblank
    EOF
    chmod +x /home/pi/display_turn_on

    cat > /home/pi/display_turn_off << EOF
    DISPLAY=":0" xset dpms force off
    EOF
    chmod +x /home/pi/display_turn_off

[1]: https://developers.google.com/google-apps/calendar/quickstart/nodejs#step_1_turn_on_the_api_name

