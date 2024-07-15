const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required']
    },
    content: {
        type: String,
        required: [true, 'Content is required']
    },
    author: {
        type: String,
        required: [true, 'Author is required']
    },
    creationDate: {
        type: Date,
        default: Date.now
    },
    image: {
        type: String,
        required: [true, 'Image is required']
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
});

module.exports = mongoose.model('Blog', blogSchema);
