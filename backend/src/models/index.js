const { Sequelize } = require('sequelize')
require('dotenv').config()

const connectionString = process.env.DATABASE_URL
const sequelize = new Sequelize(connectionString, {
  logging: false,
})

const User = require('./user')(sequelize)
const Store = require('./store')(sequelize)
const Rating = require('./rating')(sequelize)

// Associations
User.hasMany(Rating, { foreignKey: 'userId' })
Rating.belongsTo(User, { foreignKey: 'userId' })

Store.hasMany(Rating, { foreignKey: 'storeId' })
Rating.belongsTo(Store, { foreignKey: 'storeId' })

User.hasMany(Store, { foreignKey: 'ownerId' })
Store.belongsTo(User, { as: 'owner', foreignKey: 'ownerId' })

module.exports = { sequelize, User, Store, Rating }
