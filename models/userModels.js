const { db, DataTypes } = require("../config/database");

const User = db.define("user", {
  name: {
    type: DataTypes.STRING,
  },
  address: {
    type: DataTypes.STRING,
    // allowNull defaults to true
  },
  email: {
    type: DataTypes.STRING,
  },
  password: {
    type: DataTypes.STRING,
  },
});
User.sync()