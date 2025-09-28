const express = require('express');
const router = express.Router();

const cartController = require('../controller/cartController'); 

router.get('/:username', cartController.getCart);

router.post('/:username/add', cartController.addItemToCart);

router.post('/:username/remove', cartController.removeItemFromCart);

module.exports = router;