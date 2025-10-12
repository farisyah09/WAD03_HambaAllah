const productService = require('../service/productService');

exports.createProduct = async (req, res) => {
  try {
    const newProduct = await productService.createNewProduct(req.body);

    // 201 Created
    res.status(201).json({
      message: "Produk berhasil dibuat",
      data: newProduct
    });

  } catch (err) {
  // Logika HTTP: Menentukan Status Code berdasarkan Tipe Error
    let statusCode = 400; // Default: 400 Bad Request

    if (err.name === 'NotFoundError') {
      statusCode = 404;
    } else if (err.name === 'ProductConflictError') {
      statusCode = 409;
    }
    // Catatan: 403 dan 401 ditangani langsung oleh Middleware
    
    res.status(statusCode).json({ 
      error: err.message 
    });
  }
};

exports.getAllProducts = async (req, res) => {
  const products = await productService.getAllProducts();
  // 200 OK
  res.status(200).json(products);
};

exports.getProductByName = async (req, res) => {
  const { product_name } = req.params;
  const product = await productService.getProductBySlug(product_name);

  // Kalau service mengembalikan null, respons 404 Not Found
  if (!product) {
    return res.status(404).json({ 
      error: 'Produk tidak ditemukan.' 
    });
  }

  // 200 OK
  res.status(200).json(product);
};



