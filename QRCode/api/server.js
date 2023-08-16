/* eslint-disable prettier/prettier */
const express = require('express');
const bodyParser = require('body-parser');
const {v4: uuidv4} = require('uuid');
const {MongoClient} = require('mongodb');
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

// db.countDocuments

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
app.post('/signUp', async (req, res) => {
  try {
    const {email, password} = req.body;
    const existingUser = await db.collection('users').findOne({email});
    if (existingUser) {
      return res.status(400).json({message: 'Email already registered'});
    }
    const salt = await bcrypt.genSalt(10); //to add complexity to the hashing proccess (it will do it 10 times)
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = {email, password: hashedPassword};
    await db.collection('users').insertOne(newUser);
    res.status(201).json({message: 'User register successfully'});
  } catch (error) {
    res.status(500).json({message: 'Failed to register user'});
  }
});

app.post('/signIn', async (req, res) => {
  try {
    const {email, password} = req.body;
    const user = await db.collection('users').findOne({email});
    if (!user) {
      return res.status(401).json({message: 'Invalid email address'});
    }
    console.log('user password', user.password);
    if (!user.password) {
      return res.status(401).json({message: 'User password not found'});
    }

    //compare the password to the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({message: 'invalid password'});
    }
    const token = jwt.sign({email: user.email}, 'your-secret-key');
    res.json({message: 'Login successful', token});
  } catch (err) {
    console.log('failed to log in ', err);
  }
});

app.post('/add-item', async (req, res) => {
  //continur this if not done!!!!!!!!!!!!!!!!!!!!!!!!!11
  try {
    const {item} = req.body;
    const {numberOfItems} = req.body;
    const {user} = req.body;
    const {price} = req.body;
    const {selectedDate} = req.body;
    const qrCode = `QR_${uuidv4()}`;
    let newItem;

    if (selectedDate !== undefined) {
      newItem = {
        item,
        price:parseInt(price, 10),
        qrCodeId: qrCode,
        timestamp: new Date(),
        owner: user,
        numberOfScanned: 0,
        available: parseInt(numberOfItems, 10),
        expiration: new Date(selectedDate),
        isDeleted: false,
      };
    } else {
      newItem = {
        item,
        price:parseInt(price, 10),
        qrCodeId: qrCode,
        timestamp: new Date(),
        owner: user,
        numberOfScanned: 0,
        available: parseInt(numberOfItems, 10),
        isDeleted: false,
      };
    }

    const item_exists = await db
      .collection('items')
      .findOne({owner: user, item, available: {$gt: 0}});
    console.log('item exists', item_exists);
    if (item_exists) {
      console.log('there is already this item for the shop');
      res.json({isValid: 'you already have that item'});
    } else {
      await db.collection('items').insertOne(newItem);
      res.json({isValid: true, qrCode});
    }
  } catch (error) {
    console.log('error adding items', error);
  }
});

app.post('/validate-user', async (req, res) => {
  try {
    const {user} = req.body;
    console.log('user received is ', user);
    const result = await db
      .collection('users')
      .findOne({name: user.toLowerCase()});
    console.log('user received from data base', result);
    if (!result) {
      res.json({isValid: false});
    } else {
      res.json({isValid: true, type: result.type});
    }
  } catch (error) {
    console.log('failed to verify:', error);
  }
});

app.post('/qrCodes', (req, res) => {
  let codes = [];
  const {user} = req.body;
  db.collection('items')
    .find({owner: user, isDeleted: false, available: {$gt: 0}})
    .forEach(element => codes.push(element))
    .then(() => {
      res.status(200).json(codes);
    })
    .catch(() => {
      res.status(500).json({error: 'could not fetch documents'});
    });
});

