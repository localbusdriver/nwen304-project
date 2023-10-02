const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const app = express();

const cors = require('cors');
const passport = require('passport');
const cookieSession = require('cookie-session');

app.use(
    cookieSession({
        name: 'session',
        keys: ['cyberwolve'],
        maxAge: 60 * 60 * 1000 //1 hours
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
    cors({
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST', 'ADD'],
        credentials: true,
    })
);

const MONGO_DB = process.env.MONGO_DB || '';
mongoose.connect(MONGO_DB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('Error connecting to MongoDB', err);
    });

const ItemSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    images: {
        white: String,
        blue: String,
        black: String
    }
});

const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    emailVerified: {
        type: Boolean,
        default: false
    }
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'tosshix@gmail.com',  
        pass: 'txmmihpzskfidqmy' 
    }
});

app.use(express.static('public'));

function checkLoggedIn(req, res, next) {
    if (req.session && req.session.user && req.session.user.id) {
        next();
    } else {
        res.redirect('/login.html?sessionExpired=true');
    }
}


app.get('/memberonly.html', (req, res) => {
    if (req.session && req.session.user && req.session.user.id) {
        res.sendFile(__dirname + '/public/memberonly.html');
    } else {
        res.redirect('/login.html?sessionExpired=true');
    }
});

const User = mongoose.model('User', UserSchema, 'user');
const Item = mongoose.model('Item', ItemSchema);
const session = require('express-session');

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 3600000 // 1 hour
    }
}));



app.get('/items', async (req, res) => {
    let query = {};
    
    if (req.query.name) {
        query.name = new RegExp(req.query.name, 'i');
    }

    if (req.query.minPrice) {
        query.price = { $gte: Number(req.query.minPrice) };
    }

    if (req.query.maxPrice) {
        if (query.price) {
            query.price.$lte = Number(req.query.maxPrice);
        } else {
            query.price = { $lte: Number(req.query.maxPrice) };
        }
    }

    const items = await Item.find(query);
    res.render('index', { items });
});

app.post('/add', async (req, res) => {
    const item = new Item(req.body);
    await item.save();
    res.redirect('/items');
});

app.post('/delete/:id', async (req, res) => {
    await Item.findByIdAndDelete(req.params.id);
    res.redirect('/items');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('Server is running on port ${PORT}');
});

//Create jsonbase restful service
app.get('/api/items', async (req, res) => {
    const items = await Item.find();
    res.json(items);
});

app.post('/api/add', async (req, res) => {
    const item = new Item(req.body);
    await item.save();
    res.json({ message: 'Item added' });
});

app.get('/items', async (req, res) => {
    let query = {};

    //Filter by named
    if (req.query.name) {
        query.name = new RegExp(req.query.name, 'i'); //i is for no separation between capital and small letter
    }

    //Filter by price
    if (req.query.minPrice) {
        query.price = { $gte: Number(req.query.minPrice) };  //$gte = more than
    }

    if (req.query.maxPrice) {
        if (query.price) {
            query.price.$lte = Number(req.query.maxPrice);  // $lte = less than
        } else {
            query.price = { $lte: Number(req.query.maxPrice) };
        }
    }

    const items = await Item.find(query);
    res.render('index', { items });
});

