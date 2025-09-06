const { body } = require('express-validator')

const signupValidation = [
  body('name').isString().isLength({ min: 20, max: 60 }).withMessage('Name 20-60 chars'),
  body('email').isEmail(),
  body('password').isLength({ min: 8, max: 16 }).matches(/[A-Z]/).matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('Password 8-16, include uppercase and special'),
  body('address').optional().isLength({ max: 400 })
]

const loginValidation = [
  body('email').isEmail(),
  body('password').exists()
]

module.exports = { signupValidation, loginValidation }
