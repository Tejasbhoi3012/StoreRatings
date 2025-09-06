const { DataTypes } = require('sequelize')
module.exports = (sequelize) => {
  return sequelize.define('Rating', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    value: { type: DataTypes.INTEGER, allowNull: false }, // 1..5
    userId: { type: DataTypes.INTEGER, allowNull: false },
    storeId: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    tableName: 'ratings',
    timestamps: true
  })
}
