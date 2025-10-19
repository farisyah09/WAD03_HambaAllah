const express = require('express');
const app = express();
const PORT = 3000;

// inisialisasi database
const db = require('./database');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const aboutUsRoute = require('./routes/aboutUsRoute');
const greetingRoutes = require('./routes/greetingRoutes');
const userRoutes = require('./routes/userRoute');
const productRoutes = require("./routes/productRoute");
const cartRoutes = require('./routes/cartRoute');

app.use('/aboutus', aboutUsRoute);
app.use('/greeting', greetingRoutes);
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);




app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>');
});

(async () => {
  try {
    await db.sequelize.authenticate();
    console.log('Connection has been established successfully.');

    await db.sequelize.sync({ alter: true });
    console.log("Tables have been synchronized.");

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Database connection failed:', err);
  }
})(); // Panggil fungsi untuk memulai server
