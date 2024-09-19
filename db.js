const mongoose = require('mongoose')
require('dotenv').config()

const db = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')
  } catch (error) {
    console.log(error);
  }
}

db()

module.exports = mongoose