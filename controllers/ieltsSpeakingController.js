const ieltsSpeakingExercises = require('../models/ielts_speakingModel');

exports.createSpeaking = async (req, res) => {
    const {text, part, topic} = req.body;
    try {
        const {error, value} = ieltsSpeakingExercises.validate(req.body);
        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        }

        const newExercise = new ieltsSpeakingExercises({
            text,
            part,
            topic
        });
        await newExercise.save();
        res.status(201).json({ success: true, data: newExercise });
    } catch (error) {
        console.error(error);
    }
}

exports.getSpeakingbyPart = async (req, res) => {
    const { part } = req.query;
    try {
        const exercise = await ieltsSpeakingExercises.find({ part: {$regex: part, $options: "i" } });
        if (!exercise) {
            return res.status(404).json({ success: false, message: 'Exercise not found' });
        }
        res.status(200).json({ success: true, data: exercise });
    } catch (error) {
        console.error(error);
    }
}

exports.getSpeakingbyTopic = async (req, res) => {
    const { topic } = req.query;
    try {
        const exercise = await ieltsSpeakingExercises.find({ topic: {$regex: topic, $options: "i" } });
        
        if (!exercise) {
            return res.status(404).json({ success: false, message: 'Exercise not found' });
        }
        res.status(200).json({ success: true, data: exercise });
    } catch (error) {
        console.error(error);
    }
}
exports.getAllSpeaking = async (req, res) => {
    try {
        const exercises = await ieltsSpeakingExercises.find();
        if (!exercises) {
            return res.status(404).json({ success: false, message: 'No exercises found' });
        }
        res.status(200).json({ success: true, data: exercises });
    } catch (error) {
        console.error(error);
    }
}
