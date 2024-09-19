const jwt = require('jsonwebtoken');
const { errorHandler } = require('./error');
require('dotenv').config();

const verifyToken = (req, res, next) => {
  const cookies = req.headers.cookie;
  
  if (!cookies) {
    return next(errorHandler(401, "Unauthorized - No cookies found"));
  }

  const token = cookies.split("=")[1];


  if (!token) {
    return next(errorHandler(401, "Unauthorized - No token found"));
  }

  jwt.verify(String(token), process.env.SECRET_KEY, (err, user) => {
    if (err) {
      return next(errorHandler(400, "Invalid token"));
    }
    
    req.id = user.id;
    req.user = user;
    
    next();
  });
};

module.exports = verifyToken;
