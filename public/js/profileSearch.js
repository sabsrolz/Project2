$(".sidenav").sidenav();

$("form").on("submit", function() {
  event.preventDefault();
  // search user by name to get id
  $.post("/api/user/namecheck", {
    name: $("#profileSearch")
      .val()
      .trim()
  }).then(function(data) {
    console.log(data);
    if (data.id) {
      $("#profileName").text(`Name: ${data.firstName} ${data.lastName}`);
      $("#profileFunds").text(`Funds: ${data.fundsAvailable}`);
    }
  });
  // findall transactions by id for portfolio
  // api all stocks owned by user and total with funds for net worth

  // display on page

  $("#profileInfo").removeClass("hide");
});
