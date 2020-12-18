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
      authHandle(req, res)
    )(req, res, next);
  }
);

router.post(
  '/login',
  function (req, res, next) {
    passport.authenticate(
      'login',
      { session: false },
      authHandle(req, res)
    )(req, res, next);
  }

);


router.use(
  '/',
  function (req, res, next) {
    passport.authenticate(
      'authorization',
      { session: false },
      authHandle(req, res, next)
    )(req, res, next);
  }
);

function authHandle(req, res, next) {
  return function (error, user, info) {
    if (isInvalid(error, user)) {
      const BAD_REQUEST = 400;
      res.status(BAD_REQUEST);
      const payload = new Response('Unsuccessfully!');
      return res.json(payload);
    }

    if (isNotMiddleWare(next)) {
      const SUCCESS = 200;
      res.status(SUCCESS);
      const payload = new Response('Successfuly!', user);
      return res.json(payload);
    }

    req.user = user;
    next();
  }
};

function isNotMiddleWare(next) {
  return !next;
}

function isInvalid(error, user) {
  return error || !user;
}

module.exports = router;

