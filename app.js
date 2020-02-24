var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
require('./Models/ResponseSchema')
require('./Models/PassageSchema')
require('./Models/ReadingSchema');
require('./Models/Student_Schema');
require('./Models/MathSchema');
require('./Models/ScienceSchema')
require('./Models/EnglishSchema');


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const dashboardRouter=require('./routes/dashboard');
const Test_OptionsRouter=require('./routes/Test_Options');
const EditQuestionRouter = require('./routes/EditQuestion');
const profileRouter = require('./routes/profile');
const registrationRouter = require('./routes/register');
const AddQuestionsRouter = require('./routes/AddQuestions');
const ModelPredictorRouter=require('./routes/ModelPredictor');
const ReadWriteSheetsRouter=require('./routes/ReadWriteSheets');
const resetPassword = require('./routes/reset-password');
var bodyParser = require('body-parser');
var okta = require('./okta');
ExpressOIDC = require("@okta/oidc-middleware").ExpressOIDC;
var logger = require('morgan');
var session = require('express-session');

const app = express();
const oidc = new ExpressOIDC({
  issuer: "https://dev-902682.oktapreview.com/oauth2/default",
  client_id: "0oaiqcd6mubXdayXK0h7",
  client_secret: "krpfLTbmYghT7UFBw8uifEYSTQiaByb4hRMVba8O",
  redirect_uri: 'http://localhost:4000/users/callback',
  scope: "openid profile",
  appBaseUrl: 'http://localhost:4000',

});
// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs')
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/dashboard', dashboardRouter)
app.use('/Test_Options', Test_OptionsRouter)
app.use('/EditQuestion', EditQuestionRouter)
app.use('/profile', oidc.ensureAuthenticated(), profileRouter)
app.use('/register', registrationRouter)
app.use('/AddQuestions', AddQuestionsRouter)
app.use('/ModelPredictor',ModelPredictorRouter)
app.use('/reset-password', resetPassword)
app.use('/ReadWriteSheets',ReadWriteSheetsRouter)

app.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})


app.use(session({
  secret: 'krpfLTbmYghT7UFBw8uifEYSTQiaByb4hRMVba8O',
  resave: true,
  saveUninitialized: false
}));

app.use(oidc.router)
app.use(okta.middleware);


/////////////Database//////////////////






//////Error Handlers///////////
////////////////////
////////////

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log(res.locals.message);

  res.render("error");
});

module.exports = { app, oidc }
