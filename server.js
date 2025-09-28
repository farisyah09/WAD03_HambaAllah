const express = require('express');
const app = express();
const PORT = 3000;


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
app.use('/carts', cartRoutes);




app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>');
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});