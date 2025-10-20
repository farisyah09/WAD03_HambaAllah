const userRepository = require('../repository/userRepository');

const throwConflictError = (message) => {
    const error = new Error(message);
    error.name = 'UsernameConflictError'; 
    throw error;
};

// FUNGSI BARU: Membuat ID user otomatis (U001, U002, dst)
const generateNewUserId = async () => {
    const prefix = 'U';

    const maxId = await userRepository.findMaxId();

    let nextNumber = 1;
    if (maxId) {
        const numberString = maxId.substring(prefix.length); 
        nextNumber = parseInt(numberString) + 1;
    }

    const formattedNumber = nextNumber.toString().padStart(3, '0');

    return `${prefix}${formattedNumber}`;
};


const createNewUser = async (userData) => { 
    const { username, name, email, role } = userData;
    
    // Validasi Input telah dipindahkan ke Controller

    const existingUser = await userRepository.findByUsername(username); 
    if (existingUser) {
        throwConflictError('Username sudah digunakan');
    }

    const existingEmail = await userRepository.findByEmail(email); 
    if (existingEmail) {
        throwConflictError('Email sudah digunakan, anda hanya bisa membuat satu akun');
    }

    // PERBAIKAN: Generate ID baru
    const newId = await generateNewUserId();

    // PERBAIKAN: Menambahkan ID ke objek newUser
    const newUser = { id: newId, username, name, email, role };
    return await userRepository.save(newUser); 
};

const getAllUsers = async () => { 
    return await userRepository.findAll(); 
};

const getUserByUsername = async (username) => { 
    const user = await userRepository.findByUsername(username);
    
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