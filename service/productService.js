const productRepository = require('../repository/productRepository');
const userRepository = require('../repository/userRepository');

// FUNGSI BANTU: Membuat slug dari nama produk
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") 
    .replace(/[^\w\-]+/g, "") 
    .replace(/\-\-+/g, "-"); 
}

// FUNGSI BARU: Membuat ID produk otomatis (P001, dll.)
const generateNewProductId = async (ownerUsername) => {
    const ownerPrefix = ownerUsername.substring(0, 2).toUpperCase();

    const maxId = await productRepository.findMaxIdByOwnerPrefix(ownerPrefix);

    let nextNumber = 1;
    if (maxId) {
        const numberString = maxId.substring(ownerPrefix.length); 
        nextNumber = parseInt(numberString) + 1;
    }

    const formattedNumber = nextNumber.toString().padStart(3, '0');

    return `${ownerPrefix}${formattedNumber}`;
};

const throwConflictError = (message) => {
  const error = new Error(message);
  error.name = 'ProductConflictError'; 
  throw error;
};

const createNewProduct = async (productData) => { // PERBAIKAN: Menambah ASYNC
  const { productName, category, price, owner } = productData;
  
  // Validasi Input telah dipindahkan ke Controller
  /*
  if (!productName || !category || !price || !owner) {
    throw new Error("Semua field harus diisi!");
  }
  */

  const user = await userRepository.findByUsername(owner); // PERBAIKAN: Menambah AWAIT
  if (!user) {
    const error = new Error("Owner tidak ditemukan.");
    error.name = 'NotFoundError'; 
    throw error;
  }
  
  
  const slug = slugify(productName);
  const productExists = await productRepository.findBySlug(slug); // PERBAIKAN: Menambah AWAIT
  
  if (productExists) {
    throwConflictError("Produk dengan nama ini sudah ada.");
  }

  // PERBAIKAN: Generate ID baru
  const newId = await generateNewProductId(owner);

  // PERBAIKAN: Menambahkan ID dan mengubah productName -> name
  const newProduct = { 
      id: newId, 
      name: productName, 
      slug: slug, 
      category: category, 
      price: price, 
      owner: owner 
  };
  return await productRepository.save(newProduct); // PERBAIKAN: Menambah AWAIT
};

const getAllProducts = async () => { // PERBAIKAN: Menambah ASYNC
  return await productRepository.findAll();
};

const getProductBySlug = async (productName) => { // PERBAIKAN: Menambah ASYNC
  const slugParam = slugify(productName);
  
  const product = await productRepository.findBySlug(slugParam);
  return product || null; 
};

module.exports = {
  createNewProduct,
  getAllProducts,
  getProductBySlug
};