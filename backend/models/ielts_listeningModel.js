const mongoose = require('mongoose');

const ieltsListeningSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
    },
    audio: {
        type: String,
        required: [true, "Audio is required"],
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
            },
            correctAnswer: {
            type: String,
            trim: true
            }
        }  
    ],
    category: {
        type: String,
        enum: ['L1', 'L2', 'L3', 'L4'],
        required: [true, "Category is required"],
        trim: true,
    },
}, {
    timestamps: true
});

ieltsListeningSchema.pre('save', function(next) {
    this.exercise.forEach(ex => {
      if (!ex.correctAnswer && ex.answers && ex.answers.length > 0) {
        ex.correctAnswer = ex.answers[0];
      }
    });
    next();
  });

module.exports = mongoose.model("IeltsListening", ieltsListeningSchema);