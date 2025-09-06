const express = require('express')
const router = express.Router()
const { Store, Rating, User } = require('../models')
const { authMiddleware } = require('../middleware/auth')

// GET /stores - list with optional search
router.get('/', async (req, res, next) => {
  try {
    const { name, address } = req.query
    const where = {}
    if (name) where.name = { [require('sequelize').Op.iLike ]: `%${name}%` }
    if (address) where.address = { [require('sequelize').Op.iLike ]: `%${address}%` }
    const stores = await Store.findAll({ where })
    // compute average and include user's rating when auth provided
    let currentUserId = null
    const authHeader = req.headers.authorization
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const jwt = require('jsonwebtoken')
        const payload = jwt.verify(authHeader.slice(7), process.env.JWT_SECRET)
        currentUserId = payload?.id || null
      } catch (e) {}
    }

    const response = await Promise.all(stores.map(async s => {
      const ratings = await Rating.findAll({ where: { storeId: s.id } })
      const avg = ratings.length ? (ratings.reduce((a,b)=>a+b.value,0)/ratings.length) : 0
      let userRating = null
      if (currentUserId) {
        const r = ratings.find(r => r.userId === currentUserId)
        if (r) userRating = { id: r.id, value: r.value }
      }
      return { id: s.id, name: s.name, address: s.address, averageRating: Number(avg.toFixed(2)), userRating }
    }))
    res.json(response)
  } catch (err) { next(err) }
})

// GET /stores/:id - detail (if authenticated include user's rating)
router.get('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const store = await Store.findByPk(id)
    if (!store) return res.status(404).json({ message: 'Not found' })
    const ratings = await Rating.findAll({ where: { storeId: id } })
    const avg = ratings.length ? (ratings.reduce((a,b)=>a+b.value,0)/ratings.length) : 0
    let userRating = null
    // try to parse auth header
    const authHeader = req.headers.authorization
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const jwt = require('jsonwebtoken')
        const payload = jwt.verify(authHeader.slice(7), process.env.JWT_SECRET)
        if (payload?.id) {
          const r = await Rating.findOne({ where: { storeId: id, userId: payload.id } })
          userRating = r ? { id: r.id, value: r.value } : null
        }
      } catch (e) {}
    }
    res.json({ id: store.id, name: store.name, address: store.address, averageRating: Number(avg.toFixed(2)), userRating })
  } catch (err) { next(err) }
})

// POST /stores/:id/ratings - submit rating (auth required)
router.post('/:id/ratings', authMiddleware, async (req, res, next) => {
  try {
    const storeId = Number(req.params.id)
    const { value } = req.body
    if (!value || value < 1 || value > 5) return res.status(400).json({ message: 'Invalid rating' })
    // check if user already rated
    const existing = await Rating.findOne({ where: { storeId, userId: req.user.id } })
    if (existing) return res.status(400).json({ message: 'Already rated, use update' })
    const rating = await Rating.create({ value, storeId, userId: req.user.id })
    res.status(201).json(rating)
  } catch (err) { next(err) }
})

// PUT /stores/:id/ratings/:ratingId - update rating
router.put('/:id/ratings/:ratingId', authMiddleware, async (req, res, next) => {
  try {
    const ratingId = Number(req.params.ratingId)
    const { value } = req.body
    const rating = await Rating.findByPk(ratingId)
    if (!rating) return res.status(404).json({ message: 'Rating not found' })
    if (rating.userId !== req.user.id) return res.status(403).json({ message: 'Not allowed' })
    if (!value || value < 1 || value > 5) return res.status(400).json({ message: 'Invalid rating' })
    rating.value = value
    await rating.save()
    res.json(rating)
  } catch (err) { next(err) }
})

module.exports = router
