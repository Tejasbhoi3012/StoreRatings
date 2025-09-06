const { DataTypes } = require('sequelize')
module.exports = (sequelize) => {
  return sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(255), allowNull: false },
    email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
    passwordHash: { type: DataTypes.STRING(255), allowNull: false },
    address: { type: DataTypes.TEXT, allowNull: true },
    role: { type: DataTypes.ENUM('admin', 'user', 'owner'), defaultValue: 'user' }
  }, {
    tableName: 'users',
    timestamps: true
  })
}
