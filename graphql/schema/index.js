const { buildSchema } = require("graphql");

module.exports = buildSchema(`
type Booking {
    _id : ID!
    event :Event!
    user : User!
    createdAt : String!
    updatedAt : String!
}
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
     bookings : [Booking!]!
 }

 type RootMutation {
     createEvent(eventInput: EventInput) : Event
     createUser(userinput: Userinput) : User
     bookEvent (eventId: ID!): Booking!
     cancelBooking(bookingId : ID!) : Event!

 }
 schema {
     query : RootQuery
     mutation : RootMutation
 }
 `);
