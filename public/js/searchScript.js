$(".sidenav").sidenav();
$("select").formSelect();
$("#tickerForm").on("submit", function() {
  event.preventDefault();
  const ticker = $("#tickerSearch")
    .val()
    .trim();

  $.ajax({
    url: `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${ticker}&outputsize=compact&interval=60min&apikey=L9NQIQI6RSM70ZCL`
  })
    .then(function(data) {
      console.log(data);
      const dataPoints = [];

      const options = {
        animationEnabled: true,
        titleFontSize: 15,
        theme: "light1",
        title: {
          text: "Monthly Stock Value"
        },
        axisX: {
          valueFormatString: "MMM YYYY"
        },
        axisY: {
          title: "USD",
          includeZero: true
        },
        data: [
          {
            type: "line",
            yValueFormatString: "#,###.##",
            dataPoints: dataPoints
          }
        ]
      };

      for (const element in data["Monthly Time Series"]) {
        dataPoints.push({
          x: new Date(element),
          y: parseFloat(data["Monthly Time Series"][element]["4. close"])
        });
      }
      $("#chartContainer").removeClass("hide");
      $("#stockInfo").removeClass("hide");
      $("#chartContainer").CanvasJSChart(options);
    })
    .catch(function(error) {
      console.log(error);
    });
});

$("#transactionForm").on("submit", function() {
  event.preventDefault();

  $.get(`/api/user${userId}`, function(data) {
    // 1. verify user and password in localstorage match a row in users data table
    //if sell
    // 2. verify transaction can be made (enough money for buy, enough stocks for sell)
  });
  // how do i get userId
  $.post(`/api/transaction/${userId}`, {
    transactionType: $("#transactionType").val(),
    numShares: $("#transationAmount").val()
  });
  $.put();
  // 1. post for transaction table
  // 2. update money for user table
});
