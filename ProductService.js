const express = require('express');

let items = [
    { id: 1, name: "Apple", description: "Description for Item 1", image: "path_to_image1.jpg" },
    { id: 2, name: "Orange", description: "Description for Item 2", image: "path_to_image2.jpg" },
];

const app = express();

app.get('/items', (req, res) => {
    res.json(items);
});

app.get('/item/:itemId', (req, res) => {
    const item = items.find(i => i.id === parseInt(req.params.itemId));
    if (!item) {
        return res.status(404).send('Item not found');
    }
    res.json(item);
});

app.put('/item/:itemId', (req, res) => {
    const item = items.find(i => i.id === parseInt(req.params.itemId));
    if (!item) {
        return res.status(404).send('Item not found');
    }

    item.name = req.body.name || item.name;
    item.description = req.body.description || item.description;
    item.image = req.body.image || item.image;

    res.json(item);
});

app.delete('/item/:itemId', (req, res) => {
    const itemIndex = items.findIndex(i => i.id === parseInt(req.params.itemId));
    if (itemIndex === -1) {
        return res.status(404).send('Item not found');
    }

    items.splice(itemIndex, 1);
    res.json({ msg: 'Item deleted' });
});

app.post('/item', (req, res) => {
    const newItem = {
        id: items.length + 1, 
        name: req.body.name,
        description: req.body.description,
        image: req.body.image
    };
    items.push(newItem);
    res.json(newItem);
});

// const PORT = 3003;
// app.listen(PORT, () => {
//     console.log(`ProductService is running on port ${PORT}`);
// });
