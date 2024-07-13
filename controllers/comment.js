const Comment = require('../models/Comment');
const Blog = require('../models/Blog');

exports.addComment = async (req, res) => {
    try {
        const { postId } = req.params; 
        const { name, comment } = req.body;

        if (!name || !comment) {
            return res.status(400).json({ error: 'Name and comment are required' });
        }

        const newComment = new Comment({
            name,
            comment,
            blogPost: postId 
        });

        const savedComment = await newComment.save();

        let updatedBlog = await Blog.findById(postId);
        if (!updatedBlog) {
            return res.status(404).json({ error: 'Blog post not found' });
        }

        updatedBlog.comments.push(savedComment._id);
        await updatedBlog.save(); 

        updatedBlog = await Blog.findById(postId).populate('comments');
        if (!updatedBlog) {
            return res.status(404).json({ error: 'Blog post not found' });
        }

        res.status(201).json({ 
            message: 'Comment added successfully',
            blogPost: updatedBlog
        });
    } catch (error) {
        console.error('Error in adding comment: ', error);
        res.status(500).json({ error: 'Error in Save' });
    }
};

exports.getComments = async (req, res) => {
    try {
        const { postId } = req.params;

        const blog = await Blog.findById(postId).populate('comments');
        if (!blog) {
            return res.status(404).json({ error: 'Blog post not found' });
        }
        const comments = blog.comments;

        res.status(200).json({ 
            message: 'Comments retrieved successfully',
            comments
        });
    } catch (error) {
        console.error('Error in getting comments: ', error);
        res.status(500).json({ error: 'Error in retrieving comments' });
    }
};

exports.deleteComment = async (req, res) => {
    try {
      const { id } = req.params;
  
      if (!id) {
        return res.status(400).json({ error: 'Comment ID is required' });
      }
  
      if (!req.user.isAdmin) {
        console.log('Non-admin user attempted to delete a comment');
        return res.status(403).json({ error: 'You are not authorized to delete comments' });
      }
  
      // Find the comment to be deleted
      const deletedComment = await Comment.findByIdAndDelete(id);
      if (!deletedComment) {
        return res.status(404).json({ error: 'Comment not found' });
      }
  
      // Find the blog associated with the deleted comment
      const blog = await Blog.findById(deletedComment.blogPost);
      if (!blog) {
        console.error('Blog post not found for deleted comment');
        // Consider alternative actions (e.g., log error and proceed)
        return res.status(200).json({ message: 'Comment deleted successfully (blog update failed)' });
      }
  
      // Remove the deleted comment ID from the blog's comments array
      blog.comments.pull(id);
  
      // Save the updated blog document
      await blog.save();
  
      res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
      console.error('Error in deleting comment: ', error);
      res.status(500).json({ error: 'Error in deleting comment' });
    }
  };
  