const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const userController = require('./controllers/userController');
const mongoose = require('mongoose');
const authRoutes = require('./auth'); 

mongoose.connect('mongodb://localhost:27017/userinfo', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const app = express();

// Middle ware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

app.set('view engine', 'ejs');

app.get('/register', userController.getRegister);
app.post('/register', userController.postRegister);
app.get('/', (req, res) => {
    res.send('Welcome to our Page!');
});

console.log("getLogin:", userController.getLogin);

app.get('/login', userController.getLogin);
app.post('/login', userController.postLogin);
app.post('/logout', userController.postLogout);
app.get('/member', userController.getMemberPage);
app.use('/', authRoutes);


const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


