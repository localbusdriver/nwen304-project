function ensureAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    } else {
        res.status(401).send('Please log in first to use these operations.');
    }
}

module.exports = ensureAuthenticated;
