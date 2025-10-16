const{DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    const Cart = sequelize.define('Cart', {
        id: {
            type: DataTypes.INTEGER, autoIncerment: true, primaryKey: true},
        userId: {
            type: DataTypes.INTEGER, allowNull: false},
        productId: {
            type: DataTypes.INTEGER, allowNull: false},
        quantity: {
            type: DataTypes.INTEGER, allowNull: false, defaultValue: 1},
    }, {
        tableName: 'carts',
        timestamps: true
    });

    return Cart;
}
        