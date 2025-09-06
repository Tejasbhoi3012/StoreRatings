const express = require('express')
const router = express.Router()
const { User, Store } = require('../models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { signupValidation, loginValidation } = require('../utils/validators')
const { validationResult } = require('express-validator')
require('dotenv').config()

function signToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' })
}

// Signup (normal users only)
router.post('/signup', signupValidation, async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    const { name, email, address, password } = req.body
    const existing = await User.findOne({ where: { email } })
    if (existing) return res.status(400).json({ message: 'Email already used' })
    const passwordHash = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, address, passwordHash, role: 'user' })
    res.status(201).json({ message: 'Created', user: { id: user.id, name: user.name, email: user.email, role: user.role } })
  } catch (err) { next(err) }
})

// Login
router.post('/login', loginValidation, async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
    const { email, password } = req.body
    const user = await User.findOne({ where: { email } })
    if (!user) return res.status(400).json({ message: 'Invalid credentials' })
    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' })
    const token = signToken(user)
    res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token })
  } catch (err) { next(err) }
})

// Update password -- user must pass Authorization header
const { authMiddleware } = require('../middleware/auth')
router.put('/password', authMiddleware, async (req, res, next) => {
  try {
    const { password } = req.body
    if (!password) return res.status(400).json({ message: 'Password required' })
    if (password.length < 8 || password.length > 16) return res.status(400).json({ message: 'Password length error' })
    // additional checks can be added...
    const passwordHash = await bcrypt.hash(password, 10)
    req.user.passwordHash = passwordHash
    await req.user.save()
    res.json({ message: 'Password updated' })
  } catch (err) { next(err) }
})

module.exports = router
