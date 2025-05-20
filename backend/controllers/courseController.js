const CourseSchema = require('../models/courseModel');
const Category = require('../models/categoryModel');
const mongoose = require('mongoose');

exports.createCourse = async (req, res) => {
    const { title, description, categoryName, category, instructor, duration, content } = req.body;
    const headerImage = req.file ? req.file.path : req.body.headerImage || null;
    
    try {
        let categoryDoc;
        
        // Check if we have a category ID
        if (category && mongoose.Types.ObjectId.isValid(category)) {
            categoryDoc = await Category.findById(category);
        } 
        // Otherwise try to find by name
        else if (categoryName) {
            categoryDoc = await Category.findOne({name: categoryName});
        }
        
        if (!categoryDoc) {
            return res.status(400).json({ success: false, message: 'Category not found' });
        }
        
        const newCourse = new CourseSchema({
            title,
            description,
            category: categoryDoc._id,
            instructor,
            duration, 
            content,
            headerImage
        });
        
        await newCourse.save();
        res.status(201).json({ success: true, data: newCourse });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getAllCourses = async (req, res) => {
    try {
        const courses = await CourseSchema.find().populate('category');
        res.status(200).json({ success: true, data: courses });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.updateCourse = async (req, res) => {
    const { id } = req.params;
    const { title, description, categoryName, category, instructor, duration, content } = req.body;
    const headerImage = req.file ? req.file.path : req.body.headerImage || undefined;
    
    try {
        let updateData = {
            title,
            description,
            instructor,
            duration,
            content,
            updatedAt: Date.now()
        };
        
        // Check if we have a category ID
        if (category && mongoose.Types.ObjectId.isValid(category)) {
            const categoryDoc = await Category.findById(category);
            if (!categoryDoc) {
                return res.status(400).json({ success: false, message: 'Category not found' });
            }
            updateData.category = categoryDoc._id;
        } 
        // Otherwise try to find by name
        else if (categoryName) {
            const categoryDoc = await Category.findOne({name: categoryName});
            if (!categoryDoc) {
                return res.status(400).json({ success: false, message: 'Category not found' });
            }
            updateData.category = categoryDoc._id;
        }
        
        if (headerImage) {
            updateData.headerImage = headerImage;
        }
        
        const updatedCourse = await CourseSchema.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );
        
        if (!updatedCourse) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }
        
        res.status(200).json({ success: true, data: updatedCourse });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.deleteCourse = async (req, res) => {
    const { id } = req.params;
    
    try {
        const deletedCourse = await CourseSchema.findByIdAndDelete(id);
        
        if (!deletedCourse) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }
        
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
