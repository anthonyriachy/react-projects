const { issuesDB } = require("../fakeData/data");
const fs = require("fs"); // it used then to read the file
const { GraphQLScalarType } = require("graphql"); // to set the graphqldate type
const express = require("express");
const { Kind } = require("graphql/language");
const { ApolloServer } = require("apollo-server-express");
const { MongoClient } = require('mongodb');

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
    return new Date(value);
  },
  parseLiteral(ast) {
    return ast.kind == Kind.STRING ? new Date(ast.value) : undefined;
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

function setAboutMessage(_, { message }) {
  return (aboutMessage = message);
}

async function issueList() {
  const issues = await db.collection('issues').find({}).toArray();
  return issues;
}

function issueAdd(_, { issue }) {
  //we can ignore the first argument and use a destructuring assignment to access the issue object, which is the input
  issue.created = new Date();
  issue.id = issuesDB.length + 1;
  if (issue.status == undefined) issue.status = "New";
  issuesDB.push(issue);
  return issue;
}


async function connectToDb() {
    const client = new MongoClient(url, { useNewUrlParser: true });
    await client.connect();
    console.log('Connected to MongoDB at', url);
    db = client.db();
} 


const app = express();



const server = new ApolloServer({
  typeDefs: fs.readFileSync("./server/schema.graphql", "utf-8"), //to read the file will transform it into a string also
  resolvers,
});

//server setup

(async function(){

    try{
        await connectToDb();
        app.listen(3000, function () {
        console.log("listening of port 3000")});
    }catch(err){
        console.log('ERROR',err);
    }
}());
// Now, we have to change the setup of the server to first connect to the database and then start the 
// Express application. Since connectToDb() is an async function, we can use await to wait for it to finish, then 
// call app.listen(). But since await cannot be used in the main section of the program, we have to enclose it 
// within an async function and execute that function immediately

server.applyMiddleware({ app, path: "/graphql" });






app.use("/", express.static("public"));



//shape and function that we will use to change data
//these can be in diff files
// ! meands required

//modulel.exports={}
//const require to bring do further research
