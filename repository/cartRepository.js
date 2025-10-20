const { Cart, Product, User } = require('../database');
const { Op } = require('sequelize');

// Fungsi untuk menyimpan atau mengupdate item keranjang (UPSERT)
const saveItem = async (newItem) => {
    const { userId, productId, quantity } = newItem;
    
    const existingCart = await Cart.findOne({
        where: { userId, productId }
    });

    if (existingCart) {
        existingCart.quantity += quantity;
        await existingCart.save();
        return existingCart.toJSON();
    } else {
        const newCart = await Cart.create({ userId, productId, quantity });
        return newCart.toJSON();
    }
};

// Fungsi untuk mengambil semua item keranjang user (JOIN Product)
const findByUserId = async (userId) => {
    // Eager loading (JOIN) ke tabel Product
    const cartItems = await Cart.findAll({
        where: { userId },
        include: [{ 
            model: Product, 
            as: 'Product',
            attributes: ['id', 'name', 'slug', 'category', 'price', 'owner'] 
        }],
        attributes: ['quantity', 'createdAt'] 
    });
    
    // Map hasil untuk output yang bersih
    return cartItems.map(item => {
        const itemObj = item.toJSON();
        return {
            productId: itemObj.Product.id,
            productName: itemObj.Product.name,
            category: itemObj.Product.category,
            price: itemObj.Product.price,
            owner: itemObj.Product.owner,
            quantity: itemObj.quantity,
            addedAt: itemObj.createdAt
        };
    });
};

// Fungsi untuk menghapus item keranjang
const deleteItem = async (userId, productId) => {
    const result = await Cart.destroy({
        where: { userId, productId }
    });
    return result; 
};

module.exports = {
    saveItem,
    findByUserId,
    deleteItem,
};