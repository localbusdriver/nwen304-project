const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const userController = require('./controllers/userController');
const mongoose = require('mongoose');
const authRoutes = require('./auth');
const User = require('./models/User'); 
const ensureAuthenticated = require('./middlewares/ensureAuthenticated.js');
const path = require('path');const morgan = require('morgan');
const cors = require('cors');


require('dotenv').config();
let fetch;

// Immediately Invoked Function Expression (IIFE) to load fetch
(async () => {
  fetch = await import('node-fetch').then(module => module.default);
})();

require('dotenv').config()

//if wanna use database ise const items = await Item.find();
let items = [
    { id: 1, name: "Apple", description: "Crisp and sweet fruit", image: "/image/path_to_image1.jpg", genre: "Fruit" },
    { id: 2, name: "Orange", description: "Citrus fruit rich in vitamin C", image: "image/path_to_image2.jpg", genre: "Fruit" },
    { id: 3, name: "Umbrella", description: "Stay dry during rainy days", image: "image/path_to_umbrella.jpg", genre: "Accessory" },
    { id: 4, name: "Banana", description: "Delicious tropical fruit", image: "image/path_to_banana.jpg", genre: "Fruit" },
    { id: 5, name: "Hat", description: "Protects from sun", image: "image/path_to_hat.jpg", genre: "Accessory" },
    { id: 6, name: "Grapes", description: "Small and sweet fruit", image: "image/path_to_grapes.jpg", genre: "Fruit" },
    { id: 7, name: "Sunglasses", description: "Protects eyes from UV rays", image: "image/path_to_sunglasses.jpg", genre: "Accessory" },
    { id: 8, name: "Strawberry", description: "Red and juicy fruit", image: "image/path_to_strawberry.jpg", genre: "Fruit" },
    { id: 9, name: "Belt", description: "Holds up your pants", image: "image/path_to_belt.jpg", genre: "Accessory" },
    { id: 10, name: "Pineapple", description: "Tropical fruit with a spiky exterior", image: "image/path_to_pineapple.jpg", genre: "Fruit" }
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
app.use(cors());

// const PORT = process.env.PORT || 3000;

// const server = app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

// Named exports
module.exports = {
    app: app,
    // server: server
};
// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
}));

app.set('view engine', 'ejs');
app.set('views', [path.join(__dirname, 'views'), path.join(__dirname, 'views', 'users'), path.join(__dirname, 'views', 'products')]);
//original app.set('views', path.join(__dirname, 'views'));

app.get('/register', userController.getRegister);
app.post('/register', userController.postRegister);
app.get('/privacy-policy', userController.getPrivacyPolicy);

app.get('/', (req, res) => {
    res.render('home');  //to home.ejs
});

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
        const recommendedItems = items
        res.render('items', { items,recommendedItems });
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
     // Set the headers
     res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
     res.setHeader('Expires', new Date(Date.now() + 3600000).toUTCString()); // 1 hour from now
     res.setHeader('Last-Modified', new Date().toUTCString()); // Current server time
     
    
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

app.post('/purchase/:itemId', ensureAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.user._id);
        if (!user.purchaseHistory) {
            user.purchaseHistory = [];
        }
        user.purchaseHistory.push(req.params.itemId);
        await user.save();
        res.json({ msg: 'Item purchased' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

function countPurchases(purchaseHistory) {
    const genreCounts = {};
    for (let itemId of purchaseHistory) {
        const item = items.find(i => i.id === parseInt(itemId));
        if (item) {
            const genre = item.genre;
            if (!genreCounts[genre]) {
                genreCounts[genre] = 0;
            }
            genreCounts[genre]++;
        }
    }
    return genreCounts;
}

function getRandomItemsFromGenre(genre, count) {
    const genreItems = items.filter(item => item.genre === genre);
    const shuffled = genreItems.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

app.get('/recommended-items', ensureAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.user._id);
        
        if (!user.purchaseHistory || user.purchaseHistory.length === 0) {
            return res.render('items', { items: [], recommendedItems: [] }); 
        }

        const genreCounts = countPurchases(user.purchaseHistory);
        
        // Get most purchased genre
        const mostPurchasedGenre = Object.keys(genreCounts).reduce((a, b) => genreCounts[a] > genreCounts[b] ? a : b);

        // Obtain 5 random items from the most purchased genre
        const recommendedItems = getRandomItemsFromGenre(mostPurchasedGenre, 5);

        res.render('items', { items: items, recommendedItems: recommendedItems });

    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

app.get('/api/weather', async (req, res) => {
    const apiKey = '370ec73325035f836a6cdbcc22ec3181';
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Tokyo&appid=${apiKey}`);
    const data = await response.json();
    res.json({ temp: data.main.temp });
});

app.get('/api/news', async (req, res) => {
    const apiKey = 'ec7fa3239492418fb269d22f9f96ef59';
    const response = await fetch(`https://newsapi.org/v2/top-headlines?country=jp&apiKey=${apiKey}`);
    const data = await response.json();
    res.json(data.articles);
});

app.use(express.static(path.join(__dirname, 'public')));


app.use(morgan('tiny'));