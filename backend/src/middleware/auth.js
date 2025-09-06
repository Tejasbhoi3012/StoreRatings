const jwt = require('jsonwebtoken')
const { User } = require('../models')
require('dotenv').config()

async function authMiddleware(req, res, next) {
  const auth = req.headers.authorization
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Unauthorized' })
  const token = auth.slice(7)
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findByPk(payload.id)
    if (!user) return res.status(401).json({ message: 'Invalid token' })
    req.user = user
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}

function roleGuard(requiredRole) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' })
    if (req.user.role !== requiredRole) return res.status(403).json({ message: 'Forbidden' })
    next()
  }
}

module.exports = { authMiddleware, roleGuard }
