const productRepository = require('../repository/productRepository');
const userRepository = require('../repository/userRepository');

// Helper untuk bikin slug otomatis
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") 
    .replace(/[^\w\-]+/g, "") 
    .replace(/\-\-+/g, "-"); 
}

// Fungsi helper untuk melempar error konflik (DRY)
const throwConflictError = (message) => {
  const error = new Error(message);
  error.name = 'ProductConflictError'; // Custom name untuk 409
  throw error;
};

const createNewProduct = (productData) => {
  const { productName, category, price, owner } = productData;
  
  // 1. Validasi Input
  if (!productName || !category || !price || !owner) {
    throw new Error("Semua field harus diisi!"); // Error standar untuk 400
  }

  // 2. Cek Owner (hanya cek eksistensi, role checking sudah di Middleware)
  const user = userRepository.findByUsername(owner);
  if (!user) {
    const error = new Error("Owner tidak ditemukan.");
    error.name = 'NotFoundError'; // Custom name untuk 404
    throw error;
  }
  
  // 3. Generate Slug dan Cek Unik
  const slug = slugify(productName);
  const productExists = productRepository.findBySlug(slug);
  
  if (productExists) {
    throwConflictError("Produk dengan nama ini sudah ada.");
  }

  // 4. Simpan Data
  const newProduct = { productName, slug, category, price, owner };
  return productRepository.save(newProduct);
};

const getAllProducts = () => {
  return productRepository.findAll();
};

const getProductBySlug = (productName) => {
  const slugParam = slugify(productName);
  
  const product = productRepository.findBySlug(slugParam);
  return product || null; 
};

module.exports = {
  createNewProduct,
  getAllProducts,
  getProductBySlug
};
