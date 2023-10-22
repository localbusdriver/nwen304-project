const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'tosshix@gmail.com',  
        pass: 'txmmihpzskfidqmy'
    }
});

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
            const errorMessages = errors.array().map(error => error.msg);
            return res.render('register', { errors: errorMessages });
        }

        try {
            const existingUser = await User.findOne({ username: req.body.username });
            if (existingUser) {
                return res.render('register', { errors: ['Username already exists'] });
            }

            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword
            });
            await newUser.save();

            req.session.user = newUser;
            res.redirect('/login');
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

        req.session.user = user;
        res.redirect('/member');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

exports.postLogout = (req, res) => {
    req.session.destroy();
    res.redirect('/login');
};

exports.getMemberPage = (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    res.render('member');
};

exports.getResetPassword = (req, res) => {
    res.render('users/reset-password');
};

exports.postResetPassword = (req, res) => {
    crypto.randomBytes(32, async (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect('/reset-password');
        }
        const token = buffer.toString('hex');
        try {
            const user = await User.findOne({ email: req.body.email });
            if (!user) {
                return res.redirect('/reset-password');
            }
            user.resetToken = token;
            user.resetTokenExpiration = Date.now() + 3600000; // 1 hour
            await user.save();

            transporter.sendMail({
                to: req.body.email,
                from: 'tosshix@gmail.com',
                subject: 'Password Reset',
                html: `
                    <p>You requested a password reset</p>
                    <p>Click this <a href="http://localhost:3001/reset/${token}">link</a> to set a new password.</p>
                `
            });
            res.redirect('/login');
        } catch (error) {
            console.error(error);
            res.status(500).send('Server error');
        }
    });
};

exports.getNewPassword = async (req, res) => {
    try {
        const user = await User.findOne({ resetToken: req.params.token, resetTokenExpiration: { $gt: Date.now() } });
        if (!user) {
            return res.redirect('/login');
        }
        res.render('users/set-new-password', { userId: user._id.toString(), passwordToken: req.params.token });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

exports.postNewPassword = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.body.userId, resetToken: req.body.passwordToken, resetTokenExpiration: { $gt: Date.now() } });
        if (!user) {
            return res.redirect('/login');
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;
        await user.save();
        res.redirect('/login');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};