const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');
const app = express();
const {cloudinary} = require('./utils/cloudinary');

//connect database
connectDB();

//enable cors for all routes
app.use(cors());

//Init middleware for bodyparser
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));

app.use(express.static('public'));

app.post('/api/upload', async (req, res) => {
  try {
    const fileStr = req.body.data;
    const uploadedResponse = await cloudinary.uploader.upload(fileStr, {
      upload_preset: 'social_network',
    });
    console.log(uploadedResponse);
    res.json({msg: 'yaaaaaaaaaaaaa'});
  } catch (err) {
    console.log(err);
    res.status(500).json({err: 'Something went wrong'});
  }
});

app.get('/', (req, res) => res.send('API is running'));

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port:${PORT}`);
});
