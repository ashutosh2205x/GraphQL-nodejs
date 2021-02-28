const express = require("express");
const bodyparser = require("body-parser");
const { buildSchema } = require("graphql");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const app = express();
// comps
const { MONGO_URL } = require("./keys");
const Event = require("./models/event");
const User = require("./models/user");

// start
app.use(bodyparser.json());

app.use(
  "/graphql",
  graphqlHTTP({
    schema: buildSchema(`
    type Event {
        _id : ID!
        title : String!
        description : String!
        price: Float!
        date : String!
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
    `),
    rootValue: {
      //all resolvers functions
      events: () => {
        return Event.find()
          .then((events) => {
            return events.map((event) => {
              return { ...event._doc };
            });
          })
          .catch((err) => {
            throw err;
          });
      },
      createEvent: (args) => {
        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: new Date(args.eventInput.date),
          creator: "603b07afd143192b14c6a16f",
        });
        var temp_event;
        console.log('events args==>',args.eventInput);
        return event
          .save()
          .then((res) => {
            temp_event = { ...event._doc };
            return User.findById("603b07afd143192b14c6a16f")
           
          })
          .then((user) => {
            console.log('user', user);
            if (!user) {
              throw new Error("No  already exists");
            }
            user.createdEvents.push(event)
            return user.save()
          }).then(result=>{
            return temp_event
          })
          .catch((err) => {
            console.log(err);
            throw err;
          });
      },
      createUser: (args) => {
        return User.findOne({ email: args.userinput.email })
          .then((user) => {
            if (user) {
              throw new Error("User already exists");
            }
            return bcrypt.hash(args.userinput.password, 12);
          })
          .then((hashedVal) => {
            const user = new User({
              email: args.userinput.email,
              password: hashedVal,
            });
            return user.save();
          })
          .then((result) => {
            return { ...result._doc };
          })
          .catch((err) => {
            throw err;
          });
      },
    },
    graphiql: true,
  })
);

mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connnected"),
      app.listen(3000, () => {
        console.log("started");
      });
  })
  .catch((err) => console.log("err==>", err));
