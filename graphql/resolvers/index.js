const bcrypt = require("bcryptjs");

const Event = require("../../models/event");
const User = require("../..//models/user");
const Booking = require("../..//models/booking");

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
  //BOOKINGS
  booking: async () => {
    try {
      console.log("in try");
      const bookings = await Booking.find();
      return bookings.map((booking) => {
        console.log("booking,", booking._doc);
        return {
          ...booking._doc,
          _id: booking.id,
          user: userEvents.bind(this, booking._doc.user),
          event: SingleEvent.bind(this, booking._doc.event),
          createdAt: new Date(booking.createdAt).toDateString(),
          updatedAt: new Date(booking.updatedAt).toDateString(),
        };
      });
    } catch (err) {
      console.log("in catch");
      throw err;
    }
  },

  bookEvent: async (args) => {
    try {
      const fetchedEvent = await Event.findOne({ _id: args.eventId });
      const booking = new Booking({
        user: "603b07afd143192b14c6a16f",
        event: fetchedEvent,
      });
      const result = await booking.save();
      return {
        ...result._doc,
        _id: result.id,
        user: userEvents.bind(this, booking._doc.user),
        event: SingleEvent.bind(this, booking._doc.event),
        createdAt: new Date(result.createdAt).toDateString(),
        updatedAt: new Date(result.updatedAt).toDateString(),
      };
    } catch (err) {
      throw err;
    }
  },

  // EVENTS
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

  //USERS
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

//secondary resolvers

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

const SingleEvent = async (eventId) => {
  try {
    const event = await Event.findById(eventId);
    return {
      ...event._doc,
      _id: event.id,
      creator: userEvents.bind(this, event.creator),
    };
  } catch (err) {
    throw err;
  }
};
