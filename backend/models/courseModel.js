const { required } = require('joi');
const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
    headerImage: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    content: {
        type: String, 
        required: true
    },
    roadmap: [
        {
            title: { type: String, required: true },         
            description: { type: String },     
            lessons: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Lesson',
                required: true
                
            }], 
            order: { type: Number }                       
        }
        ],
    instructor: {
        type: String,
        required: true
    },
    users_enrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    duration: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Course', courseSchema);