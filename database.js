const { Sequelize } = require('sequelize');
const Usermodel = require('./models/userModel');
const Productmodel = require('./models/productModel');
const Cartmodel = require('./models/cartModel');

// Inisialisasi Sequelize dengan koneksi ke database PostgreSQL`
const sequelize = new Sequelize('postgres://postgres:postgres@localhost:5432/wad03_hambaallah');

// register models
const User = Usermodel(sequelize);
const Product = Productmodel(sequelize);
const Cart = Cartmodel(sequelize);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.User = User;
db.Product = Product;
db.Cart = Cart;

module.exports = db;