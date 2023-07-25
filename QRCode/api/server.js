/* eslint-disable prettier/prettier */
const express = require('express');
const bodyParser = require('body-parser');
const {v4: uuidv4} = require('uuid');
//const {connectToDb, getDb} = require('./db');
const {MongoClient} = require('mongodb');
const cors = require('cors');
//init app and middleware

const app = express();

//middleware
app.use(bodyParser.json());

//connect to database
let db;
const PORT = 3000;

const MONGO_URL = 'mongodb://localhost:27017';
const DB_NAME = 'Issuetracker';
const COLLECTION_NAME = 'qrcodes';

MongoClient.connect(MONGO_URL, {useUnifiedTopology: true})
  .then(client => {
    console.error('Error connecting to MongoDB:');
    db = client.db(DB_NAME);
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('error connecting to MongDb:', err);
  });

app.get('/qrCodes', (req, res) => {
  let codes = [];
  db.collection('qrcodes')
    .find()
    .forEach(element => codes.push(element))
    .then(() => {
      res.status(200).json(codes);
    })
    .catch(() => {
      res.status(500).json({error: 'could not fetch documents'});
    });
});

app.post('/verify-qrcode', async (req, res) => {
  const {data} = req.body;
  console.log('Received QR code data on server:', data);
  let qrOffer = false;
  try {
    const code = await db.collection(COLLECTION_NAME).findOne({_id: data}); //find the qr code
    console.log('Database query result:', code);

    if (code) {
      const qrDate = code.timestamp;
      const currentDate = new Date();
      const timeDifference = currentDate.getTime() - new Date(qrDate);
      const secondsDifference = timeDifference / 1000;
      let user = await db.collection('users').findOne({name: 'anthony'}); //find the user

      if (code.type === 'seller') {
        qrOffer = true;
      } else {
        await db.collection(COLLECTION_NAME).deleteOne({_id: data}); //remove if one time deal
        await db
          .collection('users')
          .updateOne({name: user.name}, {$inc: {points: 10}});
        res.json({isValid: true, qrCodeData: code.data});
      }
      if (qrOffer === true) {
        if (secondsDifference <= 1000) { //offer time
          if (user) {
            console.log('user name', user);
            console.log('the id before checking if it is scanned', code._id);
            if (!user.scanned.includes(code._id)) {
              await db
                .collection('users')
                .updateOne({name: user.name}, {$inc: {points: 10}});

              if (user.points >= 10) {
                await db.collection('users').updateOne(
                  {name: user.name},
                  {
                    $inc: {points: -10},
                    $push: {scanned: code._id},
                  },
                );
              } else {
                console.log('no points');
              }

              res.json({isValid: true, qrCodeData: code.data});
            } else {
              res.json({isValid: false, qrCodeData: code.data});
              console.log('qr code already scanned');
            }
          }
        } else {
          console.log('ma laha2et halak');
          res.json({isValid: false, qrCodeData: code.data});
        }
      }
    } else {
      res.json({isValid: false});
    }
  } catch (err) {
    console.error('Error validating QR code in MongoDB:', err);
    res.status(500).json({error: 'Failed to validate QR code'});
  }
});

app.post('/generate-qrcode', async (req, res) => {
  try {
    const {data} = req.body;
    const {qrtype} = req.body;

    const qrCode = `QR_${uuidv4()}`;

    const qrCodeData = {
      _id: qrCode,
      data,
      timestamp: new Date(),
      type: qrtype,
    };

    const result = await db.collection(COLLECTION_NAME).insertOne(qrCodeData);
    console.log('QR code image saved to MongoDB:', result.insertedId);

    res.json({qrCode});
  } catch (error) {
    console.error('Error saving QR code image to MongoDB:', error);
    res.json({error: 'Could not save QR code image'});
  }
});

app.use(cors());
