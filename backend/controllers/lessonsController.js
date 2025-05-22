const lessons = require('../models/lessonsModel');

exports.createLesson = async (req, res) => {
    const { course, title, theory, exercise } = req.body;
    const audioPath = req.file ? req.file.path : null;
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
            audio: audioPath
        });
        await newLesson.save();
        res.status(201).json({ success: true, data: newLesson });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
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

exports.updateLesson = async (req, res) => {
    try {
        const updated = await lessons.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ success: false, message: 'Lesson not found' });
        res.status(200).json({ success: true, data: updated });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.deleteLesson = async (req, res) => {
    try {
        const deleted = await lessons.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ success: false, message: 'Lesson not found' });
        res.status(200).json({ success: true, message: 'Deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
