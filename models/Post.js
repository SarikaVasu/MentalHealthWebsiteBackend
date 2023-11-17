const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    postId: {
        type: Number,
        // required: true
    },
    author: {
        type: String,
        required: true 
    },
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    reactions: {
        type: Object,
        default: {
            thumbsUp: 0,
            wow: 0,
            smile: 0,
            heart: 0,
            hug: 0
        }
    },
    active: {
        type: Boolean,
        default: true
    }
})

module.exports = mongoose.model('post', postSchema);