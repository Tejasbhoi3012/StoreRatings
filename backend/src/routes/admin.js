const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const { Op } = require('sequelize')
const { authMiddleware, roleGuard } = require('../middleware/auth')
const { User, Store, Rating } = require('../models')

// All admin routes require authentication + admin role
router.use(authMiddleware, roleGuard('admin'))

// Dashboard stats
router.get('/stats', async (req, res, next) => {
  try {
    const users = await User.count()
    const stores = await Store.count()
    const ratings = await Rating.count()
    res.json({ users, stores, ratings })
  } catch (err) {
    next(err)
  }
})

// 👥 List users with optional filters
router.get('/users', async (req, res, next) => {
  try {
    const { name, email, address, role } = req.query
    const where = {}
    if (role) where.role = role
    if (name) where.name = { [Op.iLike]: `%${name}%` }
    if (email) where.email = { [Op.iLike]: `%${email}%` }
    if (address) where.address = { [Op.iLike]: `%${address}%` }

    const users = await User.findAll({
      where,
      attributes: ['id', 'name', 'email', 'address', 'role']
    })
    res.json(users)
  } catch (err) {
    next(err)
  }
})

// User detail; include owner average rating if role=owner
router.get('/users/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const user = await User.findByPk(id, {
      attributes: ['id', 'name', 'email', 'address', 'role']
    })
    if (!user) return res.status(404).json({ message: 'User not found' })

    let ownerAverageRating = null
    if (user.role === 'owner') {
      // get stores owned and compute average across their ratings
      const stores = await Store.findAll({ where: { ownerId: id } })
      const storeIds = stores.map(s => s.id)
      if (storeIds.length) {
        const ratings = await Rating.findAll({ where: { storeId: storeIds } })
        const avg = ratings.length ? ratings.reduce((a,b)=>a+b.value,0)/ratings.length : 0
        ownerAverageRating = Number(avg.toFixed(2))
      } else {
        ownerAverageRating = 0
      }
    }

    res.json({ ...user.toJSON(), ownerAverageRating })
  } catch (err) {
    next(err)
  }
})

// ➕ Create a new user (admin can create admin/owner/user)
router.post('/users', async (req, res, next) => {
  try {
    const { name, email, password, address, role } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' })
    }

    const existing = await User.findOne({ where: { email } })
    if (existing) return res.status(400).json({ message: 'Email already exists' })

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await User.create({
      name,
      email,
      passwordHash,
      address,
      role: role || 'user'
    })

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    })
  } catch (err) {
    next(err)
  }
})

// Delete a user (and related entities):
// - Remove their ratings
// - If they are an owner, unassign their stores (ownerId = null)
router.delete('/users/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const user = await User.findByPk(id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    // delete ratings by this user
    await Rating.destroy({ where: { userId: id } })
    // unassign stores if owner
    await Store.update({ ownerId: null }, { where: { ownerId: id } })
    // delete user
    await user.destroy()

    res.json({ message: 'User deleted' })
  } catch (err) {
    next(err)
  }
})

// 🏪 List stores with average rating
router.get('/stores', async (req, res, next) => {
  try {
    const { name, email, address } = req.query
    const where = {}
    if (name) where.name = { [Op.iLike]: `%${name}%` }
    if (email) where.email = { [Op.iLike]: `%${email}%` }
    if (address) where.address = { [Op.iLike]: `%${address}%` }

    const stores = await Store.findAll({
      where,
      include: [{ model: Rating, attributes: ['value'] }]
    })

    const result = await Promise.all(
      stores.map(async (s) => {
        const ratings = await Rating.findAll({ where: { storeId: s.id } })
        const avg = ratings.length
          ? ratings.reduce((a, b) => a + b.value, 0) / ratings.length
          : 0
        return {
          id: s.id,
          name: s.name,
          email: s.email,
          address: s.address,
          averageRating: Number(avg.toFixed(2)),
          ownerId: s.ownerId
        }
      })
    )

    res.json(result)
  } catch (err) {
    next(err)
  }
})

// Create a store and optionally assign owner
router.post('/stores', async (req, res, next) => {
  try {
    const { name, email, address, ownerId } = req.body
    if (!name) return res.status(400).json({ message: 'Name is required' })

    const store = await Store.create({ name, email, address, ownerId })

    // Compute average rating for frontend
    const result = {
      id: store.id,
      name: store.name,
      email: store.email,
      address: store.address,
      averageRating: 0
    }

    res.status(201).json(result)
  } catch (err) {
    next(err)
  }
})

// Delete a store (and its ratings)
router.delete('/stores/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    const store = await Store.findByPk(id)
    if (!store) return res.status(404).json({ message: 'Store not found' })
    await Rating.destroy({ where: { storeId: id } })
    await store.destroy()
    res.json({ message: 'Store deleted' })
  } catch (err) {
    next(err)
  }
})

// Assign or change a store's owner
router.put('/stores/:id/owner', async (req, res, next) => {
  try {
    const storeId = Number(req.params.id)
    const { ownerId } = req.body

    const store = await Store.findByPk(storeId)
    if (!store) return res.status(404).json({ message: 'Store not found' })

    if (ownerId === null || ownerId === undefined) {
      store.ownerId = null
    } else {
      const owner = await User.findByPk(ownerId)
      if (!owner) return res.status(404).json({ message: 'Owner user not found' })
      if (owner.role !== 'owner') return res.status(400).json({ message: 'User is not an owner' })
      store.ownerId = ownerId
    }

    await store.save()
    return res.json({
      id: store.id,
      name: store.name,
      email: store.email,
      address: store.address,
      ownerId: store.ownerId
    })
  } catch (err) {
    next(err)
  }
})



// Update user role (admin only)
router.put('/users/:id/role', async (req, res, next) => {
  try {
    const { role } = req.body

    // Only allow valid roles
    if (!['admin', 'owner', 'user'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' })
    }

    const user = await User.findByPk(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    user.role = role
    await user.save()

    res.json({ message: `User role updated to ${role}`, user })
  } catch (err) {
    next(err)
  }
})



module.exports = router
