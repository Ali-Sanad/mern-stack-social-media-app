const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const {check, validationResult} = require('express-validator');

const User = require('../../models/User');
const auth = require('../../middlewares/auth');
const {cloudinary} = require('../../utils/cloudinary');

//@ route          POST   api/users
//@descrption      Register user
//@access          Public

router.post(
  '/',
  [
    check('name', 'Name is required').notEmpty(),
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Password should be 6 characters or more').isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({errors: errors.array()});
    }

    const {name, email, password} = req.body;
    try {
      //see if user exist
      let user = await User.findOne({email});
      if (user) {
        return res.status(400).json({errors: [{msg: 'User  already exists'}]});
      }

      user = new User({
        name,
        email,
        password,
      });

      //encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();

      //return JWT
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {expiresIn: 36000},
        (err, token) => {
          if (err) throw err;
          res.status(200).json({token});
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server error');
    }
  }
);

router.post('/image', auth, async (req, res) => {
  const fileStr = req.body.data;
  const uploadedResponse = await cloudinary.uploader.upload(fileStr, {
    upload_preset: 'social_network',
  });
  // console.log(uploadedResponse);

  let url = '';
  if (!req.body.data) {
    url = '';
  } else {
    url = uploadedResponse.secure_url;
  }

  try {
    const user = await User.findOneAndUpdate(
      {_id: req.user.id},
      {user_image_url: url},
      {new: true}
    );

    res.status(200).json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
