const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const auth = require('../middleware/auth');

router.get('/', auth, cartController.getCart);
router.post('/add', auth, cartController.addToCart);
router.put('/update/:productId', auth, cartController.updateCartItem);
router.post('/remove/:productId', auth, cartController.removeFromCart);

module.exports = router;
