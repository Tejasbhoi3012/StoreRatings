require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { sequelize } = require('./models')
const bcrypt = require("bcrypt")
const { User } = require("./models")
// Import routes
const authRoutes = require('./routes/auth')
const adminRoutes = require('./routes/admin')
const storesRoutes = require('./routes/stores')
const ownerRoutes = require('./routes/owner')

const app = express()
app.use(cors())
app.use(express.json())

// Health check
app.get('/', (req, res) => res.json({ message: 'Store Ratings API' }))

// Mount routes with `/api/...` prefix
app.use('/api/auth', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/stores', storesRoutes)
app.use('/api/owner', ownerRoutes)

// Error handler (keeps API consistent)
app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).json({ message: err.message || 'Server error' })
})

const PORT = process.env.PORT || 5000

async function start() {
  try {
    await sequelize.authenticate()
    console.log('DB connected')
    await sequelize.sync() // dev only, use migrations in prod
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
    await sequelize.sync()
    await seedAdmin()
  } catch (err) {
    console.error('Failed to start', err)
    process.exit(1)
  }
}
async function seedAdmin() {
  const admin = await User.findOne({ where: { role: "admin" } })
  if (!admin) {
    const passwordHash = await bcrypt.hash("admin123", 10)
    await User.create({
      name: "Super Admin",
      email: "admin@mail.com",
      passwordHash,
      role: "admin"
    })
    console.log("Default admin created: admin@mail.com / admin123")
  }
}
start()
