const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname, 'user.json');

const readUsers = () => {
    try {
        const usersData = fs.readFileSync(usersFilePath);
        return JSON.parse(usersData);
    } catch (error) {
        return [];
    }
};

const writeUsers = (users) => {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

exports.createUser = (req, res) => {
    const users = readUsers();
    const { username, name, email, role } = req.body;

    if (!username || !name || !email || !role) {
        return res.status(400).json({ message: 'Semua properti harus diisi' });
    }

    if (users.some(user => user.username === username)) {
        return res.status(409).json({ message: 'Username sudah digunakan' });
    }

    const newUser = { username, name, email, role };
    users.push(newUser);
    writeUsers(users);

    res.status(201).json({ message: 'User berhasil dibuat', data: newUser });
};

exports.getAllUsers = (req, res) => {
    const users = readUsers();
    res.status(200).json(users);
};

exports.getUserByUsername = (req, res) => {
    const users = readUsers();
    const { username } = req.params;
    const user = users.find(u => u.username === username);

    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404).json({ message: 'User tidak ditemukan' });
    }
};