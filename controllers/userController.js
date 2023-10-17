const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');

exports.getRegister = (req, res) => {
    res.render('register');
};

exports.postRegister = [
    check('password').isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase character')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase character')
        .matches(/[0-9]/).withMessage('Password must contain at least one number'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const user = new User({
                username: req.body.username,
                password: hashedPassword
            });
            await user.save();

            // User registered successfully
            res.send(`
                <p>User registered successfully!<br>Redirecting to login page in 5 seconds...</p>
                <script>
                    setTimeout(function() {
                        window.location.href = "/login";
                    }, 5000);
                </script>
            `);
        } catch (error) {
            console.error(error);
            res.status(500).send('Server error');
        }
    }
];

exports.getLogin = (req, res) => {
    res.render('login');
};

exports.postLogin = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            return res.status(400).send('Invalid username or password');
        }

        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid username or password');
        }

        // Store user information in the session
        req.session.user = user;

        res.redirect('/member');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

exports.postLogout = (req, res) => {
    // Destroy the session to log out the user
    req.session.destroy();
    res.redirect('/login');
};

exports.getMemberPage = (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    res.render('member');
};

// register route controller
exports.getRegister = (req, res) => {
    res.render('register');
};

exports.postRegister = async (req, res) => {
    try {
        //Store userinfomation in database
        const existingUser = await User.findOne({ username: req.body.username });
        if (existingUser) {
            // if already existing
            return res.status(400).send('Username already exists');
        }

        // store in database as new user
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newUser = new User({
            username: req.body.username,
            password: hashedPassword
        });
        await newUser.save();

        // set the state
        req.session.user = newUser;
        res.redirect('/member'); 
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

