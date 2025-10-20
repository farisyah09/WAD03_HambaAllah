const { Product } = require('../database');
const { Op } = require('sequelize');
// PERBAIKAN: Hapus import fs dan path

// PERBAIKAN: Hapus fungsi I/O JSON (readProducts, writeProducts)

const findAll = async () => {
  // PERBAIKAN: Menggunakan Sequelize
  return await Product.findAll();
};

const findBySlug = async (slug) => {
  // PERBAIKAN: Menggunakan Sequelize
  return await Product.findOne({
    where: { slug }
  });
};

const findByID = async (id) => {
  // PERBAIKAN: Menggunakan Sequelize
  return await Product.findOne({
    where: { id }
  });
};

// FUNGSI BARU: Mencari ID terbesar berdasarkan prefix owner
const findMaxIdByOwnerPrefix = async (prefix) => {
  const product = await Product.findOne({
    attributes: ['id'],
    where: {
      id: {
        [Op.startsWith]: prefix
      }
    },
    order: [
      [Product.sequelize.literal('CAST(SUBSTRING("id", 3) AS INTEGER)'), 'DESC']
    ],
    limit: 1
  });
  return product ? product.id : null;
};

const save = async (newProduct) => {
  // PERBAIKAN: Menggunakan Sequelize
  const product = await Product.create(newProduct);
  return product.toJSON();
};

module.exports = {
  findAll,
  findBySlug,
  findByID,
  findMaxIdByOwnerPrefix,
  save
};
