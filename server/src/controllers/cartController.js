const User = require('../models/User');
const Product = require('../models/Product');

class CartController {
    async getCart(req, res) {
        try {
            const user = await User.findById(req.user.userId)
                .populate('cart.product');
            res.json(user.cart);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async addToCart(req, res) {
        try {
            const { productId, quantity = 1 } = req.body;
            const user = await User.findById(req.user.userId);

            const existingItem = user.cart.find(
                item => item.product.toString() === productId
            );

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                user.cart.push({ product: productId, quantity, id: productId });
            }

            await user.save();
            const populatedUser = await User.findById(user._id)
                .populate('cart.product');

            res.json(populatedUser.cart);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async updateCartItem(req, res) {
        try {
            const { quantity } = req.body;
            const user = await User.findById(req.user.userId);

            const cartItem = user.cart.find(
                item => item.product.toString() === req.params.productId
            );

            if (!cartItem) {
                return res.status(404).json({ message: 'Item not found in cart' });
            }

            cartItem.quantity = quantity;
            await user.save();

            const populatedUser = await User.findById(user._id)
                .populate('cart.product');

            res.json(populatedUser.cart);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async removeFromCart(req, res) {
        try {
            const user = await User.findById(req.user.userId);
            const { removeAll = false } = req.body; // Add this parameter to force remove all quantities

            console.log('Before removal - Cart:', user.cart);
            console.log('Attempting to remove cart item:', req.params.productId);

            if (!user.cart) {
                return res.status(400).json({ message: "Cart not found" });
            }

            const itemIndex = user.cart.findIndex(
                item => item.id.toString() === req.params.productId
            );

            console.log('Item index:', itemIndex);

            if (itemIndex === -1) {
                return res.status(404).json({ message: "Item not found in cart" });
            }

            const cartItem = user.cart[itemIndex];

            // If removeAll is true or quantity is 1, remove the entire item
            if (removeAll || cartItem.quantity <= 1) {
                user.cart.splice(itemIndex, 1);
            } else {
                // Otherwise, decrease the quantity by 1
                cartItem.quantity -= 1;
            }

            console.log('After removal - Cart:', user.cart);
            await user.save();

            // Return populated cart
            const populatedUser = await User.findById(user._id)
                .populate('cart.product');
            res.json(populatedUser.cart);

        } catch (error) {
            console.error('Error in removeFromCart:', error);
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = new CartController();