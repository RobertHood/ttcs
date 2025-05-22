const lessons = require('../models/lessonsModel');

exports.createLesson = async (req, res) => {
    try {
        let { course, title, theory, category } = req.body;
        let exercise = req.body.exercise;

        // Parse exercise if it's a string (from JSON.stringify in frontend)
        if (exercise && typeof exercise === 'string') {
            try {
                exercise = JSON.parse(exercise);
            } catch (err) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Invalid exercise data format' 
                });
            }
        }

        const newLesson = new lessons({
            course,
            title,
            theory,
            exercise,
            category,
            audio: req.file ? req.file.path : ''
        });
        
        await newLesson.save();
        res.status(201).json({ success: true, data: newLesson });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to create lesson', error: error.message });
    }
}

exports.getLessonById = async (req, res) => {
    const { id } = req.params;
    try {
        const lesson = await lessons.findById(id).populate({
            path: 'course',
            select: '_id title description'
        });
        if (!lesson) {
            return res.status(404).json({ success: false, message: 'Lesson not found' });
        }
        res.status(200).json({ success: true, data: lesson });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to get lesson', error: error.message });
    }
}

exports.getAllLessons = async (req, res) => {
    try {
        const lessonsList = await lessons.find().populate({
            path: 'course',
            select: '_id title description'
        });
        res.status(200).json({ success: true, data: lessonsList });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to get lessons', error: error.message });
    }
}

exports.getLessonByCategory = async (req, res) => {
    const { category } = req.query;
    try {
        const lesson = await lessons.find({ category: {$regex: category, $options: "i" } }).populate({
            path: 'course',
            select: '_id title description'
        });
        if (!lesson) {
            return res.status(404).json({ success: false, message: 'Lesson not found' });
        }
        res.status(200).json({ success: true, data: lesson });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to get lessons by category', error: error.message });
    }
}

exports.updateLesson = async (req, res) => {
    const { id } = req.params;
    try {
        let { course, title, theory, category } = req.body;
        let exercise = req.body.exercise;

        // Parse exercise if it's a string (from JSON.stringify in frontend)
        if (exercise && typeof exercise === 'string') {
            try {
                exercise = JSON.parse(exercise);
            } catch (err) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Invalid exercise data format' 
                });
            }
        }

        const updateData = {
            course,
            title,
            theory,
            exercise,
            category
        };

        // Only update audio if a new file is uploaded
        if (req.file) {
            updateData.audio = req.file.path;
        }

        const updatedLesson = await lessons.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedLesson) {
            return res.status(404).json({ success: false, message: 'Lesson not found' });
        }

        res.status(200).json({ success: true, data: updatedLesson });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to update lesson', error: error.message });
    }
}

exports.deleteLesson = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedLesson = await lessons.findByIdAndDelete(id);
        
        if (!deletedLesson) {
            return res.status(404).json({ success: false, message: 'Lesson not found' });
        }
        
        res.status(200).json({ success: true, message: 'Lesson deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to delete lesson', error: error.message });
    }
}