const cartController = require('../controller/cartController');
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

exports.getCart = async (req, res) => {
    try {
        const { username } = req.params; 
        const cart = await cartService.get(username); 

        if (!cart) {
            return res.status(404).json({ 
                success: false, 
                message: `Shopping cart for user ${username} not found.` 
            }); 
        }
    
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

exports.addItemToCart = async (req, res) => {
    try {
        const { username } = req.params;
        const { productId, quantity } = req.body; 

        if (!productId || !quantity) {
             return res.status(400).json({ 
                success: false, 
                message: 'Product ID and quantity are required.' 
            }); 
        }

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