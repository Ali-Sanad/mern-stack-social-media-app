require('dotenv').config()
const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
  //get token from header
  const token = req.header('x-auth-token')

  //check if there is no token
  if (!token) {
    return res.status(401).send({ msg: 'No token, authorization denied' })
  }

  //verify token and unlock the payload(decoded)
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    //assign the payload(decoded)=> to req.user
    req.user = decoded.user
    next()
  } catch (error) {
    res.status(401).json({ msg: 'Token is not valid' })
  }
}
