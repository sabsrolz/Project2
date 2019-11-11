$(".sidenav").sidenav();

// To do:

// Get data of users and total of asset values (probably on routing side ) // findandcountall does this for us

$.get("api/allUsers", function(data) {
  const usersArray = [];
  const stockData = [];

  data.forEach(element => {
    usersArray.push(element);
  });

  console.log(usersArray);

  $.get("/api/allUserTransactions", function(data) {
    console.log(data);
    data.forEach(element => {
      if (!stockData.includes(element.companyName)) {
        stockData.push({ companyName: element.companyName });
      }
    });
  }).then(function() {
    stockData.forEach(element => {
      $.get(`/api/stock/${element.companyName}`).then(function(data) {
        console.log(data);
        // element.currentPrice = data[currentStockPrice];
        // console.log(stockData);
      });
    });
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
