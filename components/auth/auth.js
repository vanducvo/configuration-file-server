const LocalStrategy = require('passport-local').Strategy;
const UserRepos = require('./user-repos.js');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

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
        return done('Invalid!')
      }

      return done(null, { id: userId });
    } catch (e) {
      return done('Invalid!')
    }
  }
);

exports.authorization = new JWTStrategy(
  {
    secretOrKey: 'NEED_ENVIROMENT',
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
  },
  async function(payload, done){
    try{
      done(null, payload.id);
    }catch(e){
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
    console.log('Here!');
    const userRespos = new UserRepos();
    try {
      const userId = await userRespos.insert({ username, password });
      return done(null, { id: userId });
    } catch (e) {
      return done('Account Existed!')
    }
  }
);

