/* eslint-disable prettier/prettier */
const express = require('express');
const {connectToDb, getDb} = require('./db');
const cors = require('cors');
//init app and middleware

const app = express();

let db;

//function to generarte a qr code buffer:
const qr = require('qrcode');

async function generateQRCode(data){
  try {
    return await qr.toDataURL(data,{ errorCorrectionLevel: 'M' });
  } catch (err){
    console.error('error generating qr code:',err);
    throw err;
  }
}


//db connection
connectToDb(err => {
  //callback function came from cb
  if (!err) {
    app.listen(3000, () => {
      console.log('app listening on port 3000');
    }); //now we only listen after a connection has been istablished
    db = getDb();
  }
});

app.use(express.json()); //this middleware to parse JSON requests


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

app.get('/verify-qrcode',async (req, res)=>{
  try {
    const data = req.query;
    const qrCodeExists = await db.collection('qrcodes').findOne({image:data});
    if (qrCodeExists){
      res.status(200).json({message:'QR code is in database',qrCodeData:qrCodeExists});
    } else {
      res.status(404).json({error:'QR code not found in database'});
    }
  }
  catch (err){
    console.error('error verifying QR code:',err);
    res.status(500).json({error:'an error has occured while checking for qr code'});
  }
});

app.post('/generate-qrcode', async (req, res) => {
  try {
    const {data} = req.body;
    const qrCodeImage = await generateQRCode(data);

    // convert the image data to Base64
    //const base64Image = qrCodeImage.toString('base64');

    // save the Base64 image data to MongoDB
    const result = await db.collection('qrcodes').insertOne({image: qrCodeImage});
    console.log('QR code image saved to MongoDB:', result.insertedId);

    res.status(200).json({dataURL:qrCodeImage});
  } catch (error) {
    console.error('Error saving QR code image to MongoDB:', error);
    res.status(500).json({error: 'Could not save QR code image'});
  }
});

app.use(cors());
