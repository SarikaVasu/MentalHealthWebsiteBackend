const Post = require('../../models/Post');

// @desc Get all users
// @route GET /users
// @access Private
const getAllPosts = async (req, res) => {
    // Get all posts from MongoDB
    const posts = await Post.find().lean(); //dont return password, lean=> give only json data not methods

    // If no posts 
    if (!posts?.length) {
        return res.status(400).json({ message: 'No posts found' });
    }

    res.json(posts);
}

// @desc Create new post
// @route POST /posts
// @access Private
const createNewPost = async (req, res) => {
    const { author, title, body, date, reactions } = req.body;

    const maxPost = await Post.find().sort({postId:-1}).limit(1);
    const postId = maxPost[0].postId + 1;

    // Confirm data
    if (!author || !title || !body || !date || !reactions ) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const post = await Post.create({ postId, author, title, body, date, reactions });
    
    if (post) { //created 
        res.status(201).json({ message: `New post ${title} created` });
    } else {
        res.status(400).json({ message: 'Invalid post data received' });
    }
}

// @desc Update a post
// @route PATCH /posts
// @access Private
const updatePost = async (req, res) => {
    const { id, author, title, body, active } = req.body;

    // Confirm data 
    if (!id || !author || !title || !body || typeof active !== 'boolean') {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Does the post exist to update?
    const post = await Post.findById(id).exec();

    if (!post) {
        return res.status(400).json({ message: 'Post not found' });
    }

    post.title = title;
    post.body = body;
    post.active = active;

    const updatedPost = await post.save();

    res.json({ message: `${updatedPost.postname} updated` });
}

// @desc Delete a post
// @route DELETE /posts
// @access Private
const deletePost = async (req, res) => {
    const { id } = req.body;

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Post ID Required' });
    }

    // Does the post exist to delete?
    const post = await Post.findById(id).exec();
    if (!post) {
        return res.status(400).json({ message: 'Post not found' });
    }
    const result = await post.deleteOne(); //result hold deleted post info
    const reply = `Post ${result.title} with ID ${result._id} deleted`;
    res.json(reply);
}

const updatePostById = async (req, res) => {
    
    const { id, author, title, body, date } = req.body;

    if (!id || !author || !title || !body || !date) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Does the post exist to update?
    const post = await Post.findById(id).exec();

    if (!post) {
        return res.status(400).json({ message: 'Post not found' });
    }

    post.title = title;
    post.body = body;
    post.date = date;

    const updatedPost = await post.save();

    res.json({ message: `${updatedPost.title} updated` });
}

const deletePostById = async (req, res) => {
    const { id } = req.body;

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Post ID Required' });
    }

    // Does the post exist to delete?
    const post = await Post.findById(id).exec();
    if (!post) {
        return res.status(400).json({ message: 'Post not found' });
    }
    const result = await post.deleteOne(); //result hold deleted post info
    const reply = `Post ${result.title} with ID ${result._id} deleted`;
    res.json(reply);
}

const updateReactionById = async (req, res) => {
    const  id  = req.params.id;
    const { reactions } = req.body;

    const post = await Post.findById(id).exec();

    if (!post) {
        return res.status(400).json({ message: 'Post not found' });
    }

    const date = new Date().toISOString()

    post.reactions = reactions;
    post.date = date;
    const updatedPost = await post.save();

    res.json({ message: `${updatedPost.title} updated` });
}

module.exports = {
    getAllPosts,
    createNewPost,
    updatePost,
    deletePost,
    updatePostById,
    deletePostById,
    updateReactionById
}