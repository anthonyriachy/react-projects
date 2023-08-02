/* eslint-disable prettier/prettier */
const express = require('express');
const bodyParser = require('body-parser');
const {v4: uuidv4} = require('uuid');
<<<<<<< HEAD

const {MongoClient, Int32} = require('mongodb');
=======
const {MongoClient} = require('mongodb');
>>>>>>> 1d71e2d175be295adb56b714be5891419903f047
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
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



//new users
app.post('/signUp',async(req,res)=>{
  try {
    const {email,password} = req.body;
    const existingUser = await db.collection('users').findOne({email});
    if (existingUser){
      return res.status(400).json({message:'Email already registered'});
    }
    const salt = await bcrypt.genSalt(10);//to add complexity to the hashing proccess (it will do it 10 times)
    const hashedPassword = await bcrypt.hash(password,salt);
    const newUser = {email,password:hashedPassword};
    await db.collection('users').insertOne(newUser);
    res.status(201).json({message:'User register successfully'});
  } catch (error){
    res.status(500).json({message:'Failed to register user'});
  }
});

app.post('/signIn',async(req,res)=>{
  try {
    const {email,password} = req.body; 
    const user = await db.collection('users').findOne({email});
    if (!user){
    return res.status(401).json({message:'Invalid email address'});
    }
    console.log('user password',user.password);
    if (!user.password) {
      return res.status(401).json({ message: 'User password not found' });
    }

    //compare the password to the hashed password
    const isPasswordValid = await bcrypt.compare(password,user.password);
    if (!isPasswordValid){
      return res.status(401).json({message:'invalid password'});
    }
    const token = jwt.sign({ email: user.email }, 'your-secret-key');
    res.json({ message: 'Login successful', token });
  } catch (err){
    console.log('failed to log in ',err);
  }
});


app.get('/qrCodes', (req, res) => {
  let codes = [];
  db.collection('qrcodes')
    .find({isDeleted:false})
    .forEach(element => codes.push(element))
    .then(() => {
      res.status(200).json(codes);
    })
    .catch(() => {
      res.status(500).json({error: 'could not fetch documents'});
    });
});

app.post('/validate-qrcode', async (req, res) => {
  const {data} = req.body;
  console.log('Received QR code data on server:', data);

  try {
    const code = await db.collection(COLLECTION_NAME).findOne({_id: data,isDeleted:false}); //find the qr codejl
    console.log('Database query result:', code);

    if (code) {
      const qrDate = code.timestamp;
      const currentDate = new Date();
      const timeDifference = currentDate.getTime() - new Date(qrDate);
      const secondsDifference = timeDifference / 1000;
      let user = await db
        .collection('users')
        .findOne({name: 'anthony'})
        .catch(err => console.log('error while finding the user', err)); //find the user

      if (code.type === 'offer') {  //if qr code for a seller then it is an offer
        console.log('owner is(offer)',code.owner);
        if (secondsDifference <= 1000) {//offer time
          console.log('user name', user);
          console.log('the id before checking if it is scanned', code._id);
            await db
              .collection(COLLECTION_NAME)
              .updateOne({_id: data}, {$inc: {numberOfScanned: 1 }});

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
          console.log('ma laha2et halak');
          res.json({isValid: false, qrCodeData: code.data});
        }


      } else if (code.type === 'deal'){
        console.log('owner is(deal)',code.owner);
        await db
          .collection(COLLECTION_NAME)
          .updateOne({_id: data}, {$set: {isDeleted:true}}); //remove if one time deal
        await db
          .collection('users')
          .updateOne({name: user.name}, {$inc: {points: 10}});

        await db.collection('users').updateOne({name:code.owner.toLowerCase()},{$inc:{points:1}});
        res.json({isValid: true, qrCodeData: code.data});

      } else {  // if the qr code is for a item
        console.log('owner is',code.owner.toLowerCase());
        await db
          .collection('users')
          .updateOne({name: user.name}, {$inc: {points: 10}});

        await db.collection('users').updateOne({name:code.owner.toLowerCase()},{$inc:{points:1}});
        
        await db
        .collection(COLLECTION_NAME)
        .updateOne({_id: data}, {$inc: {numberOfScanned:1}}); 
        res.json({isValid: true, qrCodeData: code.data});
      }
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
    const {user} = req.body;

    const qrCode = `QR_${uuidv4()}`;

    const qrCodeData = {
      _id: qrCode,
      data,
      timestamp: new Date(),
      type: qrtype,
<<<<<<< HEAD
      owner:user,
      numberOfScanned: 0,
=======
>>>>>>> 1d71e2d175be295adb56b714be5891419903f047
      isDeleted:false,
    };
    const item_exists = await db.collection(COLLECTION_NAME).findOne({data:data,type:qrtype,owner:user,isDeleted:false});
    if (item_exists){
      console.log('there is already this item for the shop');
    } else {
      const result = await db.collection(COLLECTION_NAME).insertOne(qrCodeData);
      console.log('QR code image saved to MongoDB:', result.insertedId);
    }

    res.json({qrCode});
  } catch (error) {
    console.error('Error saving QR code image to MongoDB:', error);
    res.json({error: 'Could not save QR code image'});
  }
});



app.post('/verify-code',async (req,res)=>{
  try {
    const {data} = req.body;
    const code = await db.collection(COLLECTION_NAME).updateOne({_id:data},{$set:{isDeleted:true,verify:true}});
    res.status(200).json({ message: 'Code verified successfully',code });

  } catch (error){
    console.log('error while verifying code:',error);
    res.status(500).json({ error: 'Failed to verify code' });

  }
});


app.use(cors());
