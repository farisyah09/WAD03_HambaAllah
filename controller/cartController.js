const cartService = require('../service/cartService');

// Asumsi: cartService mengekspor ProductNotFoundError dan CartItemNotFoundError

// 1. POST Add Item To Cart
exports.addItemToCart = async (req, res) => {
    const buyerUsername = req.params.username;
    const { productId, quantity } = req.body;

    try {
        const cartItem = await cartService.addItemToCart(buyerUsername, productId, quantity);
        
        // 201 Created
        res.status(201).json({ 
            message: 'Produk berhasil ditambahkan ke keranjang.', 
            data: cartItem 
        });

    } catch (err) {
        // Logika HTTP: Menentukan Status Code berdasarkan Tipe Error (Gaya Produk)
        let statusCode = 400; // Default: 400 Bad Request

        // Menganalisis Nama Error
        // Karena ProductNotFoundError dan CartItemNotFoundError di Service memiliki err.name = 'NotFoundError' (atau nama custom lain)
        // Kita petakan ke 404
        if (err.name === 'NotFoundError') {
            statusCode = 404;
        }
        // Tambahkan pengecekan untuk error lain jika ada, misal:
        // else if (err.name === 'InvalidQuantityError') { statusCode = 422; }

        res.status(statusCode).json({ 
            error: err.message 
        });
    }
};

// 2. GET Cart Items
exports.getCartItems = (req, res) => {
    const { username } = req.params;

    try {
        const cartItems = cartService.getCartItems(username);
        
        res.status(200).json(cartItems);
    } catch (err) {
        let statusCode = 400;
        
        if (err.name === 'NotFoundError') {
            statusCode = 404;
        }
        
        res.status(statusCode).json({ 
            error: err.message 
        });
    }
};

// 3. POST Remove Item From Cart
exports.removeItemFromCart = (req, res) => {
    const buyerUsername = req.params.username;
    const { productId } = req.body;

    try {
        cartService.removeItemFromCart(buyerUsername, productId); 
        
        res.status(200).json({
            message: `Produk ID ${productId} berhasil dihapus dari keranjang.`
        });

    } catch (err) {
        let statusCode = 400;
        
        if (err.name === 'NotFoundError') {
            statusCode = 404;
        }
        
        res.status(statusCode).json({ 
            error: err.message 
        });
    }
};