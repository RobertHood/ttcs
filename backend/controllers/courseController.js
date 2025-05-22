const CourseSchema = require('../models/courseModel');
const Category = require('../models/categoryModel');
const mongoose = require('mongoose');
const User = require('../models/usersModel');

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

exports.getCourseById = async (req, res) => {
    try {
        const courseId = req.params.id;
        const course = await CourseSchema.findById(courseId).populate('category').populate({
            path: 'roadmap.lessons',
            select: 'title'
        });
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }
        res.status(200).json({ success: true, data: course });
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
        
    
        if (category && mongoose.Types.ObjectId.isValid(category)) {
            const categoryDoc = await Category.findById(category);
            if (!categoryDoc) {
                return res.status(400).json({ success: false, message: 'Category not found' });
            }
            updateData.category = categoryDoc._id;
        } 

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

exports.enrollInCourse = async (req, res) => {
    try {
        const userId = req.user?.userID; 
        const { courseId } = req.body;

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const course = await CourseSchema.findById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }
        
        if (course.users_enrolled.includes(userId)) {
            return res.status(400).json({ success: false, message: 'Already enrolled' });
        }

        course.users_enrolled.push(userId);
        await course.save();

        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        if (!user.courseEnrolled.includes(courseId)) {
            user.courseEnrolled.push(courseId);
            await user.save();
        }
        res.status(200).json({ success: true, message: 'Enrolled successfully', course });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.updateCourseRoadmap = async (req, res) => {
    const { id } = req.params;
    const { roadmap } = req.body;

    if (!roadmap) {
        return res.status(400).json({ success: false, message: 'Roadmap is required' });
    }

    try {
        const updatedCourse = await CourseSchema.findByIdAndUpdate(
            id,
            { roadmap, updatedAt: Date.now() },
            { new: true, runValidators: true }
        ).populate('category').populate({
            path: 'roadmap.lessons',
            select: 'title'
        });

        if (!updatedCourse) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        res.status(200).json({ success: true, data: updatedCourse });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
