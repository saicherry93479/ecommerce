const User = require('../models/User');

class WishlistController {
    async getWishlist(req, res) {
        try {
            const user = await User.findById(req.user.userId)
                .populate('wishlist');
            res.json(user.wishlist);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async addToWishlist(req, res) {
        try {
            console.log('came here ')
            const user = await User.findById(req.user.userId);
            console.log('user is ',user)
            if (!user.wishlist.includes(req.params.productId)) {
                user.wishlist.push(req.params.productId);
                await user.save();
            }
            
            const populatedUser = await User.findById(user._id)
                .populate('wishlist');
            
            res.json(populatedUser.wishlist);
        } catch (error) {
            console.log('eroor ,',error)
            res.status(400).json({ message: error.message });
        }
    }

    async removeFromWishlist(req, res) {
        try {
            const user = await User.findById(req.user.userId);
            user.wishlist = user.wishlist.filter(
                productId => productId.toString() !== req.params.productId
            );
            
            await user.save();
            res.json(user.wishlist);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = new WishlistController();