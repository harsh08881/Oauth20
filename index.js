require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const connectDB = require('./db/db');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');



// Establish DataBase Connection
connectDB();


// Configure session middleware
app.use(session({
  secret: 'Harsh',
  resave: true,
  saveUninitialized: true,
}));



// Configure Passport
passport.use(new GoogleStrategy({
  clientID: '857542729215-6lseh2o5qolo2jbs06a6bpafrja.apps.googleusercontent.com',
  clientSecret: 'GOCSPX-JoMZtetpUfCDExG1RzXw4YuB', 
  callbackURL: 'http://localhost:3000/auth/google/callback', // Update with your callback URL
}, (accessToken, refreshToken, profile, done) => {
  // Here, you can save user profile data to your database or perform other actions
  return done(null, profile);
}));


passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});


app.use(passport.initialize());
app.use(passport.session());

// Define your routes
app.get('/', (req, res) => {
  res.send('<a href="/auth/google">Sign in with Google</a>');
});

app.get('/auth/google', passport.authenticate('google', {
  scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
}));

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  // Successful authentication
  res.redirect('/profile');
});

app.get('/profile', (req, res) => {
  // Access user profile data using req.user
  res.send(`Welcome, ${req.user.displayName}!`);
});







// app.get('/', (req, res) => {
//     res.send('Hello World!')
//   })




const port =process.env.PORT || 3000;
app.listen(port, console.log(`Listening on port`));