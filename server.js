const express = require('express');
const app = express();
const PORT = 3000;

// Middleware untuk membaca JSON dari body request // <-- TAMBAHKAN INI
// Baris ini harus ada sebelum 'app.use' untuk rute agar berfungsi dengan benar.
app.use(express.json());

// Import routes
const aboutUsRoute = require('./routes/aboutUsRoute');
const greetingRoutes = require('./routes/greetingRoutes');
const userRoutes = require('./routes/userRoute'); // <-- TAMBAHKAN INI (Sesuaikan path jika Anda meletakkannya di folder /routes)
const productRoutes = require("./routes/productRoute");

// Use routes
app.use('/aboutus', aboutUsRoute);
app.use('/greeting', greetingRoutes);
app.use('/users', userRoutes); // <-- TAMBAHKAN INI
app.use('/products', productRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});