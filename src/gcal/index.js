const fs = require('fs');
const path = require('path');
const rl = require('readline');
const google = require('googleapis');
const googleAuth = require('google-auth-library');

const CREDENTIALS_DIR = path.resolve(__dirname, '../../credentials');
const API_TOKEN = path.resolve(CREDENTIALS_DIR, 'token.json');
const SITINCATOR_TOKEN = path.resolve(CREDENTIALS_DIR, 'sitincator.json');

function readCredentials() {
  return new Promise((resolve, reject) => {
    fs.readFile('config/client_secret.json', (err, content) => {
      if (err) {
        reject(err);
      }
      resolve(JSON.parse(content));
    });
  });
}

function oauth2TokenInstructions(oauth2Client) {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar'],
  });

  console.log('Authorize this app by visiting this url: ', authUrl);
  console.log("\nStore the API Token in `credentials/token.json`");
}

function storeToken(token) {
  try {
    fs.mkdirSync(CREDENTIALS_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(SITINCATOR_TOKEN, JSON.stringify(token));
}

function readOauth2Token(oauth2Client) {
  return new Promise((resolve, reject) => {
    fs.readFile(SITINCATOR_TOKEN, (err, token) => {
      if (err) {
        fs.readFile(API_TOKEN, (err, code) => {
          if (err) {
            return reject(oauth2TokenInstructions(oauth2Client));
          }
          oauth2Client.getToken(JSON.parse(code), (err, token) => {
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

module.exports = class GCal {
  constructor() {

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
        return oauth2Client;
      });
    });
  }
}
