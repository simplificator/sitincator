const { app, BrowserWindow, ipcMain } = require("electron");

const gcal = require("./src/gcal");
const fs = require("fs");
const readline = require("readline");
const path = require("path");

const CONFIG_DIR = path.resolve(__dirname, "./config");
const SITINCATOR_CONFIG = path.resolve(CONFIG_DIR, "sitincator.json");

global.calendarName = "";

const main = () => {
  let win;

  const createWindow = () => {
    win = new BrowserWindow({ width: 480, height: 800 });

    if (process.env.NODE_ENV !== "development") win.setFullScreen(true);

    if (process.env.NODE_ENV === "development") win.webContents.openDevTools();

    win.loadURL(`file://${__dirname}/index.html`);

    win.on("closed", () => {
      // Dereference the window object
      win = null;
    });
  };

  app.on("ready", () => {
    readConfiguration()
      .then(configuration => {
        const gcalApi = new gcal.GCal(
          configuration.calendar_id,
          configuration.room_id
        );

        gcalApi
          .authorize()
          .then(client => {
            createWindow();

            global.calendarName = configuration.title;

            ipcMain.on("calendar:list-events", event =>
              client
                .listEvents()
                .then(items =>
                  event.sender.send("calendar:list-events-success", items)
                )
                .catch(error =>
                  event.sender.send("calendar:list-events-failure", error)
                )
            );

            ipcMain.on("calendar:status-event", event =>
              client
                .statusEvent()
                .then(item =>
                  event.sender.send("calendar:status-event-success", item)
                )
                .catch(error =>
                  event.sender.send("calendar:status-event-failure", error)
                )
            );

            ipcMain.on("calendar:quick-reservation", (event, duration) => {
              client
                .insertEvent(duration)
                .then(response =>
                  event.sender.send(
                    "calendar:quick-reservation-success",
                    response
                  )
                )
                .catch(error =>
                  event.sender.send("calendar:quick-reservation-failure", error)
                );
            });

            ipcMain.on("calendar:finish-reservation", (event, eventId) => {
              client
                .finishEvent(eventId)
                .then(response =>
                  event.sender.send(
                    "calendar:finish-reservation-success",
                    response
                  )
                )
                .catch(error =>
                  event.sender.send(
                    "calendar:finish-reservation-failure",
                    error
                  )
                );
            });
          })
          .catch(() => process.exit());
      })
      .catch(error => {
        console.log(error);
        process.exit();
      });
  });

  // Quit when all windows are closed.
  app.on("window-all-closed", () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });
};

const readConfiguration = () => {
  return readConfigurationFile().catch(error => {
    if (error.code != "ENOENT") {
      return Promise.reject(error);
    } else {
      // TODO: this seems like a bad approach, just having an editable config file seems simpler..
      return askForUserInput(
        "Enter the calendar ID (found on the settings page of your calendar in Google Calendar): "
      ).then(calendar_id => {
        return askForUserInput("Enter room ID:").then(room_id => {
          return writeConfiguration({ room_id, calendar_id });
        });
      });
    }
  });
};

const readConfigurationFile = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(SITINCATOR_CONFIG, (error, content) => {
      if (error) reject(error);
      else resolve(JSON.parse(content));
    });
  });
};

const askForUserInput = question => {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question(question, answer => {
      resolve(answer);
    });
  });
};

const writeConfiguration = ({ calendar_id, room_id }) => {
  return new Promise((resolve, reject) => {
    let configuration = { calendar_id, room_id, title: "" };

    fs.writeFile(SITINCATOR_CONFIG, JSON.stringify(configuration), error => {
      if (error) reject(error);
      else resolve(configuration);
    });
  });
};

main();
