"use strict";

const app = require("./app");

const admin = require('firebase-admin');

var serviceAccount = require('path/to/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://birthmusicchart.firebaseio.com',
});

// const PORT = require("./config");

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
