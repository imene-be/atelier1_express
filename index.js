const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Sample data
let items = [
    { id: 1, name: 'JavaScript Course', category: 'JS', price: 99.99 },
    { id: 2, name: 'Python Course', category: 'Python', price: 89.99 },
    { id: 3, name: 'Node.js Course', category: 'JS', price: 79.99 }
];

// GET all items with optional filtering and limit
app.get('/items', (req, res) => {
    let result = [...items];
    
    // Apply category filter if provided
    if (req.query.category) {
        result = result.filter(item => 
            item.category.toLowerCase() === req.query.category.toLowerCase()
        );
    }
    
    // Apply limit if provided
    if (req.query.limit) {
        const limit = parseInt(req.query.limit);
        if (!isNaN(limit) && limit > 0) {
            result = result.slice(0, limit);
        }
    }
    
    res.json(result);
});

// GET item by ID
app.get('/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const item = items.find(item => item.id === id);
    
    if (!item) {
        return res.status(404).json({ error: 'Item not found' });
    }
    
    res.json(item);
});

// POST new item
app.post('/items', (req, res) => {
    // Validate request body
    if (!req.body || !req.body.name || !req.body.category || !req.body.price) {
        return res.status(400).json({ error: 'Invalid request body. Required fields: name, category, price' });
    }
    
    const newItem = {
        id: items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1,
        name: req.body.name,
        category: req.body.category,
        price: req.body.price
    };
    
    items.push(newItem);
    res.status(201).json(newItem);
});

// DELETE item
app.delete('/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = items.findIndex(item => item.id === id);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Item not found' });
    }
    
    items.splice(index, 1);
    res.status(200).json({ message: 'Item deleted successfully' });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});