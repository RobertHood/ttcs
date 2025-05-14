const mongoose = require('mongoose');

const ieltsSpeakingSchema = mongoose.Schema({
    text: {
        type: String,
        required: [true, "Question is required"],
        trim: true,
    },
    part: {
        type: String,
        enum: ['S1', 'S2', 'S3'],
        required: [true, "Part is required"],
        trim: true,
    },
    topic: {
        type: String,
        required: [true, "Topic is required"],
        trim: true,
    },
}, {
    timestamps: true
});

module.exports = mongoose.model("IeltsSpeaking", ieltsSpeakingSchema);