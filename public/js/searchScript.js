$(".sidenav").sidenav();
$("select").formSelect();
$(".modal").modal();

$.get("/api/");

// gets user data on load
let userData;
const userId = {
  userId: sessionStorage.getItem("stockAppUser")
};
if (sessionStorage.getItem("stockAppUser") > 0) {
  $.post("api/user/idcheck", userId, function(data) {
    // console.log(data);
    userData = data;
  });
}

$("#tickerForm").on("submit", function() {
  event.preventDefault();
  const company = $("#stockSearch")
    .val()
    .trim();

<<<<<<< HEAD
  $.ajax({
      url: `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${company}&apikey=${api_key}`
    })
    .then(function (data) {
      console.log(data)
=======
  // fill card with display info, and data for post use
  $.get(`/api/stock/${company}`, function(data) {
    $("#stockInfoName").text("Name: " + data.companyName);
    $("#stockInfoTicker").text("Ticker: " + data.ticker);
    $("#stockInfoPrice").text("Price: " + data.currentStockPrice);

    $("#stockInfo").data("name", data.companyName);
    $("#stockInfo").data("ticker", data.ticker);
    $("#stockInfo").data("price", data.currentStockPrice);
    // console.log(data);

    // following section for CHART only:
    const tickerData = $("#stockInfo").data();
    // console.log(tickerData.ticker);
    // console.log(tickerData.price);
    $.ajax({
      url: `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${tickerData.ticker}&outputsize=compact&interval=60min&apikey=L9NQIQI6RSM70ZCL`
    }).then(function(data) {
      // console.log(data);
>>>>>>> 91287e7777a404f30b74f122a71c9f71c5e0c54a
      const dataPoints = [];

      axios.get(`api/stock/google`).then(response => {
        console.log(response)
      })
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
        // console.log(data["Monthly Time Series"][element]["4. close"]);
        dataPoints.push({
          x: new Date(element),
          y: parseFloat(data["Monthly Time Series"][element]["4. close"])
        });
      }
      if (dataPoints.length > 0) {
        // console.log(dataPoints);
        $("#chartContainer").removeClass("hide");
        $("#chartContainer").CanvasJSChart(options);
      }
      $("#stockInfo").removeClass("hide");
    });
    $("#transactionSubmitBtn").on("click", function() {
      event.preventDefault();
      $(".modal").modal("open");
      $("#transactionConfirmName").text(data.companyName);
      $("#transactionConfirmNumber").text($("#transactionAmount").val());
      $("#transactionConfirmType").text($("#transactionType").val());
      $("#transactionConfirmPrice").text(data.currentStockPrice);
      $("#transactionConfirmTotal").text(
        data.currentStockPrice * $("#transactionAmount").val()
      );
    });
  }).catch(function(error) {
    console.log(error);
  });
});

$("#confirmSubmit").on("click", function() {
  event.preventDefault();
  $("#transactionForm");
  formSubmit();
});

function formSubmit() {
  if (userData) {
    // console.log(userData);
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
    // console.log(body);
    $.post(`/api/transaction/${userData.id}`, body, function(data) {
      // console.log(data);
      location.reload();
    });
  } else {
    alert("You are not logged in!");
  }
}
