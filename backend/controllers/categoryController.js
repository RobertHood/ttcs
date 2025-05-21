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

exports.updateCategory = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    
    try {
        const updatedCategory = await categorySchema.findByIdAndUpdate(
            id, 
            { 
                name, 
                description,
                updatedAt: Date.now() 
            },
            { new: true, runValidators: true }
        );
        
        if (!updatedCategory) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
        
        res.status(200).json({ success: true, data: updatedCategory });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}

exports.deleteCategory = async (req, res) => {
    const { id } = req.params;
    
    try {
        const deletedCategory = await categorySchema.findByIdAndDelete(id);
        
        if (!deletedCategory) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }
        
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}