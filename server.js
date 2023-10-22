const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const userController = require('./controllers/userController');
const mongoose = require('mongoose');
const authRoutes = require('./auth'); 
const ensureAuthenticated = require('./middlewares/ensureAuthenticated.js');

const path = require('path');
const Item = require('./models/Item');
const User = require('./models/User');


//if wanna use database ise const items = await Item.find();
let items = [
    { id: 1, name: "Apple", description: "Description for Item 1", image: "path_to_image1.jpg" },
    { id: 2, name: "Orange", description: "Description for Item 2", image: "path_to_image2.jpg" },
];

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

// Middle ware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

app.set('view engine', 'ejs');
app.set('views', [path.join(__dirname, 'views'), path.join(__dirname, 'views', 'users'), path.join(__dirname, 'views', 'products')]);
//original app.set('views', path.join(__dirname, 'views'));

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
//Display password reset page
app.get('/reset-password', userController.getResetPassword);

//Process password reset request
app.post('/reset-password', userController.postResetPassword);

//Use token to display password set page
app.get('/reset/:token', userController.getNewPassword);

//set the new password
app.post('/new-password', userController.postNewPassword);
app.use('/', authRoutes);
app.get('/items', async (req, res) => {
    try {
        res.render('items', { items });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});
app.get('/item/:itemId', (req, res) => {
    const item = items.find(i => i.id === parseInt(req.params.itemId));
    if (!item) {
        return res.status(404).send('Item not found');
    }
    res.json(item);
});
app.put('/item/:itemId', ensureAuthenticated, (req, res) => {
    const item = items.find(i => i.id === parseInt(req.params.itemId));
    if (!item) {
        return res.status(404).send('Item not found');
    }

    item.name = req.body.name || item.name;
    item.description = req.body.description || item.description;
    item.image = req.body.image || item.image;

    res.json(item);
});

app.delete('/item/:itemId', ensureAuthenticated, (req, res) => {
    const itemIndex = items.findIndex(i => i.id === parseInt(req.params.itemId));
    if (itemIndex === -1) {
        return res.status(404).send('Item not found');
    }

    items.splice(itemIndex, 1);
    res.json({ msg: 'Item deleted' });
});

app.post('/item', ensureAuthenticated, (req, res) => {
    const newItem = {
        id: items.length + 1, 
        name: req.body.name,
        description: req.body.description,
        image: req.body.image
    };
    items.push(newItem);
    res.json(newItem);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
