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
    }
},{
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);