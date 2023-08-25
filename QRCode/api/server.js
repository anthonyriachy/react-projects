/* eslint-disable eqeqeq */
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
        price: parseInt(price, 10),
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
        price: parseInt(price, 10),
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

    let result = await db
      .collection('items')
      .findOne({qrCodeId: data, isDeleted: false});
    if (result) {
      //item in database
      console.log('userName', userName);
      if (userName) {
        const user = await db
          .collection('users')
          .findOne({name: userName.toLowerCase()});

        if (result.owner.toLowerCase() !== user.name.toLowerCase()) {
          //user scanning his own qr code
          if (result.available > 0) {
            //item available

            if (result.expiration) {
              //item has expiration date (offer)
              const qrDate = new Date(result.expiration).getTime();
              const currentDate = new Date().getTime();

              if (qrDate >= currentDate) {
                //item has not expired
                if (user.points >= 10) {
                  //user has enough points?

                  //remove points because of the offer.
                  let pointToRemove;
                  if (user.level == 'welcome') {
                    //decide the number of points based of the users level.
                    pointToRemove = result.price * 3;
                  } else if (user.level == 'bronze' || user.level == 'silver') {
                    pointToRemove = result.price * 4;
                  } else {
                    pointToRemove = result.price * 5;
                  }

                  await db.collection('items').updateOne(
                    //update the item
                    {qrCodeId: data, isDeleted: false},
                    {
                      $inc: {available: -1, numberOfScanned: 1},
                      $set: {qrCodeId: `QR_${uuidv4()}`},
                    }, // remove 1 from the item, add number of scanned, and change the items qr code
                  );

                  await db.collection('users').updateOne(
                    //update the one that scanned
                    {name: userName.toLowerCase()},
                    {
                      $inc: {points: -pointToRemove}, //remove the points for the offer
                      $push: {scanned: result._id}, //the the qr code to the list of qr codes
                    },
                  );

                  await db.collection('users').updateOne(
                    //update item owner
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
                // await db //deleting the item
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
            } else { // (not offer)
              //item does not have  an expiration date.
              await db.collection('items').updateOne(
                {qrCodeId: data, isDeleted: false},
                {
                  $inc: {available: -1, numberOfScanned: 1},
                  $set: {qrCodeId: `QR_${uuidv4()}`},
                }, //change the qr code
              );

              //belowe i check if the user shohuld be in the next level
              //!!!!!!!!!!!!change them to check only money not the level, if the users first purchase was big
              if (
                user.level == 'welcome' &&
                user.totalMoneySpent >= 250 &&
                user.totalMoneySpent < 500
              ) {
                await db
                  .collection('users')
                  .updateOne({name: user.name}, {$set: {level: 'bronze'}});
              } else if (
                user.level == 'bronze' &&
                user.totalMoneySpent >= 500 &&
                user.totalMoneySpent < 1500
              ) {
                await db
                  .collection('users')
                  .updateOne({name: user.name}, {$set: {level: 'silver'}});
              } else if (
                user.level == 'silver' &&
                user.totalMoneySpent >= 1500
              ) {
                await db
                  .collection('users')
                  .updateOne({name: user.name}, {$set: {level: 'gold'}});
              }
              //below we check which level the user is and how many points the user willl get
              let pointsToAdd;
              if (user.level == 'welcome') {
                pointsToAdd = result.price * 3;
                //1 $= 3 points
              } else if (user.level == 'bronze' || user.level == 'silver') {
                pointsToAdd = result.price * 4;
                //1 $= 4points
              } else if (user.level == 'gold') {
                pointsToAdd = result.price * 5;
                //1$ = 5points
              }

              await db.collection('users').updateOne(//add points for the user, add to the total money he spent, and the qr code to the of items
                {name: userName.toLowerCase()},
                {
                  $inc: {points: pointsToAdd, totalMoneySpent: result.price},
                  $push: {scanned: result._id},
                },
              );

              await db.collection('users').updateOne( //add points for the shop owner
                  {name: result.owner.toLowerCase()},
                  {$inc: {points: 1}},
                );

              res.json({isValid: true, qrCodeData: result.item});
            }
          } else {
            //no more item available
            res.json({
              isValid: 'there is no more items available',
              qrCodeData: result.item,
            });
            // await db // deleting the item
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
        res.json({isValid: 'not logged in', qrCodeData: data});
      }
    } else {
      console.log('data',data);
      result = await db.collection('users').find({unscanned:data}).toArray((err, users) => {
        if (err) {
          console.error('Error finding users:', err);
          return;
      }});
      if (result.length!==0){ // check if it is in the unscanned list
        await  db.collection('users').updateOne({name:result[0].name},{$pull:{unscanned:data}});//!!!!!!#### change points after this 
        res.json({qrCodeData:res.name})
      }else{
        console.log('item not found')
      }
      res.json({qrCodeData: data});
    }
  } catch (error) {
    console.log('error validatiig qr code: ', error);
  }
});

app.post('/redeem_points', async (req, res) => {
  try {
    const {points} = req.body;
    const {user} = req.body;
    if (user) {
      const userName = await db
        .collection('users')
        .findOne({name: user.toLowerCase()});
      if (userName) {
        if (points == 500) {
          if (userName.points >= 500) {
            await db
              .collection('users')
              .updateOne(
                {name: userName.name},
                {$inc: {points: -500}, $push: {vouchers: 5}},
              );
            res.json({isValid: 'you bought 5 dollars, enjoy'});
          } //user has 500 points
          else {
            //user has no points
            res.json({isValid: 'not enough points'});
          }
        } //points==500

        if (points == 1000) {
          if (userName.points >= 1000) {
            await db
              .collection('users')
              .updateOne(
                {name: userName.name},
                {$inc: {points: -1000}, $push: {vouchers: 10}},
              );
            res.json({isValid: 'you bought 10 dollars, enjoy'});
          } //user has 1000 points
          else {
            //user has no points
            res.json({isValid: 'not enough points'});
          }
        } //points == 1000
        if (points == 2500) {
          if (userName.points >= 2500) {
            await db
              .collection('users')
              .updateOne(
                {name: userName.name},
                {$inc: {points: -2500}, $push: {vouchers: 25}},
              );
            res.json({isValid: 'you bought 25 dollars, enjoy'});
          } //user has 2500 points
          else {
            //user has no points
            res.json({isValid: 'not enough points'});
          }
        } //points == 2500

        if (points == 5000) {
          if (userName.points >= 5000) {
            await db
              .collection('users')
              .updateOne(
                {name: userName.name},
                {$inc: {points: -5000}, $push: {vouchers: 50}},
              );
            res.json({isValid: 'you bought 50 dollars, enjoy'});
          } //user has 1000 points
          else {
            //user has no points
            res.json({isValid: 'not enough points'});
          }
        } //points == 5000
      }
    } else {
      res.json({isValid: 'sign in'});
    }
  } catch (err) {
    console.log('error buying a voucher', err);
  }
});

app.post('/addToUnscanned',async(req,res)=>{
  try {
    const qrCode = req.body.qrCodeId;
    const owner = req.body.owner;
    console.log('qrcode:',qrCode,'owner:',owner);
    if (owner && qrCode){
      const result = await db.collection('users').updateOne({name:owner.toLowerCase()},{$push:{unscanned:qrCode}});

      await db.collection('items').updateOne({qrCodeId:qrCode},{$set: {qrCodeId: `QR_${uuidv4()}`}});
      if (result){
        res.json({result});
      } else {
        res.json({isValid:'owner not found'});
      }
    }
    res.json({isValid:false});

  } catch (error){


  }

  }
);

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
