var createError = require("http-errors")
var compression = require("compression")
var express = require("express")
var cors = require("cors")
var path = require("path")
var cookieParser = require("cookie-parser")
var logger = require("morgan")

var indexRouter = require("./routes/index")
var usersRouter = require("./routes/users")
var centerInitialsRouter = require("./routes/centers/initials")
var centerLegalsRouter = require("./routes/centers/legals")
var centerCertsRouter = require("./routes/centers/certs")
var centerSpecialistsRouter = require("./routes/centers/specialists")

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
app.use("/api/centers/initials", centerInitialsRouter)
app.use("/api/centers/legals", centerLegalsRouter)
app.use("/api/centers/certs", centerCertsRouter)
app.use("/api/centers/specialists", centerSpecialistsRouter)

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
  res.render("error")
})

module.exports = app
