module.exports = function(sequelize, DataTypes) {
  var Transactions = sequelize.define(
    "Transactions",
    {
      companyName: DataTypes.STRING,
      ticker: DataTypes.STRING,
      userId: DataTypes.STRING,
      sharesTraded: DataTypes.INTEGER,
      transactionPrice: DataTypes.DECIMAL(10, 2)
    },
    { timestamps: false }
  );
  return Transactions;
};
