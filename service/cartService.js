const cartRepository = require('../repository/cartRepository');
const productRepository = require('../repository/productRepository'); 

// --- Custom Errors ---
// Menggunakan 'NotFoundError' agar konsisten dengan gaya ProductController/Service
class ProductNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NotFoundError'; // Custom name untuk 404 Not Found
    }
}
class CartItemNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NotFoundError'; // Custom name untuk 404 Not Found
    }
}

// 1. ADD ITEM TO CART (ASYNC karena memanggil productRepository)
const addItemToCart = async (username, productId, quantity) => {
    // 1. Validasi Input (Gaya Product Service)
    if (!username || !productId || !quantity || quantity <= 0) {
        throw new Error('Username, Product ID, dan kuantitas yang valid harus disediakan.'); // Error standar untuk 400
    }

    // 2. Cek Produk (ASUMSI: productRepository.findBySlug ASYNC)
    const product = await productRepository.findBySlug(productId); 
    if (!product) {
        // Melempar error dengan name: 'NotFoundError'
        throw new ProductNotFoundError(`Produk dengan ID ${productId} tidak ditemukan.`);
    }
    
    // 3. Simpan Data (cartRepository SINKRON)
    return cartRepository.saveItem(username, productId, quantity); 
};

// 2. GET CART ITEMS (SINKRON)
const getCartItems = (username) => {
    // 1. Validasi Input
    if (!username) {
        throw new Error('Username harus disediakan.');
    }
    // 2. Ambil Data
    return cartRepository.findByUsername(username); 
};

// 3. REMOVE ITEM FROM CART (SINKRON)
const removeItemFromCart = (username, productId) => { 
    // 1. Validasi Input
    if (!username || !productId) {
        throw new Error('Username dan Product ID harus disediakan.');
    }

    // 2. Hapus Item
    const wasDeleted = cartRepository.deleteItem(username, productId);

    if (!wasDeleted) {
        // Melempar error dengan name: 'NotFoundError'
        throw new CartItemNotFoundError(`Produk ID ${productId} tidak ditemukan di keranjang.`);
    }
};

// ✅ Sesuai Gaya Produk: Menggunakan module.exports di akhir
module.exports = {
    addItemToCart,
    getCartItems,
    removeItemFromCart,
    // Ekspor Class Errors agar bisa diakses di Controller
    ProductNotFoundError,
    CartItemNotFoundError
};