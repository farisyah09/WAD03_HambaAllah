const cartService = require('../service/cartService');

// 1. POST Add Item To Cart
exports.addItemToCart = async (req, res) => {
    const { username } = req.params; // Sudah divalidasi oleh authMiddleware
    const { productId, quantity } = req.body;

    try {
        // PERBAIKAN: Validasi Input dipindahkan dari Service
        const parsedQuantity = parseInt(quantity, 10);
        if (!productId || isNaN(parsedQuantity) || parsedQuantity <= 0) {
            return res.status(400).json({ 
                error: 'Product ID dan kuantitas yang valid harus disediakan.' 
            });
        }
        
        // PERBAIKAN: Memanggil Service dengan AWAIT
        const cartItem = await cartService.addItemToCart(username, productId, parsedQuantity);
        
        res.status(201).json({ 
            message: 'Produk berhasil ditambahkan ke keranjang.', 
            data: cartItem 
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

// 2. GET Cart Items
exports.getCartItems = async (req, res) => { 
    const { username } = req.params;

    try {
        const cartItems = await cartService.getCartItems(username);
        
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
exports.removeItemFromCart = async (req, res) => { 
    const { username } = req.params; 
    const { productId } = req.body;

    try {
        // PERBAIKAN: Validasi Input dipindahkan dari Service
        if (!productId) {
            return res.status(400).json({ 
                error: 'Product ID harus disediakan.' 
            });
        }
        
        await cartService.removeItemFromCart(username, productId); 
        
        res.status(200).json({
            message: `Produk ID ${productId} berhasil dihapus dari keranjang ${username}.`
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