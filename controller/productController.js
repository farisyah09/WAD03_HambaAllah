const fs = require("fs");
const path = require("path");

const productFilePath = path.join(__dirname, "product.json");
const userFilePath = path.join(__dirname, "user.json");

// Helper untuk baca products
function readProducts() {
  const data = fs.readFileSync(productFilePath);
  return JSON.parse(data);
}

// Helper untuk tulis products
function writeProducts(data) {
  fs.writeFileSync(productFilePath, JSON.stringify(data, null, 2));
}

// Helper untuk baca users
function readUsers() {
  const data = fs.readFileSync(userFilePath);
  return JSON.parse(data);
}

// Helper untuk bikin slug otomatis
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")       // ganti spasi dengan -
    .replace(/[^\w\-]+/g, "")   // hapus karakter aneh
    .replace(/\-\-+/g, "-");    // ganti --- jadi -
}

/**
 * Endpoint: POST /products/
 * Deskripsi: Membuat produk baru (hanya Seller)
 */
exports.createProduct = (req, res) => {
  let products = readProducts();
  let users = readUsers();
  const { productName, category, price, owner } = req.body;

  // Validasi field
  if (!productName || !category || !price || !owner) {
    return res.status(400).json({ message: "Semua field harus diisi!" });
  }

  // Cek apakah owner ada di user.json
  const user = users.find(u => u.username === owner);
  if (!user) {
    return res.status(404).json({ message: "Owner (user) tidak ditemukan." });
  }

  // Hanya seller yang boleh create
  if (user.role !== "seller") {
    return res.status(403).json({ message: "Hanya Seller yang bisa menambah produk." });
  }

  // Generate slug otomatis
  const slug = slugify(productName);

  // Cek produk dengan slug unik
  if (products.some(p => p.slug === slug)) {
    return res.status(409).json({ message: "Produk dengan nama ini sudah ada." });
  }

  const newProduct = { productName, slug, category, price, owner };
  products.push(newProduct);
  writeProducts(products);

  res.status(201).json({
    message: "Produk berhasil dibuat",
    data: newProduct
  });
};

/**
 * Endpoint: GET /products/
 * Deskripsi: Menampilkan semua produk (Buyer & Seller bisa lihat)
 */
exports.getAllProducts = (req, res) => {
  let products = readProducts();
  res.status(200).json(products);
};

/**
 * Endpoint: GET /products/:product_name
 * Deskripsi: Menampilkan detail produk berdasarkan slug
 */
exports.getProductByName = (req, res) => {
  let products = readProducts();
  const { product_name } = req.params;

  // Samakan param dengan slugify biar case-insensitive
  const slugParam = slugify(product_name);

  const product = products.find(p => p.slug === slugParam);
  if (!product) {
    return res.status(404).json({ message: "Produk tidak ditemukan." });
  }

  res.status(200).json(product);
};
