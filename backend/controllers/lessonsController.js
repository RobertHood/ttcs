const lessons = require('../models/lessonsModel');

exports.createLesson = async (req, res) => {
    const { course, title, theory, exercise, category } = req.body;
    try {
        const {error, value} = lessons.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }

        const newLesson = new lessons({
            course,
            title,
            theory,
            exercise,
            category
        });
        await newLesson.save();
        res.status(201).json({ success: true, data: newLesson });
    } catch (error) {
        console.error(error);
    }
}

exports.getLessonById = async (req, res) => {
    const { id } = req.params;
    try {
        const lesson = await lessons.findById(id);
        if (!lesson) {
            return res.status(404).json({ success: false, message: 'Lesson not found' });
        }
        res.status(200).json({ success: true, data: lesson });
    } catch (error) {
        console.error(error);
    }
}

exports.getAllLessons = async (req, res) => {
    try {
        const lessonsList = await lessons.find();
        res.status(200).json({ success: true, data: lessonsList });
    } catch (error) {
        console.error(error);
    }
}

exports.getLessonByCategory = async (req, res) => {
    const { category } = req.query;
    try {
        const lesson = await lessons.find({ category: {$regex: category, $options: "i" } });
        if (!lesson) {
            return res.status(404).json({ success: false, message: 'Lesson not found' });
        }
        res.status(200).json({ success: true, data: lesson });
    } catch (error) {
        console.error(error);
    }
}