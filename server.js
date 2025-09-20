const express = require('express');
const app = express();
const PORT = 3000;

// Import routes
const aboutUsRoute = require('./routes/aboutUsRoute');

// Use routes
app.use('/aboutus', aboutUsRoute);

// Base route
app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

