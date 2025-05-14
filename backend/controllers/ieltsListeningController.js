const ieltsListeningExercises = require('../models/ielts_listeningModel');

exports.createListening = async (req, res) => {
    const { title, audio, exercise, category } = req.body;
    try {
        const {error, value} = ieltsListeningExercises.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }

        const newExercise = new ieltsListeningExercises({
            title,
            audio,
            exercise,
            category
        });
        await newExercise.save();
        res.status(201).json({ success: true, data: newExercise });
    } catch (error) {
        console.error(error);
    }
}

exports.getListeningbyTitle = async (req, res) => {
    const { title } = req.query;
    try {
        const exercise = await ieltsListeningExercises.find({ title: {$regex: title, $options: "i" } });
        if (!exercise) {
            return res.status(404).json({ success: false, message: 'Exercise not found' });
        }
        res.status(200).json({ success: true, data: exercise });
    } catch (error) {
        console.error(error);
    }
}

exports.getListeningbyCategory = async (req, res) => {
    const { category } = req.query;
    try {
        const exercise = await ieltsListeningExercises.find({ category: {$regex: category, $options: "i" } });
        
        if (!exercise) {
            return res.status(404).json({ success: false, message: 'Exercise not found' });
        }
        res.status(200).json({ success: true, data: exercise });
    } catch (error) {
        console.error(error);
    }
}

exports.getAllListening = async (req, res) => {
    try {
        const exercises = await ieltsListeningExercises.find();
        if (!exercises) {
            return res.status(404).json({ success: false, message: 'No exercises found' });
        }
        res.status(200).json({ success: true, data: exercises });
    } catch (error) {
        console.error(error);
    }
}
