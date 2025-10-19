const{DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    const Cart = sequelize.define('Cart', {
        id: {
            type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
        userId: {
            // PERBAIKAN: Foreign Key ke User.id (STRING)
            type: DataTypes.STRING, allowNull: false}, 
        productId: {
            // PERBAIKAN: Foreign Key ke Product.id (STRING)
            type: DataTypes.STRING, allowNull: false}, 
        quantity: {
            type: DataTypes.INTEGER, allowNull: false, defaultValue: 1},
    }, {
        tableName: 'carts',
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ['userId', 'productId']
            }
        ]
    });

    // PERBAIKAN: Menambahkan relasi (Associations) untuk JOIN
    const { Product, User } = sequelize.models;
    
    Cart.belongsTo(User, { 
        foreignKey: 'userId', targetKey: 'id', as: 'User' 
    });
    Cart.belongsTo(Product, { 
        foreignKey: 'productId', targetKey: 'id', as: 'Product' 
    });

    return Cart;
}
