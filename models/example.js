// module.exports = function (sequelize, DataTypes) {
//   var Users = sequelize.define("users", {
//     username: {
//       type: DataTypes.STRING,
//       allowNULL: false,
//       validate: {
//         len: [1, 255]
//       }
//     },
//     password: {
//       type: DataTypes.STRING,
//       allowNULL: false,
//       validate: {
//         len: [1, 255]
//       }
//     },
//     money: {
//       type: DataTypes.INT,
//       allowNULL: false,
//     },
//   });

//   var Transactions = sequelize.define("transactions", {
//     transaction: {
//       type: DataTypes.INT,
//       allowNULL: false
//     },
//     ticker: {
//       type: DataTypes.STRING,
//       allowNULL: false,
//       validate: {
//         len: [1, 255]
//       }
//     },

//   });
//   return Transactions, Users;
// };