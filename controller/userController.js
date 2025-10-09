const userService = require('../service/userService');

exports.createUser = async (req, res) => {
    try {
        const newUser = await userService.createNewUser(req.body);
        
        // Logika HTTP: Respons sukses 201 Created
        res.status(201).json({ 
            message: 'User berhasil dibuat', 
            data: newUser 
        });

    } catch (err) {
        // Logika HTTP: Menangani error yang dilempar oleh Service

        let statusCode = 400; // Default: 400 Bad Request

        // Menganalisis Nama Error dari Service untuk menentukan kode HTTP
        if (err.name === 'UsernameConflictError') {
            statusCode = 409; // 409 Conflict
        } 
        // Jika bukan UsernameConflictError, gunakan default 400 Bad Request (misalnya "Semua properti harus diisi")
        
        res.status(statusCode).json({ 
            error: err.message 
        });
    }
};

exports.getAllUsers = async (req, res) => {
    const users = await userService.getAllUsers();
    // Respons sukses 200 OK
    res.status(200).json(users);
};

exports.getUserByUsername = async (req, res) => {
    const { username } = req.params;
    const user = await userService.getUserByUsername(username);

    // Logika HTTP: Kalau Service mengembalikan null, respons 404 Not Found
    if (!user) {
        return res.status(404).json({ 
            error: 'User tidak ditemukan' 
        });
    }

    // Respons sukses 200 OK
    res.status(200).json(user);
};