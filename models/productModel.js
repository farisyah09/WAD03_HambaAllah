const{DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    const Product = sequelize.define('Product', {
        id: {
            type: DataTypes.STRING, autoIncerment: true, primaryKey: true},
        name: {
            type: DataTypes.STRING, allowNull: false},
        slug: {
            type: DataTypes.STRING, allowNull: false, unique: true},
        category: {
            type: DataTypes.STRING, allowNull: false},
        price: {
            type: DataTypes.FLOAT, allowNull: false},
        owner: {
            type: DataTypes.STRING, allowNull: false},
    }, {
        tableName: 'products',
        timestamps: true
    });

    return Product;
}
            