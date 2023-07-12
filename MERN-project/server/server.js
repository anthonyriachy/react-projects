//const { issuesDB } = require("../fakeData/data");

const fs = require("fs"); // it used then to read the file

const { GraphQLScalarType } = require("graphql"); // to set the graphqldate type
const express = require("express");
const { Kind } = require("graphql/language");

const { ApolloServer,UserInputError } = require("apollo-server-express");

const { MongoClient } = require('mongodb');

const { errorMonitor } = require("events");

const url = 'mongodb://localhost/Issuetracker';

let db;

let aboutMessage = "Issue Tracker API v1.0";



const GraphQLDate = new GraphQLScalarType({
  name: "GraphQlDate",
  description: "a Date() type as GraphQl scalar ",
  serialize(value) {
    return value.toISOString();
  },
  parseValue(value) {
   // return new Date(value);
   const dateValue = new Date(value);
   return isNaN(dateValue) ? undefined : dateValue;
  },
  parseLiteral(ast) {
    //return ast.kind == Kind.STRING ? new Date(ast.value) : undefined;
    if (ast.kind == Kind.STRING) {
      const value = new Date(ast.value);
      return isNaN(value) ? undefined : value;
    }
  },
});
// const typeDefs =`# or in another file
//     type User {
//         name:String!
//         age:Int!
//         married:Boolean!
//     }
//     type Query {
//     about: String!          #function that return about message
//     getAllUsers:[User!]!    #to return a list of users user! means one user
//     }
//     type Mutation {
//     setAboutMessage(message: String!): String!
//     CreateUser(name:String! ,age :Int! , married: Boolean!):User!
//     }
// `;

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

async function getNextSequence(name) {
  const result = await db.collection('counters').findOneAndUpdate(
  { _id: name },
  { $inc: { current: 1 } },
  { returnOriginal: false },
  );
  return result.value.current;
}


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
 

async function issueAdd(_, { issue }) {
  const errors=[];
  validateIssue(issue);
  //we can ignore the first argument and usnpe a destructuring assignment to access the issue object, which is the input
  issue.created = new Date();
  //issue.id = issuesDB.length + 1;
  issue.id = await getNextSequence('issues');
  //if (issue.status == undefined) issue.status = "New";
  //issuesDB.push(issue);
  const result = await db.collection('issues').insertOne(issue);
  const savedIssue = await db.collection('issues')
  .findOne({ _id: result.insertedId });
  return savedIssue;
  //return issue;
}





const app = express();

async function connectToDb() {
 const client = new MongoClient(url, { useNewUrlParser: true });
 await client.connect();
 console.log('Connected to MongoDB at', url);
 db = client.db();
}


const server = new ApolloServer({
  typeDefs: fs.readFileSync("./server/schema.graphql", "utf-8"), //to read the file will transform it into a string also
  resolvers,
  formatError: error=>{
    console.log(error);
    return error
  },
});

(async function(){ //to listen on pory async

  try{
      await connectToDb();
      app.listen(3000, function () {
      console.log("listening of port 3000")});
  }catch(err){
      console.log('ERROR',err);
  }
})();


//server setup


// Now, we have to change the setup of the server to first connect to the database and then start the 
// Express application. Since connectToDb() is an async function, we can use await to wait for it to finish, then 
// call app.listen(). But since await cannot be used in the main section of the program, we have to enclose it 
// within an async function and execute that function immediately

app.use("/", express.static("public"));

server.applyMiddleware({ app, path: "/graphql" });



//shape and function that we will use to change data
//these can be in diff files
// ! meands required

//modulel.exports={}
//const require to bring do further research
