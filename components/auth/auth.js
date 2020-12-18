const LocalStrategy = require('passport-local').Strategy;
const UserRepos = require('./user-repos.js');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const { Enviroment } = require('../enviroment/index.js');
const jwt = require('jsonwebtoken');

exports.login = new LocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password',
    session: false
  },
  async function (username, password, done) {
    const userRespos = new UserRepos();
    try {
      const userId = await userRespos.verify({ username, password });
      if (!userId) {
        return done(new Error('Invalid!'));
      }

      const user = { id: userId, username };
      const secretKey = Enviroment.getJwtSecret();
      return done(null, {
        token: jwt.sign(user,secretKey,{expiresIn: '1d'})
      });
    } catch (e) {
      return done(e);
    }
  }
);

exports.authorization = new JWTStrategy(
  {
    secretOrKey: Enviroment.getJwtSecret(),
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
  },
  async function (payload, done) {
    try {
      const user = { id: payload.id, username: payload.username };
      done(null, user);
    } catch (e) {
      done(e);
    }
  }
);

exports.register = new LocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password',
    session: false
  },
  async function (username, password, done) {
    const userRespos = new UserRepos();
    try {
      const userId = await userRespos.insert({ username, password });
      const user = { id: userId, username };
      return done(null, user);
    } catch (e) {
      return done(e);
    }
  }
);
