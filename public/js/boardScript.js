$(".sidenav").sidenav();

// To do:

// Get data of users and total of asset values (probably on routing side ) // findandcountall does this for us

$.get("api/allUsers", function(data) {
  const usersArray = [];
  const stockData = [];

  for (let i = 0; i < data.length; i++) {
    usersArray.push(data[i]);
  }

  // data.forEach(element => {
  //   usersArray.push(element);
  //   // itemsProcessed++;
  // });

  console.log(usersArray);

  $.get("/api/allUserTransactions", function(data) {
    // console.log(data);

    for (let i = 0; i < data.length; i++) {
      if (!stockData.includes(data[i].companyName)) {
        stockData.push({
          companyName: data[i].companyName
        });
      }
    }

    let itemsProcessed = 0;
    for (let i = 0; i < stockData.length; i++) {
      $.get(`/api/stock/${stockData[i].companyName}`).then(function(data) {
        stockData[i].currentPrice = data.currentStockPrice;
        itemsProcessed++;
        if (itemsProcessed === stockData.length) {
          console.log(stockData);
        }
      });
    }

    // data.forEach(element => {
    //   if (!stockData.includes(element.companyName)) {
    //     stockData.push({ companyName: element.companyName });
    //   }
    // });
  });
  //
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
