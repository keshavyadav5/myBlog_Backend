const User = require('../models/user.model')
const bcrypt = require('bcryptjs');
const { errorHandler } = require('../utils/error');
const jwt = require('jsonwebtoken')

const SignUp = async (req, res, next) => {
  const { username, email, password } = req.body;

  const exitinguser = await User.findOne({ email })
  if (exitinguser) {
    return next(errorHandler(400, 'Email already exists'));
  }
  if (!email || !username || !password || email == '' || username == '' || password == '') {
    next(errorHandler(400, 'Please fill in all fields'))
  }
  const hashPassword = bcrypt.hashSync(password, 10);
  const newUser = new User({
    username,
    email,
    password: hashPassword
  })
  try {
    await newUser.save()
    res.status(201).json({ message: 'User created successfully', success: true });
  } catch (error) {
    next(error)
  }
}

const SignIn = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(errorHandler(400, 'Email or password is incorrect'));
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return next(errorHandler(400, 'Email or password is incorrect'));
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.SECRET_KEY, {
      expiresIn: '1h', 
    });

    const { password: pass, ...rest } = user._doc;
    res.cookie('access_token',
      token,
      { 
        httpOnly: true, 
        maxAge: 3600000  
      })
      .status(200)
      .json({
        success: true,
        message: "Login successful",
        rest
      });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const google = async (req, res, next) => {
  const { name, email, googlePhotoUrl } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.SECRET_KEY, 
        { expiresIn: '1h' } 
      );

      const { password, ...userWithoutPassword } = user._doc;
      res.status(200)
        .cookie('access_token', token, { 
          httpOnly: true, 
          maxAge: 3600000  
        })
        .json(userWithoutPassword);
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashPassword = bcrypt.hashSync(generatedPassword, 10);

      const username = name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4);
      user = new User({
        username,
        email,
        password: hashPassword,
        profilePicture: googlePhotoUrl,
      });

      await user.save();

      const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.SECRET_KEY, { expiresIn: '1h' });
      const { password, ...newUserWithoutPassword } = user._doc;

      res.status(200)
        .cookie('access_token', token, { 
          httpOnly: true, 
          maxAge: 3600000 
        })
        .json(newUserWithoutPassword);
    }
  } catch (error) {
    next(error);
  }
};



module.exports = {
  SignUp,
  SignIn,
  google,
}