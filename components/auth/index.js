const passport = require('passport');
const auth = require('./auth.js');
const router = require('express').Router();
const jwt = require('jsonwebtoken');

passport.use('login', auth.login);
passport.use('register', auth.register);
passport.use('authorization', auth.authorization);

router.post(
  '/register',
  passport.authenticate('register', {session: false}),
  async function (req, res, next) {
    res.json({
      message: 'Register Successful!',
      id: req.user.id
    });
  }
);

router.post(
  '/login',
  passport.authenticate('login', {session: false}),
  async function (req, res, next) {
    res.json({
      message: 'Login Successful!',
      token: jwt.sign(req.user, 'NEED_ENVIROMENT')
    });
  }
);


router.post(
  '/authorization',
  passport.authenticate('authorization', {session: false}),
  async function (req, res, next) {
    res.json({
      message: 'Authorization Successful!',
      id: req.user.id
    });
  }
);

module.exports = router;