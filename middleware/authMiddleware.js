const userRepository = require('../repository/userRepository');

exports.isSeller = async (req, res, next) => {
  const { owner } = req.body; 
  
  
  if (!owner) {
    req.user = null; 
    return next();
  }
  
  // PERBAIKAN: Menambah AWAIT
  const user = await userRepository.findByUsername(owner);
  
  if (user) {

    req.user = user; 
  } else {

    req.user = null;
    return next();
  }


  if (!req.user || !req.user.role) {

    return res.status(401).json({ message: 'Anda harus login untuk mengakses sumber daya ini.' });
  }
  

  if (req.user.role === 'seller') {
    next(); 
  } else {

    return res.status(403).json({ message: 'Akses terlarang. Hanya Seller yang bisa menambah produk.' });
  }

};

exports.isBuyer = async (req, res, next) => {
  const owner = req.params.username; 
  

  if (!owner) {
    return res.status(400).json({ message: 'URL tidak valid. Username pemilik keranjang diperlukan.' });
  }
  
  // PERBAIKAN: Menambah AWAIT
  const user = await userRepository.findByUsername(owner);
  

  if (!user) {

    return res.status(401).json({ message: 'Akses ditolak. User tidak terdaftar.' });
  }


  req.user = user; 
  

  if (req.user.role === 'buyer') {
    next(); 
  } else {

    return res.status(403).json({ message: 'Akses terlarang. Hanya Buyer yang bisa memodifikasi keranjang.' });
  }

};