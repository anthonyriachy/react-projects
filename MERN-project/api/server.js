/* eslint-disable linebreak-style */
/* eslint-disable func-names */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
// const { issuesDB } = require("../fakeData/data");

const fs = require('fs'); // it used then to read the file
require('dotenv').config();
const express = require('express');
const GraphQLDate = require('./graphql_date.js');
const about = require('./about.js');
const { connectToDb } = require('./db.js');
const { installHandler } = require('./api_handler.js');

const port = process.env.API_SERVER_PORT || 3000;


const app = express();

installHandler(app);

(async function () { // to listen on pory async
  try {
    await connectToDb();
    app.listen(port, () => {
      console.log(`API server listening of port ${port}`);
    });
  } catch (err) {
    console.log('ERROR', err);
  }
}());
