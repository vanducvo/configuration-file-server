const passport = require('passport');
const auth = require('./auth.js');
const router = require('express').Router();
const Response = require('../dto/response.js');
passport.use('login', auth.login);
passport.use('register', auth.register);
passport.use('authorization', auth.authorization);

router.post(
  '/register',
  function (req, res, next) {
    passport.authenticate(
      'register',
      { session: false },
      authHandle(res)
    )(req, res, next);
  }
);

router.post(
  '/login',
  function (req, res, next) {
    passport.authenticate(
      'login',
      { session: false },
      authHandle(res)
    )(req, res, next);
  }

);


router.post(
  '/authorization',
  function (req, res, next) {
    passport.authenticate(
      'authorization',
      { session: false },
      authHandle(res)
    )(req, res, next);
  }
);

function authHandle(res) {
  return function (error, user, info) {
    if (error) {
      const BAD_REQUEST = 400;
      res.status(BAD_REQUEST);
      const payload = new Response('Unsuccessfully!');
      return res.json(payload);
    }

    const SUCESS = 200;
    res.status(SUCESS);
    const payload = new Response('Successfuly!', user);
    return res.json(payload);
  }
};

module.exports = router;
