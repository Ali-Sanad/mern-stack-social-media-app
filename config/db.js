const mongoose = require('mongoose')
require('dotenv').config()

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI_CONNECTION_CLOUD, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    })
    console.log('MongoDB Connected Successfully...')
  } catch (err) {
    console.error(err.message)
    //Exit process with failure
    process.exit(1)
  }
}

module.exports = connectDB
