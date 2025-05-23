const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email:{
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email already exists"],
        trim: true,
        minlength: [10, "Email must be at least 10 characters"],
        lowercase: true,
    },
    password:{
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters"],
        select: false
    },
    profileName:{
        type: String,
        default: function() {
            return this.email ? this.email : " ";
        },
        trim: true
    },
    role:{
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
        trim: true
    },
    level: {
        type: Number,
        default: 0
    },
    language: {
        type: String,
        default: 'English',
        trim: true
    },
    avatarUrl: {
        type: String,
        default: '',
        trim: true
    },
    strengths: {
        pronunciation: { type: Number, default: 0 },
        grammar: { type: Number, default: 0 },
        vocabulary: { type: Number, default: 0 },
        fluency: { type: Number, default: 0 }
    },
    progress: {
        type: [
            {
                month: String,
                progress: Number
            }
        ],
        default: []
    },
    verified:{
        type: Boolean,
        default: false
    },
    verificationCode:{
        type: String,
        select: false
    },
    verificationCodeValidation:{
        type: String,
        select: false
    },
    forgotPasswordCode:{
        type: String,
        select: false
    },
    forgotPasswordCodeValidation:{
        type: String,
        select: false
    },
    userXP:{
        type: Number,
        default: 0
    },
    courseEnrolled: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }],
    CourseInProgress: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }],
    lessondone: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson',
        finishedDate: {
            type: Date,
        }   
    }],
    loginActivity: {
        type: [String],
        default: []
    }
},{
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);