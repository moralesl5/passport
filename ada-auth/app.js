/* setting up express */
const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');

/* this will get our environment variables in our .env file */
require('dotenv').config();

const app = express();

/* importing routes */
const quoteRoutes = require('./routes/quotes');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users')

/* setting up port & listen */
const PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
  console.log(`listening on port ${PORT}`);
});

/* setting up views */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/* setting static file */
app.use('/static', express.static(path.join(__dirname, 'public')));
/* setting up logger */
app.use(logger('dev'));
app.use(cookieParser());
/* setting up body parser */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

/* setting routes */
app.get('/', function(req, res) {
  res.render('index', {
    message: 'Hello World!',
    documentTitle: 'Ada quotes!!',
    subTitle: 'Read some of the coolest quotes around.',
    showMore: true,
    quoteAuthors: [
      'Unknown',
      'Yoda',
      'CS Lewis',
      'Frank Chimero',
      'Pablo Picasso',
      'Italo Calvino',
      'T. S. Eliot',
      'Samuel Beckett',
      'Hunter S. Thompson',
    ],
  });
});
app.use('/quotes', quoteRoutes);
app.use('/auth', authRoutes);
app.use('/user', userRoutes);

/* handling 404 */
app.get('*', function(req, res) {
  res.status(404).send({ message: 'Oops! Not found.' });
});
