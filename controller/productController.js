const productService = require('../service/productService');

exports.createProduct = async (req, res) => {
  try {
    const { productName, category, price, owner } = req.body;
    
    if (!productName || !category || !price || !owner) {
        return res.status(400).json({
            error: "Semua field harus diisi!" 
        });
    }
    
    const newProduct = await productService.createNewProduct({ productName, category, price, owner });


    res.status(201).json({
      message: "Produk berhasil dibuat",
      data: newProduct
    });

  } catch (err) {
    let statusCode = 400;

    if (err.name === 'NotFoundError') {
      statusCode = 404;
    } else if (err.name === 'ProductConflictError') {
      statusCode = 409;
    }

    
    res.status(statusCode).json({ 
      error: err.message 
    });
  }
};

exports.getAllProducts = async (req, res) => {
  const products = await productService.getAllProducts();

  res.status(200).json(products);
};

exports.getProductByName = async (req, res) => {
  const { product_name } = req.params;
  const product = await productService.getProductBySlug(product_name);


  if (!product) {
    return res.status(404).json({ 
      error: 'Produk tidak ditemukan.' 
    });
  }


  res.status(200).json(product);
  

}
;

