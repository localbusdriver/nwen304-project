const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');


const app = express();
app.use(bodyParser.json());
// route to products
app.use('/products', (req, res) => {
    const productServiceURL = req.url.replace('/products', '/items');
    axios({
        method: req.method,
        url: `http://localhost:3003${productServiceURL}`,
        data: req.body
    })
    .then(response => {
        res.send(response.data);
    })
    .catch(error => {
        res.status(500).send(error.message);
    });
});

//route to users
app.use('/users', (req, res) => {
    axios({
        method: req.method,
        url: `http://localhost:3005${req.url}`,
        data: req.body
    })
    .then(response => {
        res.send(response.data);
    })
    .catch(error => {
        res.status(500).send(error.message);
    });
});

// const PORT = 3001;
// app.listen(PORT, () => {
//     console.log(`API Gateway is running on port ${PORT}`);
// });
