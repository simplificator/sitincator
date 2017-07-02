const fs = require('fs');
const path = require('path');
const readline = require('readline');

const google = require('googleapis');
const googleAuth = require('google-auth-library');
const Client = require('./client');

const CREDENTIALS_DIR = path.resolve(__dirname, '../../credentials');
const API_TOKEN = path.resolve(CREDENTIALS_DIR, 'token.json');
const SITINCATOR_TOKEN = path.resolve(CREDENTIALS_DIR, 'sitincator.json');

function readCredentials() {
  return new Promise((resolve, reject) => {
    fs.readFile('config/client_secret.json', (err, content) => {
      if (err)
        reject(err);
      else
        resolve(JSON.parse(content));
    });
  });
}

function oauth2TokenInstructions(oauth2Client) {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar'],
  });

  console.log('Authorize Sitincator to access your calendar by visiting this URL: ', authUrl);

  return new Promise((resolve, reject) => {
    return new Promise((resolve_question, reject_question) => {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      rl.question('Enter the obtained API token:', (answer) => {
        resolve_question(answer);
      });
    });
  }).then(token => {
    createDirectory(CREDENTIALS_DIR);
    fs.writeFile('credentials/token.json', token, error => {
      if(error)
        reject(error);
      else
        resolve();
    });
  });
}

function createDirectory(directory) {
  try {
    fs.mkdirSync(directory);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
}

function storeToken(token) {
  createDirectory(CREDENTIALS_DIR);
  fs.writeFile(SITINCATOR_TOKEN, JSON.stringify(token));
}

function readOauth2Token(oauth2Client) {
  return new Promise((resolve, reject) => {
    fs.readFile(SITINCATOR_TOKEN, (err, token) => {
      if (err) {
        fs.readFile(API_TOKEN, (err, code) => {
          if (err) {
            return oauth2TokenInstructions(oauth2Client);
          }
          oauth2Client.getToken(code, (err, token) => {
            if (err) {
              console.log('Error while trying to retrieve access token', err);
              return reject(err);
            }
            storeToken(token);
            resolve(token);
          });
        });
      } else {
        resolve(JSON.parse(token));
      }
    });
  });
}

let _calendarId;
exports.GCal = class GCal {
  constructor(calendarId) {
    _calendarId = calendarId;
  }

  authorize() {
    return readCredentials().then(credentials => {
      const clientSecret = credentials.installed.client_secret;
      const clientId = credentials.installed.client_id;
      const redirectUrl = credentials.installed.redirect_uris[0];
      const auth = new googleAuth();
      const oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
      return readOauth2Token(oauth2Client).then(token => {
        oauth2Client.credentials = token;
        return new Client(_calendarId, oauth2Client);
      });
    }).catch(function(error) {
      console.log(error);
      exit(1);
    });
  }
};
