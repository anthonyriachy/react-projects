/* eslint-disable prettier/prettier */
const express = require('express');
const bodyParser = require('body-parser');
const {v4:uuidv4} = require('uuid');
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


MongoClient.connect(MONGO_URL, { useUnifiedTopology: true })
.then((client=>{
    console.error('Error connecting to MongoDB:');
    db = client.db(DB_NAME);
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }
))
.catch((err)=>{
  console.error('error connecting to MongDb:',err);
});

//api end points
app.get('/issues', (req, res) => {
  let issues = [];
  db.collection('issues')
    .find() //returns a cursor
    .forEach(element => issues.push(element))
    .then(() => {
      res.status(200).json(issues);
    })
    .catch(() => {
      res.status(500).json({error: 'could not fetch documents'});
    });
});

app.post('/verify-qrcode', async (req, res) => {
  const { data } = req.body;
  console.log('Received QR code data on server:', data);
  try {
    const result = await db.collection(COLLECTION_NAME).findOne({ _id: data });
    console.log('Database query result:', result);
    if (result) {
      res.json({ isValid: true });
    } else {
      res.json({ isValid: false });
    }
  } catch (err) {
    console.error('Error validating QR code in MongoDB:', err);
    res.status(500).json({ error: 'Failed to validate QR code' });
  }
});


// app.post('/verify-qrcode',async (req, res)=>{
//   const { data } = req.body;
  //  console.log('Received QR code data on server:', {data});

//   db.collection(COLLECTION_NAME)
//     .findOne({ data })
//     .then((result) => {
//       if (result) {
//         res.json({ isValid: true });
//       } else {
//         res.json({ isValid: false });
//       }
//     })
//     .catch((err) => {
//       console.error('Error validating QR code in MongoDB:', err);
//       res.status(500).json({ error: 'Failed to validate QR code' });
//     });
// });


app.post('/generate-qrcode', async (req, res) => {
  try {
    const {data} = req.body;
    const qrCode = `QR_${uuidv4()}`;

    const qrCodeData = {_id: qrCode,data,timestamp: new Date()};

    const result = await db.collection(COLLECTION_NAME).insertOne(qrCodeData);
    console.log('QR code image saved to MongoDB:', result.insertedId);

    res.json({qrCode});
  } catch (error) {
    console.error('Error saving QR code image to MongoDB:', error);
    res.json({error: 'Could not save QR code image'});
  }
});

app.use(cors());
