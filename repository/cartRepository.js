const fs = require('fs');
const path = require('path');
const {Cart} = require('../database'); // Import model Cart dari database.js

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

// Mencari Cart berdasarkan username: Mengambil array item untuk username tersebut
const findByUsername = (username) => {
  const Carts = readCarts();
  // Mengembalikan array item keranjang (atau undefined jika username tidak ada)
  return Carts[username]; 
};

// Menambahkan atau memperbarui item di keranjang
const saveItem = (newItem) => {
  const { username, productId } = newItem;
  let { quantity } = newItem;

  // pastikan quantity berupa number
  quantity = parseInt(quantity, 10);

  const carts = readCarts(); // ambil data lama

  if (!carts[username]) {
      // Jika user belum punya keranjang, buat array kosong untuknya
      carts[username] = []; 
  }

  // 🔹 cek apakah produk sudah ada di keranjang user
  const cartItems = carts[username];
  const existingItem = cartItems.find(item => item.productId === productId);

  if (existingItem) {
    // 1. Kalau sudah ada, tambahkan quantity
    existingItem.quantity += quantity;
    writeCarts(carts); // simpan hasil update
    // Mengembalikan item yang diperbarui
    return existingItem; 
  }

  // 2. Kalau belum ada, tambahkan item baru ke array keranjang user
  cartItems.push(newItem); 
  writeCarts(carts);
  // Mengembalikan item baru
  return newItem; 
};


// Menghapus item dari keranjang (Logika Remove Cart)
const deleteItem = (username, productId) => { 
    const carts = readCarts(); 
    const cartItems = carts[username]; // Ambil array item untuk user

    if (!cartItems) return false; // Keranjang user tidak ada

    const initialLength = cartItems.length;
    
    // Filter item yang tidak sesuai dengan productId
    carts[username] = cartItems.filter(item => item.productId !== productId);
    
    writeCarts(carts); 
    
    // Mengembalikan true jika panjang array berkurang (item berhasil dihapus)
    return carts[username].length < initialLength;
};

// Mengekspor fungsi-fungsi publik
module.exports = {
    findByUsername,
    saveItem,
    deleteItem
};