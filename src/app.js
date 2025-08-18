const express = require('express');
const path = require('path');

const ejsMate = require('ejs-mate');
const flash = require('connect-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');

const isLoggedIn = require('./middleware/authMiddleware');

require('dotenv').config(); 
const app = express();

const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const searchRoutes = require('./routes/searchRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(methodOverride('_method'));
app.use(flash());

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 1000 * 60 * 60 * 24
}

}));

app.use((req, res, next) => {
  res.locals.username = req.session.username;
  res.locals.userProfile = req.session.userProfile;
  res.locals.userID = req.session.userID;
  res.locals.alerts = req.flash('alert');
  next();
});

app.use('/auth', authRoutes);
app.use('/profile', isLoggedIn, profileRoutes);
app.use('/search', isLoggedIn, searchRoutes);
app.use('/categories', isLoggedIn, categoryRoutes);

app.get('/about', isLoggedIn, (req, res)=>{
  res.render('about');
})

app.get('/', (req, res)=>{
  res.redirect('/categories');
})

app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found."));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Some Error Occured" } = err;
  res.status(statusCode).render('err', {err});
});

module.exports =  app;