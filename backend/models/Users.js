const sequelize = require("../config/database");
const { DataTypes } = require("sequelize");
console.log("Sequelize instance: ", sequelize);

const Users = sequelize.define("Users", {
  firstname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  timestamps: true,
});

module.exports = Users;
