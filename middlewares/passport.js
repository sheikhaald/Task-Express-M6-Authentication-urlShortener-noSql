const { transformAuthInfo } = require("passport");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const { fromAuthHeaderAsBearerToken } = require("passport-jwt").ExtractJwt;
require("dotenv").config();

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

const jwtStrategy = new JwtStrategy(
  {
    jwtFromRequest: fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  },
  async (payload, done) => {
    try {
      if (Date.now() / 1000 > payload.EXP) {
        done(null, false);
      }
      const user = await user.findById(payload, done);
      if (!user) return done(null, false);
      return done(null, user);
    } catch (error) {
      done(error);
    }
  }
);

module.exports = { localStrategy, jwtStrategy };
