const express = require('express');
const router = express.Router();

//@ route          api/posts
//@descrption      test route
//@access          Public

router.get('/', (req, res) => res.send('posts route'));

module.exports = router;
