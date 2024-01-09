var createError = require("http-errors")
var compression = require("compression")
var express = require("express")
var cors = require("cors")
var path = require("path")
var cookieParser = require("cookie-parser")
var logger = require("morgan")

var indexRouter = require("./routes/index")
var usersRouter = require("./routes/users")
var centersRouter = require("./routes/centers.js")
var manageRouter = require("./routes/manage.js")

var app = express()

app.use(compression())

app.use(cors())

app.use(logger("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "public")))

app.use("/api/auth", usersRouter)
app.use("/api/main", indexRouter)
app.use("/api/centers", centersRouter)
app.use("/api/manage", manageRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get("env") === "development" ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.json({ error: err })
})

module.exports = app
