[const fs = require('fs');
const path = require('path');

// Menentukan lokasi file data di folder yang sama (Repository)
const productFilePath = path.join(__dirname, 'productRepository.json');

// Helper I/O: Membaca dan men-parse data dari file JSON
const readProducts = () => {
  try {
    // Membaca konten file secara sinkron sebagai string
    const data = fs.readFileSync(productFilePath, 'utf-8');
    // Mengubah string JSON menjadi array/objek JavaScript
    return JSON.parse(data);
  } catch (error) {
    // Menangani error jika file belum ada (ENOENT) atau rusak/kosong
    if (error.code === 'ENOENT' || error.message.includes('Unexpected end of JSON input')) {
      // Mengembalikan array kosong agar aplikasi bisa memulai dengan data awal
      return [];
    }
    throw error; // Melemparkan error lainnya (mis. permission)
  }
}

// Helper I/O: Menulis data ke file JSON
const writeProducts = (data) => {
  // Mengubah objek JavaScript menjadi string JSON dengan format yang rapi (indentasi 2)
  fs.writeFileSync(productFilePath, JSON.stringify(data, null, 2));
}

// =================================================================
// PUBLIC REPOSITORY METHODS (API Data untuk Service)
// =================================================================

// Mengambil semua data produk
const findAll = () => {
  return readProducts();
};

// Mencari satu produk berdasarkan slug
const findBySlug = (slug) => {
  const products = readProducts();
  // Melakukan filtering di memori (cara yang benar untuk data berbasis file)
  return products.find(p => p.slug === slug);
};

// Menyimpan produk baru
const save = (newProduct) => {
  // Baca data lama
  const products = readProducts();
  // Tambahkan objek baru
  products.push(newProduct);
  // Tulis data yang sudah diperbarui
  writeProducts(products);
  // Mengembalikan objek yang disimpan
  return newProduct;
};

// Mengekspor fungsi-fungsi publik sebagai interface Repository
module.exports = {
  findAll,
  findBySlug,
  save
};]