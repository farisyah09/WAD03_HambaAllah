const fs = require('fs');
const path = require('path');

// Menentukan lokasi file data di folder yang sama
const cartFilePath = path.join(__dirname, 'cartRepository.json');

// --- Helper I/O (Sinkron) ---
// Diubah dari readCartsFromFile
const readCarts = () => {
    try {
        const data = fs.readFileSync(cartFilePath, 'utf-8');
        // Catatan: Cart disimpan sebagai objek { username: [item1, item2] }, bukan array
        return JSON.parse(data); 
    } catch (error) {
        if (error.code === 'ENOENT' || error.message.includes('Unexpected end of JSON input')) {
            return {}; // Cart harus dimulai dengan objek kosong
        }
        throw error;
    }
};

// Diubah dari writeCartsToFile
const writeCarts = (data) => {
    fs.writeFileSync(cartFilePath, JSON.stringify(data, null, 2));
};

// =================================================================
// PUBLIC REPOSITORY METHODS (API Data untuk Service)
// =================================================================

// Mengambil keranjang berdasarkan username
const findByUsername = (username) => {
    const carts = readCarts(); 
    return carts[username] || [];
};

// Menambahkan atau memperbarui item di keranjang
const saveItem = (username, productId, quantity) => { 
    const carts = readCarts(); 
    
    const numericQuantity = parseInt(quantity, 10);
    
    if (isNaN(numericQuantity) || numericQuantity <= 0) {
        // Validation (idealnya ini sudah diverifikasi di Service)
        throw new Error('Kuantitas harus berupa angka positif.');
    }

    if (!carts[username]) {
        carts[username] = [];
    }

    const cart = carts[username];
    const existingItemIndex = cart.findIndex(item => item.productId === productId);

    let updatedItem;

    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += numericQuantity; 
        updatedItem = cart[existingItemIndex];
    } else {
        updatedItem = { productId, quantity: numericQuantity }; 
        cart.push(updatedItem);
    }
    
    writeCarts(carts); // Tulis kembali data
    return updatedItem;
};

// Menghapus item dari keranjang
const deleteItem = (username, productId) => { 
    const carts = readCarts(); 
    const cart = carts[username]; 
    
    if (!cart) return false; 

    const initialLength = cart.length;
    
    carts[username] = cart.filter(item => item.productId !== productId);
    
    writeCarts(carts); 
    
    return carts[username].length < initialLength;
};

// Mengekspor fungsi-fungsi publik
module.exports = {
    findByUsername,
    saveItem,
    deleteItem
};