const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 7000;

// Middleware
app.use(cors());
app.use(express.json());

// Load contacts from db.json
const contactsPath = path.join(__dirname, 'db.json');

app.get('/contacts', (req, res) => {
    fs.readFile(contactsPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read contacts' });
        }
        res.json(JSON.parse(data));
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
