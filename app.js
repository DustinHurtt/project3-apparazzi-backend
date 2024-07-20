var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv/config");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var photosRouter = require("./routes/photos");
var commentsRouter = require("./routes/comments");
var authRouter = require('./routes/auth')

var app = express();



app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use(cors())

// app.use(
//   cors({
//     orgin: [ process.env.FRONTEND_URL || 'http://localhost:3000' || 'http:localhost:5173' ]
//   })
// );
// app.use(
//   cors({
//     origin: [process.env.FRONTEND_URL],
//     // origin: ['http://localhost:3000']
//   })
// );

// app.use(
//   cors({
//     origin: [process.env.FRONTEND_URL],
//     // origin: ['http://localhost:3000']
//   })
// );

app.use("/", indexRouter);
app.use('/auth', authRouter)
app.use("/users", usersRouter);
app.use("/photos", photosRouter);
app.use("/comments", commentsRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

mongoose
  .connect(
    process.env.MONGODB_URI 
  )
  .then((x) =>
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  )
  .catch((err) => console.error("Error connecting to mongo", err));

module.exports = app;
