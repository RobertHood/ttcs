const categorySchema = require('../models/categoryModel');

exports.createCategory = async (req, res) => {
    const { name, description } = req.body;
    try {
        const newCategory = new categorySchema({
            name,
            description
        });
        
        await newCategory.save();
        res.status(201).json({ success: true, data: newCategory });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await categorySchema.find();
        res.status(200).json({ success: true, data: categories });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}