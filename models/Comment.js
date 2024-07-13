const mongoose = require('mongoose');
const blogSchema = require('./Blog');

const commentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    blogPost: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog',
        required: true
    }
});

module.exports = mongoose.model('Comment', commentSchema);
