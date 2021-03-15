const bcrypt = require("bcryptjs");

const Event = require("../../models/event");
const User = require("../..//models/user");

module.exports = {
  //all resolvers functions
  events: () => {
    return Event.find()
      .then((events) => {
        return events.map((event) => {
          return {
            ...event._doc,
            creator: userEvents.bind(this, event._doc.creator),
          };
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
    console.log("events args==>", args.eventInput);
    return event
      .save()
      .then((res) => {
        temp_event = {
          ...event._doc,
          _id: event.id,
          creator: userEvents.bind(this, event._doc.creator),
        };
        return User.findById("603b07afd143192b14c6a16f");
      })
      .then((user) => {
        console.log("user", user);
        if (!user) {
          throw new Error("No  already exists");
        }
        user.createdEvents.push(event);
        return user.save();
      })
      .then((result) => {
        return temp_event;
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

        return user
          .save()
          .then((result) => {
            return { ...result._doc, password: null, id: result.id };
          })
          .catch((err) => {
            throw err;
          });
      })
      .then((result) => {
        return { ...result._doc };
      })
      .catch((err) => {
        throw err;
      });
  },
};

const userEvents = (userid) => {
  return User.findById(userid)
    .then((result) => {
      return {
        ...result._doc,
        id: result.id,
        createEvents: FindEvents.bind(this, result._doc.createdEvents),
      };
    })
    .catch((err) => {
      throw err;
    });
};

const FindEvents = (eventIds) => {
  return Event.findById({ _id: { $in: eventIds } })
    .then((result) => {
      return result.map((event) => {
        return {
          ...event._doc,
          id: event.id,
          creator: userEvents.bind(this, event.creator),
        };
      });
    })
    .catch((er) => {
      throw er;
    });
};
