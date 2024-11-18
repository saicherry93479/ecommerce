const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishController');
const auth = require('../middleware/auth');

router.get('/', auth, wishlistController.getWishlist);
router.post('/add/:productId',auth, wishlistController.addToWishlist);
router.delete('/remove/:productId',auth, wishlistController.removeFromWishlist);

module.exports = router;
