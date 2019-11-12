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
        portfolio[`${element.companyName}`] = 0;
      }
      for (let i = 0; i < transactions.length; i++) {
        const element = transactions[i];

        portfolio[element.companyName] += parseInt(element.sharesTraded);
      }
      if (Object.keys(portfolio).length !== 0) {
        // console.log(portfolio);
        // console.log(networth);
        for (const stock in portfolio) {
          if (portfolio[stock] != 0) {
            $.get(`/api/stock/${stock}`, function(data) {
              // console.log(data.currentStockPrice);
              $("#tbody").append(
                `<tr><td>${stock}</td><td>${portfolio[stock]}</td><td>$${data.currentStockPrice}</td></tr>`
              );
              networth += data.currentStockPrice * portfolio[stock];
              $("#profileNetWorth").text(`Net Worth: $${networth}`);
            });
          }
        }
      } else {
        $("#profileNetWorth").text(`Net Worth: $${networth}`);
      }
    });
  });

  $("#profileInfo").removeClass("hide");
});
