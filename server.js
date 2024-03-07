const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3000;

// Connect to local MongoDB
mongoose.connect('mongodb://127.0.0.1/blogDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Create a BlogPost schema
const blogPostSchema = new mongoose.Schema({
  title: String,
  content: String
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

// Set up EJS as the view engine
app.set('view engine', 'ejs');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.get('/', async (req, res) => {
  const posts = await BlogPost.find();
  res.render('index', { posts });
});

app.get('/post/:postId', async (req, res) => {
  const postId = req.params.postId;
  const post = await BlogPost.findById(postId);
  res.render('post', { post });
});

// Render the form for inserting blog details
app.get('/form', (req, res) => {
  res.render('form');
});

// Handle insertion of new blog details
app.post('/insert', async (req, res) => {
  try {
    const { title, content } = req.body;
    const newBlogPost = new BlogPost({ title, content });
    await newBlogPost.save();
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
