const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    const name = req.query.name || 'stranger'; 
    const now = new Date();
    const hour = now.getHours();
    const day = now.toLocaleDateString('en-US', { weekday: 'long' });

    let greeting = '';
    if (hour < 12) {
        greeting = 'Good morning';
    } else if (hour < 18) {
        greeting = 'Good afternoon';
    } else {
        greeting = 'Good evening';
    }

    res.send(`${greeting}, ${name}! Today is ${day}.`);
});

module.exports = router;