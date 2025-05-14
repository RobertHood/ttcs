const mongoose = require('mongoose');

const ieltsWritingSchema = mongoose.Schema({
    question: {
        type: String,
        required: [true, "Question is required"],
        trim: true,
    },
    graph : {
        type: String, //URL
        trim: true,
    },
    modelAnswer: {
        type: String,
        trim: true,
    },
    category: {
        type: String,
        enum: ['W1', 'W2'],
        required: [true, "Category is required"],
        trim: true,
    },
}, {
    timestamps: true
});

module.exports = mongoose.model("IeltsWriting", ieltsWritingSchema);