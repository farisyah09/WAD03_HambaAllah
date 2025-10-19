const { User } = require('../database');
const { Op } = require('sequelize');

const findAll = async () => {
    // PERBAIKAN: Menggunakan Sequelize dan menyertakan 'id'
    return await User.findAll({
        attributes: ['id', 'username', 'name', 'email', 'role']
    });
};

const findByUsername = async (username) => {
    // PERBAIKAN: Menggunakan Sequelize
    const user = await User.findOne({ 
        where: { username },
        attributes: ['id', 'username', 'name', 'email', 'role']
    });
    return user ? user.toJSON() : null;
};

const findByEmail = async (email) => {
    // PERBAIKAN: Menggunakan Sequelize
    const user = await User.findOne({ 
        where: { email },
        attributes: ['id', 'username', 'name', 'email', 'role']
    });
    return user ? user.toJSON() : null;
};

const findMaxId = async () => {
    // FUNGSI BARU: Mencari ID terbesar dengan prefix 'U'
    const prefix = 'U';
    const user = await User.findOne({
        attributes: ['id'],
        where: {
            id: {
                [Op.startsWith]: prefix
            }
        },
        order: [
            [User.sequelize.literal('CAST(SUBSTRING("id", 2) AS INTEGER)'), 'DESC'] 
        ],
        limit: 1
    });
    return user ? user.id : null;
};


const save = async (newUser) => {
    // PERBAIKAN: Menggunakan Sequelize
    const user = await User.create(newUser);
    return user.toJSON();
};

module.exports = {
    findAll,
    findByUsername,
    findByEmail,
    findMaxId, 
    save