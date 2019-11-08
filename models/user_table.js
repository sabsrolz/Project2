module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define("user", {
    userId: { type: Sequelize.integer, autoIncremenet: true, primaryKey: true },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    fundsAvailable: DataTypes.DECIMAL
  });
  return user;
};
