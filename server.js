const express = require('express');
const app = express();
const PORT = 3000;
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname') 

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

try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});