const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const app = express();
const path = require('path');
const upload = multer({ dest: './uploads/' });
const fs = require('fs');
const firebase = require('firebase-admin');
const cors = require('cors');

app.use(cors());
app.use(express.json());

// Initialize Firebase Admin SDK
firebase.initializeApp({
  apiKey: "AIzaSyCpfObJB6QgSJXs0Xd7uZetakqHODvkD4I",
  authDomain: "assessment-platform-fa01f.firebaseapp.com",
  projectId: "assessment-platform-fa01f",
  storageBucket: "assessment-platform-fa01f.appspot.com",
  messagingSenderId: "427055165609",
  appId: "1:427055165609:web:e2f2a462626673485839b8",
  measurementId: "G-ES16DP91DS"
});

// User Schema
const userSchema = new mongoose.Schema({
  email: String,
  username: String,
  password: String
});

const User = mongoose.model('User ', userSchema);

// Question Schema
const questionSchema = new mongoose.Schema({
  questionText: String,
  options: [String],
  correctAnswer: String
});

const Question = mongoose.model('Question', questionSchema);

// Connect to MongoDB
mongoose.connect('mongodb+srv://myAtlasDBUser:12345@myatlasclusteredu.o9cgxvh.mongodb.net/?retryWrites=true&w=majority&appName=myAtlasClusterEDU', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
  socketTimeoutMS: 45000, // Increase socket timeout
})
.then(() => {
  console.log('Connected to MongoDB');
  insertQuestions(); // Call this function only after successful connection
})
.catch(err => console.error('Error connecting to MongoDB:', err));

userSchema.pre('save', function(next) {
  const user = this;
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  });
});

// Create a route to handle user registration
app.post('/api/register', (req, res) => {
  const { email, username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = new User({ email, username, password: hashedPassword });
  user.save((err) => {
    if (err) {
      res.status(400).send('Registration failed');
    } else {
      res.send('User  registered successfully!');
    }
  });
});

// Create a route to handle user login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      res.status(401).send('Invalid email or password');
    } else {
      const isValid = bcrypt.compareSync(password, user.password);
      if (isValid) {
        res.send('Login successful!');
      } else {
        res.status(401).send('Invalid email or password');
      }
    }
  });
});

// Create a route to handle image uploads
app.post('/api/upload-image', upload.single('image'), (req, res) => {
  const imageBuffer = req.file.buffer;
  const imageName = req.file.originalname;
  const filePath = `./uploads/${imageName}`;
  fs.writeFileSync(filePath, imageBuffer);
  res.status(201).send(`Image uploaded successfully!`);
});

// API endpoint to load questions
app.post('/api/questions', async (req, res) => {
  try {
      const { question, options } = req.body;
      const newQuestion = new Question({ question, options });
      await newQuestion.save();
      res.status(201).json({ message: 'Question created successfully' });
  } catch (error) {
      res.status(500).json({ message: 'Error creating question', error });
  }
});

// API endpoint to handle signup requests
app.post('/api/signup', async (req, res) => {
  const { username, password, email } = req.body;

  // Validate username format
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return res.status(400).json({ error: 'Invalid username format' });
  }

  // Validate email format
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // Validate password format
  if (!/^(?=.*[a-z])(?=.*[A-Z ])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
    return res.status(400).json({ error: 'Invalid password format' });
  }

  try {
    const user = new User({ username, password, email });
    await user.save();
    res.json({ message: 'User created successfully!' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to create user' });
  }
});

// Insert sample questions
const insertQuestions = async () => {
  try {
    await Question.deleteMany();
    const questions = [
      {
        questionText: 'What is the capital of France?',
        options: ['Paris', 'London', 'Berlin', 'Rome'],
        correctAnswer: 'Paris'
      },
      {
        questionText: 'What is the largest planet in our solar system?',
        options: ['Earth', 'Saturn', 'Jupiter', 'Uranus'],
        correctAnswer: 'Jupiter'
      },
      // Add more questions here...
    ];
    await Question.insertMany(questions);
    console.log('Sample questions inserted successfully!');
  } catch (err) {
    console.error('Error inserting sample questions:', err);
  }
};

app.post('/api/questions', (req, res) => {
  const { question, options } = req.body;
  // Here you would typically insert the question into your database
  questionsDatabase.push({ question, options });
  res.status(201).send({ message: 'Question added successfully!' });
});

// API endpoint to fetch all questions
app.get('/api/questions', async (req, res) => {
  try {
    const questions = await Question.find(); // Fetch all questions from the database
    res.status(200).json(questions); // Send the questions as a JSON response
  } catch (error) {
    res.status(500).json({ message: 'Error fetching questions', error });
  }
});

// Create a route to retrieve the uploaded images
app.get('/api/images', (req, res) => {
  const images = fs.readdirSync('./uploads/');
  res.json(images);
});

// Sample data
const candidates = [
    { id: 1, name: 'Alice', score: 85, date: '2023-10-01' },
    { id: 2, name: 'Bob', score: 92, date: '2023-10-02' },
    { id: 3, name: 'Charlie', score: 78, date: '2023-10-01' },
    { id: 4, name: 'David', score: 88, date: '2023-10-03' },
    { id: 5, name: 'Eva', score: 95, date: '2023-10-02' },
];

// Endpoint to get candidates
app.get('/api/candidates', (req, res) => {
    res.json(candidates);
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});