app.post('/validate-qrCode', async (req, res) => {
  try {
    const {data} = req.body;
    const userName = req.body.user;

    const result = await db
      .collection('items')
      .findOne({qrCodeId: data, isDeleted: false});
    if (result) {
      //item in database
      console.log('userName', userName);
      if (userName) {
        const user = await db.collection('users').findOne({name: userName.toLowerCase()});

        if (result.owner.toLowerCase() !== user.name.toLowerCase()) {
          //user scanning his own qr code
          if (result.available > 0) {
            //item available

            if (result.expiration) {
              //item has expiration date (offer)
              const qrDate = new Date(result.expiration).getTime();
              const currentDate = new Date().getTime();
              const timeDifference = qrDate - currentDate;

              if (qrDate >= currentDate) {
                //item has not expired
                if (user.points >= 10) {
                  //user has enough points?

                  //remove points because of the offer.

                  let pointToRemove=result.price //to be done later.

                  await db.collection('items').updateOne(
                    {qrCodeId: data, isDeleted: false},
                    {$inc: {available: -1, numberOfScanned: 1,qrCodeId:`QR_${uuidv4()}`}}, // remove 1 fron the item and add number of scanned
                  );

                  await db.collection('users').updateOne(
                    {name: userName.toLowerCase()},
                    {
                      $inc: {points: -10},
                      $push: {scanned: result._id},
                    },
                  );

                  await db
                    .collection('users')
                    .updateOne(
                      {name: result.owner.toLowerCase()},
                      {$inc: {points: 1}},
                    ); //add points for the shop owner

                  res.json({isvalid: true, qrCodeData: result.item});
                } else {
                  //user does not have enough points
                  res.json({
                    isValid: 'you dont have enough points',
                    qrCodeData: result.item,
                  });
                }
              } else {
                //item has expired
                // await db
                //   .collection('items')
                //   .updateOne(
                //     {qrCodeId: data, isDeleted: false},
                //     {isDeleted: true},
                //   );
                res.json({
                  isValid: 'the offer has ended',
                  qrCodeData: result.item,
                });
              }
            } else {
              //item does not have an expiration date.(not offer)
              await db
                .collection('items')
                .updateOne(
                  {qrCodeId: data, isDeleted: false},
                  {$inc: {available: -1, numberOfScanned: 1},qrCodeId:`QR_${uuidv4()}`}, //change the qr code maybe $set
                );

              let pointsToAdd = result.price / 3;
              pointsToAdd = parseFloat(pointsToAdd.toFixed(1));

              await db.collection('users').updateOne(
                {name: userName.toLowerCase()},
                {
                  $inc: {points: pointsToAdd},
                  $push: {scanned: result._id},
                },
              ); //add points for the user

              await db
              .collection('users')
              .updateOne(
                {name: result.owner.toLowerCase()},
                {$inc: {points: 1}},
              ); //add points for the shop owner

              res.json({isValid: true, qrCodeData: result.item});
            }
          } else {
            //no more item available
             res.json({
              isValid: 'there is no more items available',
              qrCodeData: result.item,
            });
            // await db
            //   .collection('items')
            //   .updateOne(
            //     {qrCodeId: data, isDeleted: false},
            //     {$set: {isDeleted: true}},
            //   );

          }
        } else {
          //scanning own qr code

          res.json({
            isValid: 'scanning a qr code you created is not allowed',
            qrCodeData: result.item,
          });
        }
      } else {
        res.json({isValid: 'not logged in',qrCodeData:data});
      }
    } else {
      res.json({isValid: 'item not in database', qrCodeData: data});
    }
  } catch (error) {
    console.log('error validatiig qr code: ', error);
  }
});

// app.post('/validate-qrcode', async (req, res) => {
//   const {data} = req.body;

//   console.log('Received QR code data on server:', data);

//   try {
//     const code = await db
//       .collection('items')
//       .findOne({qrCodeId: data, isDeleted: false}); //find the qr codejl
//     console.log('Database query result:', code);

