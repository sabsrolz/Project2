$(".sidenav").sidenav();

// To do:

// Get data of users and total of asset values (probably on routing side ) // findandcountall does this for us

$.get("api/allUsers", function(data) {
  const usersArray = data;
  console.log(usersArray);
  usersArray.forEach(userObject => {
    // console.log(userObject.id);
    $.post("/api/allTransactions", userObject);
  });
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
console.log(rowranks);
rowranks.forEach(row => {
  $(row)
    .children()
    .eq(0)
    .text(row.rowIndex);
});
