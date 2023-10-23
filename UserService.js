const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path'); 
const userController = require('./controllers/userController');
const authRoutes = require('./auth');

const MONGO_URL = process.env.MONGO_DB || '';

mongoose.connect(MONGO_URL, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('Error connecting to MongoDB', err);
    }
);

const app = express();

// Body Parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// CORS middleware
app.use(cors());

// Session middleware
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views/users')); 

app.get('/users/register', userController.getRegister);
app.post('/users/register', userController.postRegister);
app.get('/users/login', userController.getLogin);
app.post('/users/login', userController.postLogin);
app.post('/users/logout', userController.postLogout);
app.get('/users/member', userController.getMemberPage);
app.use('/users', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// const PORT = 3005;
// app.listen(PORT, () => {
//     console.log(`UserService is running on port ${PORT}`);
// });
