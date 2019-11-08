module.exports = function(sequelize, DataTypes) {
  var transactions = sequelize.define("transactions", {
    companyName: DataTypes.STRING,
    ticker: DataTypes.STRING,
    userId: DataTypes.STRING,
    sharesTraded: DataTypes.INTEGER,
    transactionPrice: DataTypes.DECIMAL
  });
  return transactions;
};
