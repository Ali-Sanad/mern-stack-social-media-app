require('dotenv').config()
const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator')

const auth = require('../../middlewares/auth')
const User = require('../../models/User')

//@ route          api/auth
//@descrption      user
//@access          Public
//get authenticated user data
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    res.status(200).json(user)
  } catch (err) {
    console.error(err.message)
    return res.status(500).send('Server error')
  }
})

//@ route          POST   api/auth
//@descrption      authenticate and login user & get token
//@access          Public
router.post(
  '/',
  [
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body
    try {
      //see if user exist
      let user = await User.findOne({ email })
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] })
      }

      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] })
      }

      //return JWT
      const payload = {
        user: {
          id: user.id
        }
      }

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: 36000 },
        (err, token) => {
          if (err) throw err
          res.status(200).json({ token })
        }
      )
    } catch (err) {
      console.log(err.message)
      res.status(500).send('Server error')
    }
  }
)

module.exports = router
