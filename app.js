require("dotenv").config()
const createError = require("http-errors");
const express = require("express");
const logger = require("morgan");
const routes = require("./config/routes");
const session = require("./config/session.config");
const favicon = require('serve-favicon');
const flash = require('connect-flash');

const passport = require('passport')



require("./config/db.config")
require('./config/hbs.config')
require("./config/passport.config")


// Express config
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(logger("dev"));
app.use(session);
app.use(passport.initialize());
app.use(passport.session());
app.set("views", __dirname + "/views");
app.set("view engine", "hbs");
app.use(flash());

app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.flashMessage = req.flash('flashMessage');

  res.locals.mapsKey = process.env.API_KEY_MAPS

  next()
})


app.use(favicon('public/img/favicon.ico'));

app.use("/", routes);

// Error handler
app.use((req, res, next) => {
    next(createError(404));
  });
  
app.use((error, req, res, next) => {
console.log(error);
if (!error.status) {
    error = createError(500);
}
res.status(error.status);
res.render("error", error);
});
  



  // Initialization on port
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Listening on port ${PORT}`));