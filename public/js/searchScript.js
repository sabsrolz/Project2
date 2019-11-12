$(".sidenav").sidenav();
$("select").formSelect();
$(".modal").modal();

// gets user data on load
let userData;
const userId = {
  userId: sessionStorage.getItem("stockAppUser")
};
if (sessionStorage.getItem("stockAppUser") > 0) {
  $.post("api/user/idcheck", userId, function(data) {
    // console.log(data);
    userData = data;
    // console.log(data);
  });
} else {
  $("#modal-login").modal("open");
  $("#toLogin").on("click", function() {
    window.location.href = "/";
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

    // following section for CHART only:

    $.get(`/api/monthly/${data.ticker}`).then(function(chartData) {
      const dataPoints = [];

      for (
        let i = 0;
        i < Object.keys(chartData["Monthly Time Series"]).length;
        i++
      ) {
        const element = Object.keys(chartData["Monthly Time Series"])[i];

        dataPoints.push({
          x: new Date(element),
          y: parseFloat(chartData["Monthly Time Series"][element]["4. close"])
        });
      }

      // console.log(dataPoints);
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

      if (dataPoints.length > 0) {
        $("#chartContainer").removeClass("hide");
        $("#chartContainer").CanvasJSChart(options);
      }
      $("#stockInfo").removeClass("hide");
    });
    $("#transactionSubmitBtn").on("click", function() {
      event.preventDefault();
      $("#modal").modal("open");
      $("#transactionConfirmName").text(data.companyName);
      $("#transactionConfirmNumber").text($("#transactionAmount").val());
      $("#transactionConfirmType").text($("#transactionType").val());
      $("#transactionConfirmPrice").text(data.currentStockPrice);
      $("#transactionConfirmTotal").text(
        data.currentStockPrice * $("#transactionAmount").val()
      );
    });
  }).catch(function(error) {
    console.log("error " + error);
  });
});

$("#confirmSubmit").on("click", function() {
  event.preventDefault();
  $("#transactionForm");
  formSubmit();
});

function formSubmit() {
  if (userData.id) {
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
    $.post(`/api/transaction/${userData.id}`, body, function(response) {
      if (response) {
        console.log(response);
        // $("#success").modal();
      }
    });
  }
}
