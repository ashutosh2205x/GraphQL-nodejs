const express = require("express");
const bodyparser = require("body-parser");
const { buildSchema } = require("graphql");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");
const app = express();
// comps
const { MONGO_URL } = require("./keys");
const Event = require("./models/event");

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

    type RootQuery {
        events : [Event!]!
    }

    type RootMutation {
        createEvent(eventInput: EventInput) : Event
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
        });
        console.log(args.eventInput);
        return event
          .save()
          .then((res) => {
            console.log(res);
            return { ...event._doc };
          })
          .catch((err) => {
            console.log(err);
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
