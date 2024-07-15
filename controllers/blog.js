const mongoose = require('mongoose');
const Blog = require("../models/Blog");

module.exports.addPost = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'You must be logged in to create a post' });
    }

    if (req.user.isAdmin) {
      return res.status(403).json({ error: 'Admins cannot create a post' });
    }

    const { title, content, image } = req.body;
    const author = req.user.username;
    const newBlog = new Blog({
      title,
      content,
      author,
      image
    });

    await newBlog.save();

    res.status(201).json({ message: 'Blog post created successfully', blog: newBlog });
  } catch (error) {
    console.error('Error in saving the blog post: ', error);
    res.status(500).json({ error: 'Error in Save' });
  }
};

module.exports.getBlogs = (req, res) => {
  Blog.find()
    .then(blogs => {
      if (blogs.length > 0) {
        return res.status(200).json({ blogs });
      } else {
        return res.status(200).json({ message: 'No blogs found.' });
      }
    })
    .catch(err => res.status(500).json({ error: 'Error finding blogs.' }));
};

module.exports.getBlog = (req, res) => {
  Blog.findById(req.params.id)
    .populate('comments')
    .then(blog => {
      if (!blog) {
        return res.status(404).json({ error: 'Blog not found' });
      } else {
        return res.status(200).json({ blog });
      }
    })
    .catch(err => {
      console.error('Error finding blog:', err);
      return res.status(500).json({ error: 'Error finding blog' });
    });
};

module.exports.updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, image } = req.body;

    const existingBlog = await Blog.findById(id);
    if (!existingBlog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    if (req.user.isAdmin) {
      return res.status(401).json({ error: 'Admins are not allowed to update posts' });
    }

    if (existingBlog.author !== req.user.username) {
      return res.status(401).json({ error: 'Unauthorized to update this post' });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { title, content, image },
      { new: true, populate: 'comments' }
    );

    if (!updatedBlog) {
      return res.status(500).json({ error: 'Error updating blog post' });
    }

    res.status(200).json({ message: 'Blog post updated successfully', blog: updatedBlog });
  } catch (error) {
    console.error('Error updating blog post: ', error);
    res.status(500).json({ error: 'Error updating blog post' });
  }
};

module.exports.deleteOwnPost = async (req, res) => {
  try {
    const { id } = req.params;

    const existingBlog = await Blog.findById(id);
    if (!existingBlog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    if (existingBlog.author !== req.user.username) {
      return res.status(401).json({ error: 'Unauthorized to delete this post' });
    }

    await Blog.findByIdAndDelete(id);

    res.status(200).json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog post: ', error);
    res.status(500).json({ error: 'Error deleting blog post' });
  }
};

module.exports.getMyBlogs = async (req, res) => {
  try {
    const myBlogs = await Blog.find({ author: req.user.username }).populate('comments');

    if (myBlogs.length > 0) {
      return res.status(200).json({ myBlogs });
    } else {
      return res.status(200).json({ message: 'You have not created any blogs yet.' });
    }
  } catch (error) {
    console.error('Error retrieving user blogs:', error);
    res.status(500).json({ error: 'Error retrieving user blogs' });
  }
};

module.exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Unauthorized. Only admins can delete any post' });
    }

    await Blog.findByIdAndDelete(id);

    res.status(200).json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog post: ', error);
    res.status(500).json({ error: 'Error deleting blog post' });
  }
};
