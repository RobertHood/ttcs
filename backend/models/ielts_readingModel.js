const mongoose = require('mongoose');

const ieltsReadingSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
    },

    passage: {
        type: String,
        required: [true, "Text is required"],
        trim: true,
    },
    exercise: [
        {
            question: {
            type: String,
            required: [true, "Question is required"],
            trim: true
            },
            answers: {
            type: [String],
            required: [true, "Answer is required"],
            trim: true
            }
        }  
    ],
    category: {
        type: String,
        enum: ['R1', 'R2', 'R3'],
        required: [true, "Category is required"],
        trim: true,
    },
}, {
    timestamps: true
});

module.exports = mongoose.model("IeltsReading", ieltsReadingSchema);