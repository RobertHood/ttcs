const CourseSchema = require('../models/courseModel');
const Category = require('../models/categoryModel');
const User = require('../models/usersModel');

exports.createCourse = async (req, res) => {
    const { title, description, categoryName, instructor, duration, content } = req.body;
    const headerImage = req.file ? req.file.path : null;
    try {
        const categoryDoc = await Category.findOne({name: categoryName});
        if (!categoryDoc) {
            return res.status(400).json({ success: false, message: 'Category not found' });
        }
        const newCourse = new CourseSchema({
            title,
            description,
            categoryName: categoryDoc.name,
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