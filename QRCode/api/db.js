/* eslint-disable prettier/prettier */
// connecting to mongodb
// we need two functions one
const {MongoClient} = require('mongodb');
let dbConnetion;
module.exports = {
  //instablish a connecting
  connectToDb: cb => {
    //cb is used after the connetions is istablshed (callback)
    MongoClient.connect('mongodb://localhost:27017/Issuetracker')
      .then(client => {
        dbConnetion = client.db();
        return cb();
      })
      .catch(err => {
        console.log(err);
        return cb(err);
      });
  },

  //return the connection to the database in this
  getDb: () => dbConnetion,
};
