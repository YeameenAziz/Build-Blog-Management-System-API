
const Blog = require("../models/blog.model");

const isValidObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

// Create Blog
const createBlog = async (req, res) => {
  try {
    const { title, content, authorName, tags, blogImage } = req.body;

    if (!title || !content || !authorName) {
      return res.status(400).json({
        message: "Title, content and author name are required"
      });
    }

    const blog = await Blog.create({
      title,
      content,
      authorName,
      tags,
      blogImage,
      creator: req.user.userId
    });

    res.status(201).json({
      message: "Blog created successfully",
      blog
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create blog",
      error: error.message
    });
  }
};

// Get All Blogs
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();

    res.status(200).json({
      message: "Blogs fetched successfully",
      blogs
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch blogs",
      error: error.message
    });
  }
};

// Get Single Blog
const getSingleBlog = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid blog ID"
      });
    }

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found"
      });
    }

    res.status(200).json({
      message: "Blog fetched successfully",
      blog
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch blog",
      error: error.message
    });
  }
};

// Update Blog
const updateBlog = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid blog ID"
      });
    }

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found"
      });
    }

    if (blog.creator.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You can only update your own blog"
      });
    }

    const { title, content, authorName, tags, blogImage } = req.body;

    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.authorName = authorName || blog.authorName;
    blog.tags = tags || blog.tags;
    blog.blogImage = blogImage || blog.blogImage;

    await blog.save();

    res.status(200).json({
      message: "Blog updated successfully",
      blog
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update blog",
      error: error.message
    });
  }
};

// Delete Blog
const deleteBlog = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: "Invalid blog ID"
      });
    }

    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found"
      });
    }

    if (blog.creator.toString() !== req.user.userId) {
      return res.status(403).json({
        message: "You can only delete your own blog"
      });
    }

    await Blog.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Blog deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete blog",
      error: error.message
    });
  }
};

module.exports = {
  createBlog,
  getAllBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog
};