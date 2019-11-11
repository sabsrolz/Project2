$(".sidenav").sidenav();

// To do:

// Get data of users and total of asset values (probably on routing side ) // findandcountall does this for us

$.get("api/allUsers", function(userData) {
  const usersArray = [];
  const stockData = [];

  for (let i = 0; i < userData.length; i++) {
    usersArray.push(userData[i]);
  }

  console.log(usersArray);

  $.get("/api/allUserTransactions", function(transactions) {
    console.log(transactions);

    for (let i = 0; i < transactions.length; i++) {
      if (!stockData.includes(transactions[i].companyName)) {
        stockData.push({
          companyName: transactions[i].companyName
        });
      }
      usersArray[transactions[i].userId - 1].portfolio[
        `${transactions[i].companyName}`
      ] = 0;
    }
    for (let i = 0; i < transactions.length; i++) {
      usersArray[transactions[i].userId - 1].portfolio[
        `${transactions[i].companyName}`
      ] += transactions[i].sharesTraded;
    }

    let itemsProcessed = 0;
    for (let i = 0; i < stockData.length; i++) {
      $.get(`/api/stock/${stockData[i].companyName}`).then(function(liveData) {
        stockData[i].currentPrice = liveData.currentStockPrice;
        itemsProcessed++;
        if (itemsProcessed === stockData.length) {
          console.log(stockData);
          for (let i = 0; i < usersArray.length; i++) {
            //  I DON'T KNOW HOW TO DO THIS WITHOUT FOR-IN BUT IT'S ASYNC
            // usersArray.portfolio is an object, we want
            // foreach in portfolio usersArray.netWorth += portfolio.ELEMENT * stockData[THIS IS AN ARRAY  ヽ(  ⁰Д⁰)ﾉ ]
          }
        }
      });
    }
  });
});

const rows = $("#leaderboard tbody tr").get();
rows.sort(function(first, second) {
  let A = $(first)
    .children("td")
    .eq(3)
    .text()
    .toUpperCase();
  let B = $(second)
    .children("td")
    .eq(3)
    .text()
    .toUpperCase();
  return B - A;
});
rows.forEach(row => {
  $("#leaderboard")
    .children("tbody")
    .append(row);
});

const rowranks = $("#leaderboard tbody tr").get();
rowranks.forEach(row => {
  $(row)
    .children()
    .eq(0)
    .text(row.rowIndex);
});
