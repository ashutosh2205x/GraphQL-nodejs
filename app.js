const express = require("express");
const bodyparser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");
const app = express();
// comps
const { MONGO_URL } = require("./keys");
const GraphQLresolvers = require("./graphql/resolvers");
const GraphQLschema = require("./graphql/schema");


// start
app.use(bodyparser.json());


app.use(
  "/graphql",
  graphqlHTTP({
    schema: GraphQLschema,
    rootValue: GraphQLresolvers,
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
