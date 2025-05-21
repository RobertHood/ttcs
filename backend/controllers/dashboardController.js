const User = require('../models/usersModel.js');
const Course = require('../models/courseModel.js');
const Category = require('../models/categoryModel.js');

exports.getStats = async (req, res) => {
    try {
        // Perform all queries in parallel for better performance
        const [users, courses, categories] = await Promise.all([
            User.find().sort({ createdAt: -1 }).limit(10), // Get recent users
            Course.find(),
            Category.find()
        ]);

        // Format the response
        const stats = {
            totalUsers: users.length > 0 ? await User.countDocuments() : 0,
            totalCourses: courses.length,
            totalCategories: categories.length,
            recentUsers: users.map(user => ({
                _id: user._id,
                email: user.email,
                profileName: user.profileName,
                role: user.role,
                verified: user.verified,
                createdAt: user.createdAt,
                avatarUrl: user.avatarUrl
            }))
        };

        res.status(200).json({ success: true, data: stats });
    } catch (error) {
        console.error('Error getting dashboard stats:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
}; 