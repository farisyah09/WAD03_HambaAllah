const express = require('express');
const router = express.Router();

const cartController = require('../controller/cartController');
const authMiddleware = require('../middleware/authMiddleware');  

router.get('/:username', cartController.getCartItems);

router.post('/:username/add', authMiddleware.isBuyer, cartController.addItemToCart);

router.post('/:username/remove', authMiddleware.isBuyer, cartController.removeItemFromCart);

module.exports = router;