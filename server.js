const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');

const app = express();

//connect database
connectDB();

//enable cors for all routes
app.use(cors());

//Init middleware for bodyparser
app.use(express.json({extended: false}));
app.use(express.static('public'));

const PORT = process.env.PORT || 5000;

// app.get('/', (req, res) => res.send('API is running'));

//@define routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

//serve static assets in production
if (process.env.NODE_ENV === 'production') {
  //set static folder
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}
app.listen(PORT, () => {
  console.log(`Server started on port:${PORT}`);
});
