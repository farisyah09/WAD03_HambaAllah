const { Sequelize } = require('sequelize');
const Usermodel = require('./models/userModel');

// Inisialisasi Sequelize dengan koneksi ke database PostgreSQL`
const sequelize = new Sequelize('postgres://postgres:postgres@localhost:5432/wad03_hambaallah');

// register models
const User = Usermodel(sequelize);
const Product = Usermodel(sequelize);
const Cart = Usermodel(sequelize);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.User = User;
db.Product = Product;
db.Cart = Cart;

module.exports = db;