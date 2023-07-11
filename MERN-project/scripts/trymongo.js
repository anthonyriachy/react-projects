// const { MongoClient } = require("mongodb");
// //connecting to the server

// const url = "mongodb://localhost/Issuetracker"; //check page 171 for these

// function testWithCallbacks(callback) {
//   console.log("\n--- testWithCallbacks ---");
//   const client = new MongoClient(url, { useNewUrlParser: true });
//   client.connect(function (err, client) {
//     if (err) {
//       callback(err);
//       return;
//     }
//     console.log("Connected to MongoDB");
//     const db = client.db();
//     const collection = db.collection("employees");
//     const employee = { id: 1, name: "A. Callback", age: 23 };
//     collection.insertOne(employee, function (err, result) {
//       if (err) {
//         client.close();
//         callback(err);
//         return;
//       }
//       console.log("Result of insert:\n", result.insertedId);
//       collection.find({ _id: result.insertedId }).toArray(function (err, docs) {
//         if (err) {
//           client.close();
//           callback(err);
//           return;
//         }
//         console.log("Result of find:\n", docs);
//         client.close();
//         callback(err);
//       });
//     });
//   });
// }


// async function testWithAsync() {
//     console.log('\n--- testWithAsync ---');
//     const client = new MongoClient(url, { useNewUrlParser: true });
//     try {
//     await client.connect();
//     console.log('Connected to MongoDB');
//     const db = client.db();
//     const collection = db.collection('employees');
//     const employee = { id: 2, name: 'B. Async', age: 16 };
//     const result = await collection.insertOne(employee);
//     console.log('Result of insert:\n', result.insertedId);
//     const docs = await collection.find({ _id: result.insertedId })
//     .toArray();
//     console.log('Result of find:\n', docs);
//     } catch(err) {
//     console.log(err);
//     } finally {
//     client.close();
//     }
//    }


// testWithCallbacks(function (err) {
//   if (err) {
//     console.log(err);
//   }
//   testWithAsync();
// });

// //Now that we are done inserting and reading back the document, we can close the connection to the
// // server. If we don’t do this, the Node.js program will not exit, because the connection object is waiting to be
// // used and listening to a socket
