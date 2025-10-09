const userRepository = require('../repository/userRepository');

// Fungsi helper lokal untuk melempar error konflik
const throwConflictError = (message) => {
    const error = new Error(message);
    error.name = 'UsernameConflictError'; // Tetap gunakan nama error yang sama
    throw error;
};

const createNewUser = (userData) => {
    // Logika Bisnis: Validasi Input
    const { username, name, email, role } = userData;
    if (!username || !name || !email || !role) {
        // Melempar Error standar untuk Bad Request
        throw new Error('Semua properti harus diisi');
    }

    // Logika Bisnis: Cek Konflik Username
    const existingUser = userRepository.findByUsername(username);
    if (existingUser) {
        throwConflictError('Username sudah digunakan');
    }

    // Logika Bisnis: Cek Konflik Email
    const existingEmail = userRepository.findByEmail(email);
    if (existingEmail) {
        throwConflictError('Email sudah digunakan, anda hanya bisa membuat satu akun');
    }

    // Akses Data melalui Repository
    const newUser = { username, name, email, role };
    return userRepository.save(newUser);
};

const getAllUsers = () => {
    return userRepository.findAll();
};

const getUserByUsername = (username) => {
    const user = userRepository.findByUsername(username);
    
    // Mengembalikan null jika tidak ditemukan (untuk 404)
    if (!user) {
        return null; 
    }

    return user;
};

module.exports = {
    createNewUser,
    getAllUsers,
    getUserByUsername
};