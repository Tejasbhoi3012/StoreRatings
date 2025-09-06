const express = require('express')
const router = express.Router()
const { authMiddleware, roleGuard } = require('../middleware/auth')
const { Store, Rating, User } = require('../models')

// owner routes require auth + owner role
router.use(authMiddleware, roleGuard('owner'))

// GET /owner/store - returns the store owned by this owner (assume ownerId in stores)
router.get('/store', async (req, res, next) => {
  try {
    const store = await Store.findOne({ where: { ownerId: req.user.id } })
    if (!store) return res.status(404).json({ message: 'No store for this owner' })
    res.json(store)
  } catch (err) { next(err) }
})

// GET /owner/ratings - list ratings for owner's store
router.get('/ratings', async (req, res, next) => {
  try {
    const store = await Store.findOne({ where: { ownerId: req.user.id } })
    if (!store) return res.status(404).json({ message: 'No store' })
    const ratings = await Rating.findAll({ where: { storeId: store.id }, include: [{ model: User, attributes: ['id','name','email'] }] })
    const result = ratings.map(r => ({ id: r.id, value: r.value, userId: r.userId, userName: r.User.name, createdAt: r.createdAt }))
    res.json(result)
  } catch (err) { next(err) }
})

module.exports = router