//     if (code) {
//       const qrDate = code.timestamp;
//       const currentDate = new Date();
//       const timeDifference = currentDate.getTime() - new Date(qrDate);
//       const secondsDifference = timeDifference / 1000;
//       let user = await db
//         .collection('users')
//         .findOne({name: 'anthony'})
//         .catch(err => console.log('error while finding the user', err)); //find the user

//       if (code.type === 'offer') {
//         //if qr code for a seller then it is an offer
//         console.log('owner is(offer)', code.owner);
//         if (secondsDifference <= 1000) {
//           //offer time
//           console.log('user name', user);
//           console.log('the id before checking if it is scanned', code._id);
//           await db
//             .collection(COLLECTION_NAME)
//             .updateOne({_id: data}, {$inc: {numberOfScanned: 1}});

//           if (user.points >= 10) {
//             await db.collection('users').updateOne(
//               {name: user.name},
//               {
//                 $inc: {points: -10},
//                 $push: {scanned: code._id},
//               },
//             );
//           } else {
//             console.log('no points');
//           }

//           res.json({isValid: true, qrCodeData: code.item});
//         } else {
//           console.log('ma laha2et halak');
//           res.json({isValid: false, qrCodeData: code.item});
//         }
//       } else if (code.type === 'deal') {
//         console.log('owner is(deal)', code.owner);
//         await db
//           .collection(COLLECTION_NAME)
//           .updateOne({_id: data}, {$set: {isDeleted: true}}); //remove if one time deal
//         await db
//           .collection('users')
//           .updateOne({name: user.name}, {$inc: {points: 10}});

//         await db
//           .collection('users')
//           .updateOne({name: code.owner.toLowerCase()}, {$inc: {points: 1}});
//         res.json({isValid: true, qrCodeData: code.item});
//       } else {
//         // if the qr code is for a item
//         console.log('owner is', code.owner.toLowerCase());
//         await db
//           .collection('users')
//           .updateOne({name: user.name}, {$inc: {points: 10}});

//         await db
//           .collection('users')
//           .updateOne({name: code.owner.toLowerCase()}, {$inc: {points: 1}});

//         await db
//           .collection(COLLECTION_NAME)
//           .updateOne({_id: data}, {$inc: {numberOfScanned: 1}});
//         res.json({isValid: true, qrCodeData: code.item});
//       }
//     }
//   } catch (err) {
//     console.error('Error validating QR code in MongoDB:', err);
//     res.status(500).json({error: 'Failed to validate QR code'});
//   }
// });

// app.post('/generate-qrcode', async (req, res) => {
//   try {
//     const {data} = req.body;
//     const {qrtype} = req.body;
//     const {user} = req.body;

//     const qrCode = `QR_${uuidv4()}`;

//     const qrCodeData = {
//       _id: qrCode,
//       data,
//       timestamp: new Date(),
//       type: qrtype,
//       owner: user,
//       numberOfScanned: 0,
//       isDeleted: false,
//     };

//     const item_exists = await db
//       .collection(COLLECTION_NAME)
//       .findOne({data: data, type: qrtype, owner: user, isDeleted: false});
//     if (item_exists) {
//       console.log('there is already this item for the shop');
//     } else {
//       const result = await db.collection(COLLECTION_NAME).insertOne(qrCodeData);
//       console.log('QR code image saved to MongoDB:', result.insertedId);
//     }

//     res.json({qrCode});
//   } catch (error) {
//     console.error('Error saving QR code image to MongoDB:', error);
//     res.json({error: 'Could not save QR code image'});
//   }
// });

app.post('/verify-code', async (req, res) => {
  try {
    const {data} = req.body;
    const code = await db
      .collection(COLLECTION_NAME)
      .updateOne({_id: data}, {$set: {isDeleted: true, verify: true}});
    res.status(200).json({message: 'Code verified successfully', code});
  } catch (error) {
    console.log('error while verifying code:', error);
    res.status(500).json({error: 'Failed to verify code'});
  }
});

app.use(cors());