app.post('/register', async (req, res) => {
    console.log(req.body);
    const { username, email, password,confirmPassword} = req.body;

    //to see whether it maches
    if (password !== confirmPassword) {
        return res.status(400).send('Passwords do not match');
    }

    //Hash the password
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, async (err, hashedPassword) => {
        if (err) {
            return res.status(500).send('Error hashing password');
        }

        //Create new user
        const user = new User({ username, email, password: hashedPassword });
        await user.save();

        const verificationToken = jwt.sign({ userId: user._id }, 'YOUR_SECRET_KEY', { expiresIn: '1h' });

    // Send verification email
    const verificationLink = `https://nwen304-oj6vlskeja-ts.a.run.app/verify/${verificationToken}`;
    const mailOptions = {
        from: 'YOUR_GMAIL_ADDRESS',
        to: email,
        subject: 'Email Verification',
        text: `Click on this link to verify your email: ${verificationLink}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

        res.redirect('/login.html');  
    });
});

app.get('/verify/:token', async (req, res) => {
    try {
        const decoded = jwt.verify(req.params.token, 'YOUR_SECRET_KEY');
        const userId = decoded.userId;

        await User.findByIdAndUpdate(userId, { emailVerified: true });

        res.send('Email verified successfully!');
    } catch (error) {
        res.status(400).send('Invalid or expired verification link.');
    }
});


app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    //look for username
    const user = await User.findOne({ username });
    

    if (!user) {
        console.log('User not found:', username);
        return res.status(400).send('Invalid username or password');
    }
    

    //Compare password 
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return res.status(400).send('Invalid username or password');
    }

    // emailVerified field check
    if (!user.emailVerified) {
        return res.status(400).send('Email not verified');
    }

    //When succeffully logged in store in session
    req.session.user = {
        id: user._id,
        username: user.username
    };

    const redirectTo = req.query.redirect || '/memberonly.html';
    res.json({ message: 'Logged in successfully', redirectTo: redirectTo });
});


function checkLoggedIn(req, res, next) {
    if (req.session && req.session.user && req.session.user.id) {
        next();
    } else {
        res.redirect('/login.html?sessionExpired=true');
    }
}

app.post('/add-to-cart/:id', checkLoggedIn, async (req, res) => {  //This endpont is for adding cart
    const itemId = req.params.id;

    if (!req.session.cart) {
        req.session.cart = [];
    }

    req.session.cart.push(itemId);

    res.json({ success: true });
});


app.get('/is-logged-in', (req, res) => {
    if (req.session && req.session.user && req.session.user.id) {
        res.json({ loggedIn: true });
    } else {
        res.json({ loggedIn: false });
    }
});


app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login.html');
});
app.get('/some-route', (req, res) => {
    if (req.session.user) {
        //If user is logged in
        res.send('Welcome back, ' + req.session.user.username + '!');
    } else {
        //If user is not logged in
        res.send('Please login to access this page.');
    }
});
//This endpoint is to obtain ur username for memberonly page 
app.get('/get-username', (req, res) => {
    if (req.session && req.session.user) {
        res.json({ username: req.session.user.username });
    } else {
        res.json({ username: 'Guest' });
    }
});
//This endpoint is to remove item from the cart
app.post('/remove-from-cart/:id', checkLoggedIn, (req, res) => {
    const itemId = req.params.id;

    if (req.session.cart) {
        const index = req.session.cart.indexOf(itemId);
        if (index > -1) {
            req.session.cart.splice(index, 1);  //remove item from the cart
        }
    }

    res.json({ success: true });
});

app.get('/checkout', checkLoggedIn, async (req, res) => {
    //Made endpoint for checkout page
    const cartItemIds = req.session.cart || [];
    const cartItems = await Item.find({ _id: { $in: cartItemIds } });
    res.render('checkout', { cartItems });
});

app.get('/cart-status', (req, res) => {
    const user = 'sampleUser';

    const cart = getUserCart(user);
    res.json(cart);
});



// function googleSignIn(){
//     useEffect(() => {

//         function handleCredentialResponse(response) {
//             console.log(response.credential);

//             console.log
//         }
        
//         /* Global Google */
//         google.accounts.id.initialize({
//             client_id: 'YOUR_GOOGLE_CLIENT_ID',
//             callback: handleCredentialResponse
//         });

//         google.accounts.id.renderButton(
//             document.getElementById('SignInDiv'), 
//             { theme: 'outline', size: 'large' }
//             );
//         }, []);

//     return(
//         <div className="GoogleSignIn">
//         <div id="SignInDiv"></div></div>
//     )
// }
