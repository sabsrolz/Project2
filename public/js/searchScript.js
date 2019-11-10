$(".sidenav").sidenav();
$("select").formSelect();

$.get("/api/");

// gets user data on load
let userData;
const userId = {
  userId: sessionStorage.getItem("stockAppUser")
};
if (sessionStorage.getItem("stockAppUser") > 0) {
  $.post("api/user/idcheck", userId, function(data) {
    console.log(data);
    userData = data;
  });
}
$("#tickerForm").on("submit", function() {
  event.preventDefault();
  const company = $("#stockSearch")
    .val()
    .trim();

  // fill card with display info, and data for post use
  $.get(`/api/stock/${company}`, function(data) {
    $("#stockInfoName").text("Name: " + data.companyName);
    $("#stockInfoTicker").text("Ticker: " + data.ticker);
    $("#stockInfoPrice").text("Price: " + data.currentStockPrice);

    $("#stockInfo").data("name", data.companyName);
    $("#stockInfo").data("ticker", data.ticker);
    $("#stockInfo").data("price", data.currentStockPrice);
    console.log(data);

    // following section for CHART only:
    const tickerData = $("#stockInfo").data();
    console.log(tickerData.ticker);
    console.log(tickerData.price);
    $.ajax({
      url: `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${tickerData.ticker}&outputsize=compact&interval=60min&apikey=L9NQIQI6RSM70ZCL`
    }).then(function(data) {
      // console.log(data);
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
          y: parseFloat(data["Monthly Time Series"][element]["4.close"])
        });
      }
      if (dataPoints.length > 0) {
        $("#chartContainer").removeClass("hide");
      }
      $("#stockInfo").removeClass("hide");
      $("#chartContainer").CanvasJSChart(options);
    });
  }).catch(function(error) {
    console.log(error);
  });
});

$("#transactionForm").on("submit", function() {
  event.preventDefault();
  console.log(userData);
  // userid in sessionstorage
  const tickerData = $("#stockInfo").data();

  const body = {
    numShares: $("#transactionAmount").val(),
    transactionType: $("#transactionType").val(),
    currentPrice: tickerData.price,
    companyName: tickerData.name,
    ticker: tickerData.ticker,
    fundsAvailable: userData.fundsAvailable
  };
  console.log(body);
  if (userData) {
    $.post(`/api/transaction/${userData.id}`, body, function(data) {
      console.log(data);
    });
  } else {
    alert("You are not logged in!");
  }
});
