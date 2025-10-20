const cartRepository = require('../repository/cartRepository');
const productRepository = require('../repository/productRepository'); 
const userRepository = require('../repository/userRepository');

class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NotFoundError'; 
    }
}

// 1. ADD ITEM TO CART
const addItemToCart = async (username, productId, quantity) => {
    // 1. Validasi Input (Dihapus)
    
    // 2. Cek Eksistensi Product (Cari berdasarkan ID)
    // Product ID dikirim di body, kita asumsikan productRepository punya findById
    const product = await productRepository.findByID(productId); 
    if (!product) {
        throw new NotFoundError(`Produk dengan ID ${productId} tidak ditemukan.`);
    }

    // 3. Cek Eksistensi User & Dapatkan User ID
    // User dicari berdasarkan username (dari params)
    const user = await userRepository.findByUsername(username); 
    if (!user) {
        throw new NotFoundError(`User ${username} tidak ditemukan.`);
    }

    // 4. Proses Simpan/Update Cart Item
    const newItemData = { 
        userId: user.id, // Menggunakan ID User (U001)
        productId: product.id, // Menggunakan ID Product (Pxx001)
        quantity: quantity
    };
    
    return await cartRepository.saveItem(newItemData);
};

// 2. GET CART ITEMS
const getCartItems = async (username) => {
    // 1. Dapatkan User ID
    const user = await userRepository.findByUsername(username); 
    if (!user) {
        throw new NotFoundError(`Keranjang untuk user ${username} tidak ditemukan.`);
    }
    
    // 2. Ambil Item Cart dari Repository
    return await cartRepository.findByUserId(user.id); 
};

// 3. REMOVE ITEM FROM CART
const removeItemFromCart = async (username, productId) => { 
    // 1. Dapatkan User ID
    const user = await userRepository.findByUsername(username); 
    if (!user) {
        throw new NotFoundError(`User ${username} tidak ditemukan.`);
    }

    // 2. Hapus Item di Repository
    const wasDeleted = await cartRepository.deleteItem(user.id, productId);

    if (wasDeleted === 0) {
        throw new NotFoundError(`Produk ID ${productId} tidak ditemukan di keranjang user ${username}.`);
    }
};

module.exports = {
    addItemToCart,
    getCartItems,
    removeItemFromCart
};