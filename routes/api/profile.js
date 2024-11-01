require('dotenv').config()
const express = require('express')
const router = express.Router()
const axios = require('axios')
const auth = require('../../middlewares/auth')
const { check, validationResult } = require('express-validator')
const normalize = require('normalize-url')

const Profile = require('../../models/Profile')
const User = require('../../models/User')
const Post = require('../../models/Post')

//@ route         GET api/profile/me
//@descrption      get user's profile
//@access          private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'user_image_url']
    )

    if (!profile) {
      return res
        .status(400)
        .send({ msg: 'There is no profile for this user' })
    }
    res.send(profile)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

//@ route         POST api/profile/
//@descrption      create or update user's profile
//@access          private
router.post(
  '/',
  [
    auth,
    [
      check('status', 'status is required').notEmpty(),
      check('skills', 'skill is required').notEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const {
      website,
      skills,
      youtube,
      twitter,
      instagram,
      linkedin,
      facebook,
      // spread the rest of the fields we don't need to check
      ...rest
    } = req.body

    // build a profile
    const profileFields = {
      user: req.user.id,
      website:
        website && website !== ''
          ? normalize(website, { forceHttps: true })
          : '',
      skills: Array.isArray(skills)
        ? skills
        : skills.split(',').map(skill => ' ' + skill.trim()),
      ...rest
    }

    // Build socialFields object
    const socialFields = {
      youtube,
      twitter,
      instagram,
      linkedin,
      facebook
    }

    // normalize social fields to ensure valid url
    for (const [key, value] of Object.entries(socialFields)) {
      if (value && value.length > 0)
        socialFields[key] = normalize(value, { forceHttps: true })
    }
    // add to profileFields
    profileFields.social = socialFields

    try {
      //upsert creates new doc if no match is found
      profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      )

      res.json(profile)
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server error')
    }
  }
)

//@ route         GET api/profile
//@descrption      get all profiles
//@access          public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find({}).populate('user', [
      'name',
      'user_image_url'
    ])
    res.json(profiles)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

//@ route         GET api/profile/user/:user_id
//@descrption      get profile by user_id
//@access          public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate('user', ['name', 'user_image_url'])

    if (!profile) return res.status(400).json({ msg: 'Profile not found' })
    res.json(profile)
  } catch (err) {
    console.error(err.message)
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found' })
    }
    res.status(500).send('Server error')
  }
})

//@ route         DELETE api/profile
//@descrption      delete profile , user &posts
//@access          private
router.delete('/', auth, async (req, res) => {
  try {
    //remove user posts
    await Post.deleteMany({ user: req.user.id })
    //remove profile
    await Profile.findOneAndDelete({ user: req.user.id })
    //remove user
    await User.findOneAndDelete({ _id: req.user.id })

    res.json({ msg: 'User deleted' })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

//@ route         PUT api/profile/experience
//@descrption      Add profile experience
//@access          private
router.put(
  '/experience',
  [
    auth,
    [
      check('company', 'Company is required').notEmpty(),
      check('title', 'Title is required').notEmpty(),
      check('from', 'From date is required').notEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { title, company, location, from, to, current, description } =
      req.body
    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    }

    try {
      const profile = await Profile.findOne({ user: req.user.id })
      profile.experience.unshift(newExp)
      await profile.save()
      res.json(profile)
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server error')
    }
  }
)

//@ route         DELETE api/profile/experience/:exp_id
//@descrption      remove profile experience
//@access          private
router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id })
    //get the removed index
    const removeIndex = profile.experience
      .map(item => item.id)
      .indexOf(req.params.exp_id)
    profile.experience.splice(removeIndex, 1)

    profile.save()
    res.json(profile)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

//@ route         PUT api/profile/education
//@descrption      Add profile education
//@access          private
router.put(
  '/education',
  [
    auth,
    [
      check('school', 'school is required').notEmpty(),
      check('fieldofstudy', 'fieldofstudy is required').notEmpty(),
      check('degree', 'degree is required').notEmpty(),
      check('from', 'From date is required').notEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    } = req.body
    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    }

    try {
      const profile = await Profile.findOne({ user: req.user.id })
      profile.education.unshift(newEdu)
      await profile.save()
      res.json(profile)
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server error')
    }
  }
)

//@ route         DELETE api/profile/education/:edu_id
//@descrption      remove profile education
//@access          private
router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id })
    //get the removed index
    const removeIndex = profile.education
      .map(item => item.id)
      .indexOf(req.params.edu_id)
    profile.education.splice(removeIndex, 1)

    profile.save()
    res.json(profile)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

//@ route         GET api/profile/github/:username
//@descrption      get user  info from github
//@access          public
router.get('/github/:username', async (req, res) => {
  try {
    const uri = encodeURI(
      `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`
    )
    const headers = {
      'user-agent': 'node.js',
      Authorization: `token ${process.env.GITHUB_TOKEN}`
    }

    const gitHubResponse = await axios.get(uri, { headers })
    return res.json(gitHubResponse.data)
  } catch (err) {
    console.error(err.message)
    return res.status(404).json({ msg: 'No Github profile found' })
  }
})
module.exports = router
