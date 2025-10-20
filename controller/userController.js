const userService = require('../service/userService');

exports.createUser = async (req, res) => {
    try {
        const { username, name, email, role } = req.body;
        
        // PERBAIKAN: Validasi Input (dipindahkan dari Service)
        if (!username || !name || !email || !role) {
            return res.status(400).json({ 
                error: 'Semua properti harus diisi' 
            });
        }

        // PERBAIKAN: Mengirim data yang sudah divalidasi
        const newUser = await userService.createNewUser({ username, name, email, role });
        
        res.status(201).json({ 
            message: 'User berhasil dibuat', 
            data: newUser 
        });

    } catch (err) {
        let statusCode = 400; 

        if (err.name === 'UsernameConflictError') {
            statusCode = 409; 
        } 
        
        res.status(statusCode).json({ 
            error: err.message 
        });
    }
};

exports.getAllUsers = async (req, res) => {
    // PERBAIKAN: Menambah AWAIT
    const users = await userService.getAllUsers();
    res.status(200).json(users);
};

exports.getUserByUsername = async (req, res) => {
    const { username } = req.params;
    // PERBAIKAN: Menambah AWAIT
    const user = await userService.getUserByUsername(username);

    if (!user) {
        return res.status(404).json({ 
            error: 'User tidak ditemukan' 
        });
    }

    res.status(200).json(user);
};