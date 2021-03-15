const { buildSchema } = require("graphql");

module.exports = buildSchema(`
 type Event {
     _id : ID!
     title : String!
     description : String!
     price: Float!
     date : String!
     creator : User!
     
 }
 input EventInput {
     title : String!
     description : String!
     price: Float!
     date : String!
 }

 type User { 
   _uid : ID!
   email : String!
   password : String
   createdEvents : [Event!]
 }
 
 input Userinput {
   email : String!
   password: String!
 }

 type RootQuery {
     events : [Event!]!
 }

 type RootMutation {
     createEvent(eventInput: EventInput) : Event
     createUser(userinput: Userinput) : User

 }
 schema {
     query : RootQuery
     mutation : RootMutation
 }
 `);
