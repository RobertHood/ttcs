const CourseSchema = require('../models/courseModel');

exports.createCourse = async (req, res) => {
    const { title, description, category, instructor, duration, content } = req.body;
    const headerImage = req.file ? req.file.path : null;
    try {
        const newCourse = new CourseSchema({
            title,
            description,
            category,
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
