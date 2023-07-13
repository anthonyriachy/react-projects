//const { issuesDB } = require("../fakeData/data");

const fs = require("fs"); // it used then to read the file
require('dotenv').config()
const { GraphQLScalarType } = require("graphql"); // to set the graphqldate type
const express = require("express");
const { Kind } = require("graphql/language");

const { ApolloServer,UserInputError } = require("apollo-server-express");

const { MongoClient } = require('mongodb');

const { errorMonitor } = require("events");

const url = process.env.DB_URL || 'mongodb://localhost/Issuetracker';
const port = process.env.API_SERVER_PORT || 3000;

let db;

let aboutMessage = "Issue Tracker API v1.0";



const GraphQLDate = new GraphQLScalarType({
  name: "GraphQlDate",
  description: "a Date() type as GraphQl scalar ",
  serialize(value) {
    return value.toISOString();
  },
  parseValue(value) {
   
   const dateValue = new Date(value);
   return isNaN(dateValue) ? undefined : dateValue;
  },
  parseLiteral(ast) {
    
    if (ast.kind == Kind.STRING) {
      const value = new Date(ast.value);
      return isNaN(value) ? undefined : value;
    }
  },
});


const resolvers = {
  Query: {
    about: () => aboutMessage, //to ways

    //     //here db.find in mogodb for example and we return the data.

    issueList,
  },
  Mutation: {
    setAboutMessage,
    issueAdd,
  },
  GraphQLDate,
};




function setAboutMessage(_, { message }) {
  return (aboutMessage = message);
}

async function issueList() {
  const issues = await db.collection('issues').find({}).toArray();
  return issues;
}


function validateIssue(_, { issue }) {
  const errors = [];
  if (issue.title.length < 3) {
  errors.push('Field "title" must be at least 3 characters long.')
  }
  if (issue.status == 'Assigned' && !issue.owner) {
  errors.push('Field "owner" is required when status is "Assigned"');
  }
  if (errors.length > 0) {
  throw new UserInputError('Invalid input(s)', { errors });
  }
 }
 
 async function getNextSequence(name) {
  const result = await db.collection('counters').findOneAndUpdate(
  { _id: name },
  { $inc: { current: 1 } },
  { returnOriginal: false },
  );
  return result.value.current;
}

async function issueAdd(_, { issue }) {
  const errors=[];
  validateIssue(_,{issue});
  issue.created = new Date();
  issue.id = await getNextSequence('issues');
  //we can ignore the first argument and usnpe a destructuring assignment to access the issue object, which is the input

  const result = await db.collection('issues').insertOne(issue);
  const savedIssue = await db.collection('issues')
  .findOne({ _id: result.insertedId });
  return savedIssue;
  
}





const app = express();

async function connectToDb() {
 const client = new MongoClient(url, { useNewUrlParser: true });
 await client.connect();
 console.log('Connected to MongoDB at', url);
 db = client.db();
}


const server = new ApolloServer({
  typeDefs: fs.readFileSync("schema.graphql", "utf-8"), //to read the file will transform it into a string also
  resolvers,
  formatError: error=>{
    console.log(error);
    return error
  },
});

(async function(){ //to listen on pory async

  try{
      await connectToDb();
      app.listen(port, function () {
      console.log(`API server listening of port ${port}`)});
  }catch(err){
      console.log('ERROR',err);
  }
})();


//server setup


// Now, we have to change the setup of the server to first connect to the database and then start the 
// Express application. Since connectToDb() is an async function, we can use await to wait for it to finish, then 
// call app.listen(). But since await cannot be used in the main section of the program, we have to enclose it 
// within an async function and execute that function immediately



server.applyMiddleware({ app, path: "/graphql" });



//shape and function that we will use to change data
//these can be in diff files
// ! meands required

//modulel.exports={}
//const require to bring do further research