$(".sidenav").sidenav();

$("form").on("submit", function() {
  event.preventDefault();

  // clear table before new search
  $("#tbody").html(
    "<tr><th>Stock</th><th>Number Owned</th><th>Current Value</th></tr>"
  );

  // search user by name to get id
  $.post("/api/user/namecheck", {
    name: $("#profileSearch")
      .val()
      .trim()
  }).then(function(data) {
    // console.log(data);
    const portfolio = {};
    let networth = 0;
    if (data.id) {
      $("#profileName").text(`Name: ${data.firstName} ${data.lastName}`);
      $("#profileFunds").text(`Funds: $${data.fundsAvailable}`);
      networth += parseFloat(data.fundsAvailable);
    }
    $.post("/api/allTransactions", data, function(transactions) {
      for (let i = 0; i < transactions.length; i++) {
        const element = transactions[i];

        // console.log(element);
        portfolio[`${element.companyName}`] = 0;
        portfolio[element.companyName] += parseInt(element.sharesTraded);
      }
    }).then(function() {
      // console.log(portfolio);
      // console.log(networth);
      for (const stock in portfolio) {
        // console.log(stock);
        if (portfolio[stock] != 0) {
          $.get(`/api/stock/${stock}`, function(data) {
            console.log(data.currentStockPrice);
            $("#tbody").append(
              `<tr><td>${stock}</td><td>${portfolio[stock]}</td><td>$${data.currentStockPrice}</td></tr>`
            );
            networth += data.currentStockPrice * portfolio[stock];
            $("#profileNetWorth").text(`Net Worth: $${networth}`);
          });
        }
        // const element = portfolio[stock];
      }
      // MUST TOTAL NUMBER OF OWNED STOCKS INCLUDING SELL FIRST, OR WILL NOT BE ACCURATE
      // this comes later-----------------
      // ---------------------------
    });
  });

  // findall transactions by id for portfolio
  // api all stocks owned by user and total with funds for net worth

  // display on page

  $("#profileInfo").removeClass("hide");
});
