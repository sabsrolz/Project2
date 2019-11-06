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
