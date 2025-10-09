const fs = require('fs');
const path = require('path');

// Ubah path ke lokasi file Anda
const usersFilePath = path.join(__dirname, 'userRepository.json'); 

const readUsers = () => {
    try {
        const usersData = fs.readFileSync(usersFilePath, 'utf-8');
        return JSON.parse(usersData);
    } catch (error) {
        // Jika file tidak ada atau rusak, kembalikan array kosong
        if (error.code === 'ENOENT' || error.message.includes('Unexpected end of JSON input')) {
            return [];
        }
        throw error;
    }
};

const writeUsers = (users) => {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

const findAll = () => {
    return readUsers();
};

const findByUsername = (username) => {
    const users = readUsers();
    return users.find(u => u.username === username);
};

const findByEmail = (email) => {
    const users = readUsers();
    return users.find(u => u.email === email);
};


const save = (newUser) => {
    const users = readUsers();
    users.push(newUser);
    writeUsers(users);
    return newUser;
};

// Exports Gabungan (module.exports) untuk Interface Modul
module.exports = {
    findAll,
    findByUsername,
    findByEmail,
    save
};