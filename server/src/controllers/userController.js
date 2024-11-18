const User = require('../models/User');

class UserController {
    async getProfile(req, res) {
        try {
            const user = await User.findById(req.user.userId)
                .select('-password');
            res.json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async updateProfile(req, res) {
        try {
            const { name, email } = req.body;
            const user = await User.findByIdAndUpdate(
                req.user.userId,
                { name, email },
                { new: true }
            ).select('-password');
            
            res.json(user);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = new UserController();