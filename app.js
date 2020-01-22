(require('dotenv').config({ silent: true }))

const createError = require('http-errors');
const express = require('express');
const engine = require('ejs-mate');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport =  require('passport');
const User = require('./models/user');
const session = require('express-session');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const favicon = require('serve-favicon');



const indexRouter = require('./routes/index');
const projectsRouter = require('./routes/projects');
const reviewsRouter = require('./routes/reviews');
const artcilesRouter = require('./routes/articles');
const guidesRouter = require('./routes/guides');
const app = express();

// connect ro the database

mongoose.connect('mongodb+srv://sam:12ctyz12@cluster0-nouez.mongodb.net/elapce?retryWrites=true&w=majority', {useNewUrlParser: true, useCreateIndex:true, useUnifiedTopology:true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we're connected!")
});

// use ejs-locals for all ejs templates:
app.engine('ejs', engine);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static('public'));


app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

// Configure passport and sessions
app.use(session({
  secret: 'hang ten dude',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// set local variables middleware

app.use(function(req, res, next) {

  res.locals.currentUser = req.user; 
  res.locals.title = 'Elapce';

  res.locals.success = req.session.success || '';
  delete req.session.success

  res.locals.error = req.session.error || '';
  delete req.session.error
  next();
});



// Mount Routes
app.use('/', indexRouter);
app.use('/projects', projectsRouter);
app.use('/articles', artcilesRouter);
app.use('/guides', guidesRouter);
app.use('/projects/:id/reviews', reviewsRouter);




// catch 404 and forward to error handler
app.use(function(req, res) {
  res.status(400);
  res.render('404.ejs', {title: '404: File Not Found'});
 });

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  //res.locals.message = err.message;
  //res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  //res.status(err.status || 500);
  //res.render('error');
  console.log(err)
  req.session.error = err.message;
  res.redirect('back')
});



module.exports = app;
