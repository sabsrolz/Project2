$(".sidenav").sidenav();

// To do:

// Get data of users and total of asset values (probably on routing side ) // findandcountall does this for us

$.get("api/allUsers", function(userData) {
  const usersArray = [];

  const stockData = [];

  // console.log(usersArray);
  for (let i = 0; i < userData.length; i++) {
    usersArray.push(userData[i]);
    usersArray[i].netWorth = parseFloat(usersArray[i].netWorth);
  }

  $.get("/api/allUserTransactions", function(transactions) {
    for (let i = 0; i < transactions.length; i++) {
      let foundStock = false;
      for (let aeiou = 0; aeiou < stockData.length; aeiou++) {
        if (stockData[aeiou].companyName === transactions[i].companyName) {
          foundStock = true;
        }
      }
      if (foundStock === false) {
        stockData.push({
          companyName: transactions[i].companyName
        });
      }
      // if (!stockData.includes(transactions[i].companyName)) {
      // this was causing a company to be added to stockdata every time
      // please help me to stop using for loops
      // }
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
      // console.log(stockData);
      // console.log(`/api/stock/${stockData[i].companyName}`);
      $.get(`/api/stock/${stockData[i].companyName}`).then(function(liveData) {
        // console.log(liveData);
        stockData[i].currentPrice = liveData.currentStockPrice;
        itemsProcessed++;

        if (itemsProcessed === stockData.length) {
          // console.log(stockData);
          for (let j = 0; j < usersArray.length; j++) {
            // async function asynco() {
            for (const stock in usersArray[j].portfolio) {
              // once again, broken by async
              // note2: this doesn't seem to by why it's borken
              // console.log(stockData);
              for (
                let stockIndex = 0;
                stockIndex < stockData.length;
                stockIndex++
              ) {
                // console.log("GO!");
                if (stockData[stockIndex].companyName === stock) {
                  // console.log(stock + stockData[stockIndex].companyName);
                  // console.log(typeof usersArray[j].netWorth);

                  usersArray[j].netWorth += parseFloat(
                    stockData[stockIndex].currentPrice *
                      usersArray[j].portfolio[stock]
                  );
                  // console.log(usersArray);
                }
              }
            }
            // }
            // usersArray.portfolio is an object, we want
            // foreach in portfolio usersArray.netWorth += portfolio.ELEMENT * stockData[THIS IS AN ARRAY  ヽ(  ⁰Д⁰)ﾉ ]
          }
          usersArray.forEach(element => {
            const newRow = $(
              `<tr class="hoverable"><td>${0}</td><td>${element.firstName} ${
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
