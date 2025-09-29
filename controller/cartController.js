// controller/cartController.js

// Import data statis dari layer Controller lain untuk Validasi
// PERBAIKAN: Menggunakan users.json (ASUMSI NAMA FILE) dan product.json
// PERBAIKAN AKHIR: Menggunakan users.json dan products.json (ASUMSI NAMA FILE JAMAK)
const userData = require('./user.json'); 
const productData = require('./product.json'); 

// In-Memory Storage untuk keranjang belanja (sesuai ekspektasi data hilang saat restart)
const carts = {}; 

const cartService = {
    get: (username) => {
        if (!carts[username]) {
            carts[username] = [];
        }
        return { username, items: carts[username] };
    }, 

    add: (username, productId, quantity) => {
        if (!carts[username]) {
            carts[username] = [];
        }
        
        const existingItem = carts[username].find(item => item.productId === productId);

        if (existingItem) {
            existingItem.quantity += parseInt(quantity);
        } else {
            carts[username].push({ productId, quantity: parseInt(quantity) });
        }

        return { username, items: carts[username] };
    }, 

    remove: (username, productId) => {
        if (!carts[username]) {
            return { username, items: [] }; 
        }

        carts[username] = carts[username].filter(item => item.productId !== productId);
        
        return { username, items: carts[username] };
    }
}; 

// =========================================================
// 1. Controller untuk GET /carts/:username (DITAMBAH VALIDASI USER)
// =========================================================
exports.getCart = async (req, res) => {
    try {
        const { username } = req.params; 
        
        // --- VALIDASI USER (Integrasi dengan users.json) ---
        const userExists = userData.find(user => user.username === username);
        if (!userExists) {
            return res.status(404).json({
                success: false, 
                message: `User '${username}' not found in user database.`
            });
        }
        // -------------------------------------------------

        const cart = await cartService.get(username); 
        
        return res.status(200).json({ 
            success: true, 
            data: cart 
        });

    } catch (err) {
        return res.status(500).json({ 
            success: false, 
            error: err.message, 
            message: 'Internal Server Error fetching cart.' 
        });
    }
};

// =========================================================
// 2. Controller untuk POST /carts/:username/add (DITAMBAH VALIDASI USER & PRODUCT)
// =========================================================
exports.addItemToCart = async (req, res) => {
    try {
        const { username } = req.params;
        const { productId, quantity } = req.body; 
        
        // --- VALIDASI INPUT DASAR ---
        if (!productId || !quantity) {
             return res.status(400).json({ 
                success: false, 
                message: 'Product ID and quantity are required.' 
            }); 
        }
        
        // --- VALIDASI USER (Integrasi) ---
        const userExists = userData.find(user => user.username === username);
        if (!userExists) {
            return res.status(404).json({
                success: false, 
                message: `User '${username}' not found in user database.`
            });
        }
        
        // --- VALIDASI PRODUCT (Integrasi) ---
        const productExists = productData.find(product => product.product_name === productId);
        if (!productExists) {
            return res.status(404).json({
                success: false, 
                message: `Product ID '${productId}' not found in product catalog.`
            });
        }
        // -------------------------------------------------

        const updatedCart = await cartService.add(username, productId, quantity);

        return res.status(201).json({ 
            success: true, 
            message: 'Item added to cart successfully.', 
            data: updatedCart 
        });

    } catch (err) {
        return res.status(500).json({ 
            success: false, 
            error: err.message, 
            message: 'Internal Server Error adding item.' 
        });
    }
};


// =========================================================
// 3. Controller untuk POST /carts/:username/remove
// =========================================================
exports.removeItemFromCart = async (req, res) => {
    try {
        const { username } = req.params;
        const { productId } = req.body;

        if (!productId) {
             return res.status(400).json({ 
                success: false, 
                message: 'Product ID is required for removal.' 
            });
        }
        
        const updatedCart = await cartService.remove(username, productId);

        return res.status(200).json({ 
            success: true, 
            message: 'Item removed from cart successfully.', 
            data: updatedCart 
        });

    } catch (err) {
        return res.status(500).json({ 
            success: false, 
            error: err.message, 
            message: 'Internal Server Error removing item.' 
        });
    }
};