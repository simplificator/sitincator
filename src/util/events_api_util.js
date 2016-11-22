import { ipcRenderer } from 'electron';

export const fetchEvents = success => {
  new Promise((resolve, reject) => {
    ipcRenderer.send('calendar:list-events');
    ipcRenderer.on('calendar:list-events-success', (event, events) => {
      resolve(events)
    });
    ipcRenderer.on('calendar:list-events-failure', (event, error) => {
      reject("error");
    });
  }).then(success);
}
