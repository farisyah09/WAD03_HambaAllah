const express = require('express');
const app = express();
const PORT = 3000;

// Import routes
const aboutUsRoute = require('./routes/aboutUsRoute');
const greetingRoutes = require('./routes/greetingRoutes');

// Use routes
app.use('/aboutus', aboutUsRoute);
app.use('/greeting', greetingRoutes);
// Base route
app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});