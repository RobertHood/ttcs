const mongoose = require('mongoose');

const lessonSchema = mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: [true, "Course is required"]
    },
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
    },
    theory: {
        type: String,
        required: [true, "Theory is required"],
        trim: true,
    },
    audio: {
        type: String,
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
        enum: ['pronunciation', 'grammar', 'chatbot', 'final'],
        required: [true, "Type is required"]
    },
}, {
    timestamps: true
});

lessonSchema.pre('save', function(next) {
    this.exercise.forEach(ex => {
      if (!ex.correctAnswer && ex.answers && ex.answers.length > 0) {
        ex.correctAnswer = ex.answers[0];
      }
    });
    next();
  });

module.exports = mongoose.model("Lessons", lessonSchema);