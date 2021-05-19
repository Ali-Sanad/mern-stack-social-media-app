const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const {check, validationResult} = require('express-validator');

const User = require('../../models/User');
const auth = require('../../middlewares/auth');

//multer********************************************************************
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/image/user');
  },
  filename: function (req, file, cb) {
    const fileName = `${new Date().getTime()}_${file.originalname.replace(
      /\s+/g,
      '-'
    )}`;
    cb(null, fileName);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 50,
  },
});
/////////////////////////////////////////////////////////////////////////

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

      //get user gravatar
      // const avatar = gravatar.url(email, {
      //   s: '200',
      //   r: 'pg',
      //   d: 'mm',
      // });

      user = new User({
        name,
        email,
        password,
        // avatar,
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

router.post('/image/', upload.single('avatar'), auth, async (req, res) => {
  let userImage = null;
  if (!req.file) {
    userImage = null;
  } else {
    userImage = req.file.filename;
  }

  try {
    const user = await User.findOneAndUpdate(
      {_id: req.user.id},
      {avatar: userImage},
      {new: true}
    );

    res.status(200).json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
