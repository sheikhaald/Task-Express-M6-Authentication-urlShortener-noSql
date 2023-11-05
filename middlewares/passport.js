const User = require("../models/User");
const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local").Strategy;

const localStrategy = new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      done({ message: "user or password is not found!!!!!!" });
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch)
      return done({ message: "user or password is not found!!!!!!" });

    return done((null, user));
  } catch (error) {
    done(error);
  }
});

module.exports = localStrategy;
