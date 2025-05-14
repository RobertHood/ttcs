const ieltsReadingExercises = require('../models/ielts_readingModel');

exports.createReading = async (req, res) => {
    const { title, passage, questions, category } = req.body;
    try {
        const {error, value} = ieltsReadingExercises.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }

        const newExercise = new ieltsReadingExercises({
            title,
            passage,
            questions,
            category
        });
        await newExercise.save();
        res.status(201).json({ success: true, data: newExercise });
    } catch (error) {
        console.error(error);
    }
}

exports.getReadingbyTitle = async (req, res) => {
    const { title } = req.query;
    try {
        const exercise = await ieltsReadingExercises.find({ title: {$regex: title, $options: "i" } });
        if (!exercise) {
            return res.status(404).json({ success: false, message: 'Exercise not found' });
        }
        res.status(200).json({ success: true, data: exercise });
    } catch (error) {
        console.error(error);
    }
}
exports.getReadingbyCategory = async (req, res) => {
    const { category } = req.query;
    try {
        const exercise = await ieltsReadingExercises.find({ category: {$regex: category, $options: "i" } });
        
        if (!exercise) {
            return res.status(404).json({ success: false, message: 'Exercise not found' });
        }
        res.status(200).json({ success: true, data: exercise });
    } catch (error) {
        console.error(error);
    }
}   

exports.getAllReading = async (req, res) => {
    try {
        const exercises = await ieltsReadingExercises.find();
        if (!exercises) {
            return res.status(404).json({ success: false, message: 'No exercises found' });
        }
        res.status(200).json({ success: true, data: exercises });
    } catch (error) {
        console.error(error);
    }
}

