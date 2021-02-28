const express = require("express");
const bodyparser = require("body-parser");
const { buildSchema } = require("graphql");
const { graphqlHTTP } = require("express-graphql");
const app = express();
const mongoose = require("mongoose");
const { MONGO_URL } = require("./keys");
const events = [];
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
        return events;
      },
      createEvent: (args) => {
        const event = {
          _id: Math.random().toString(),
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: args.eventInput.date,
        };
        console.log(args.eventInput);
        events.push(event);
        return event;
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
  .then((res) => console.log("connnected"))
  .catch((err) => console.log("err", err));

app.listen(3000, () => {
  console.log("started");
});
