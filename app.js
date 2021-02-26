const express = require("express");
const bodyparser = require("body-parser");
const { buildSchema } = require("graphql");
const { graphqlHTTP } = require('express-graphql');
const app = express();

app.use(bodyparser.json());

app.use(
  '/graphql',
  graphqlHTTP({
    schema: buildSchema(`
    type RootQuery {
        events : [String!]!
    }

    type RootMutation {
        createEvent(name: String) : String
    }
    schema {
        query : RootQuery
        mutation : RootMutation
    }
    `),
    rootValue: {
      //all resolvers
      events: () => {
        return ["ARRAY", "of", "Strings"];
      },
      createEvent : (args)=>{
        return args, args.name
      }
    },
    graphiql : true
  })
);

app.listen(3000, () => {
  console.log("started");
});
