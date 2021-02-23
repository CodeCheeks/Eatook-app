const expressSession = require('express-session');
const connectMongo = require('connect-mongo');
const mongoose = require('mongoose');



const MongoStore = connectMongo(expressSession);

const session = expressSession({
  secret: process.env.SESSION_SECRET || '(change it)',
  saveUninitialized: false,
  resave: false,
  cookie: {
    secure: process.env.SESSION_SECURE || false,
    httpOnly: true,
    maxAge: process.env.SESSION_MAX_AGE || 1800000
  },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: process.env.SESSION_MAX_AGE || 1800000,
  })
})

module.exports = session