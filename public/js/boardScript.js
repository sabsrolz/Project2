$(".sidenav").sidenav();

// To do:

// Get data of users and total of asset values (probably on routing side ) // findandcountall does this for us

$.get("api/allUsers", function(userData) {
  const usersArray = [];

  const stockData = [];

  // console.log(usersArray);
  for (let i = 0; i < userData.length; i++) {
    usersArray.push(userData[i]);
  }

  $.get("/api/allUserTransactions", function(transactions) {
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
          // console.log(stockData);
          for (let j = 0; j < usersArray.length; j++) {
            //  I DON'T KNOW HOW TO DO THIS WITHOUT FOR-IN BUT IT'S ASYNC

            for (const stock in usersArray[j].portfolio) {
              // console.log(stock);
              for (
                let stockIndex = 0;
                stockIndex < stockData.length;
                stockIndex++
              ) {
                if (stockData[stockIndex].companyName === stock) {
                  // console.log(stock + stockData[stockIndex].companyName);

                  let newTotal =
                    parseFloat(usersArray[j].netWorth) +
                    parseFloat(
                      stockData[stockIndex].currentPrice *
                        usersArray[j].portfolio[stock]
                    );

                  usersArray[j].netWorth = newTotal;
                }
              }
            }
            // usersArray.portfolio is an object, we want
            // foreach in portfolio usersArray.netWorth += portfolio.ELEMENT * stockData[THIS IS AN ARRAY  ヽ(  ⁰Д⁰)ﾉ ]
          }
          usersArray.forEach(element => {
            const newRow = $(
              `<tr><td>${0}</td><td>${element.firstName} ${
                element.lastName
              }</td><td>${element.funds}</td><td>${element.netWorth}</td></tr>`
            );
            $("#tbody").append(newRow);
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
