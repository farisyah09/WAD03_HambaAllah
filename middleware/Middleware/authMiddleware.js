const userRepository = require('../repository/userRepository');

exports.isSeller = (req, res, next) => {
  // Ambil 'owner' dari body request
  // Asumsi: nilai 'owner' adalah username user yang sedang "login".
  const { owner } = req.body; 
  
  // Jika tidak ada owner (body kosong), lewati saja agar error 400 ditangani Service/Controller
  if (!owner) {
    req.user = null; // Pastikan req.user null
    return next();
  }
  
  // Cari data user di Repository berdasarkan username (owner)
  const user = userRepository.findByUsername(owner);
  
  if (user) {
    // 3. Menyimpan data user ke req.user (Termasuk 'role')
    // Inilah yang membuat middleware authorizeRole bisa bekerja
    req.user = user; 
  } else {
    // Jika user tidak ditemukan, set req.user ke null
    req.user = null;
    return next();
  }

  // NOTE: Asumsi req.user sudah ada dan diisi oleh middleware autentikasi
  if (!req.user || !req.user.role) {
    // 401 Unauthorized (belum login)
    return res.status(401).json({ message: 'Anda harus login untuk mengakses sumber daya ini.' });
  }
  
  // Pengecekan Peran (Otorisasi)
  if (req.user.role === 'seller') {
    next(); // Lolos, lanjutkan ke Controller
  } else {
    // 403 Forbidden (login, tapi peran tidak diizinkan)
    return res.status(403).json({ message: 'Akses terlarang. Hanya Seller yang bisa menambah produk.' });
  }

};

/**
 * Middleware Otorisasi Khusus Buyer
 */
exports.isBuyer = (req, res, next) => {
  // Ambil username dari URL (misal: /carts/helmi99/add -> 'helmi99')
  const owner = req.params.username; 
  
  // Jika tidak ada username di URL, tolak langsung
  if (!owner) {
    return res.status(400).json({ message: 'URL tidak valid. Username pemilik keranjang diperlukan.' });
  }
  
  // Cari data user di Repository berdasarkan username
  const user = userRepository.findByUsername(owner);
  
  if (!user) {
    // Jika user di URL tidak ditemukan, tolak
    return res.status(401).json({ message: 'Akses ditolak. User tidak terdaftar.' });
  }

  // 1. Menyimpan data user ke req.user (Termasuk 'role')
  req.user = user; 
  
  // 2. Pengecekan Peran (Otorisasi)
  if (req.user.role === 'buyer') {
    next(); // Lolos, lanjutkan ke Controller
  } else {
    // 403 Forbidden
    return res.status(403).json({ message: 'Akses terlarang. Hanya Buyer yang bisa memodifikasi keranjang.' });
  }

};