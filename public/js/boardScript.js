$(".sidenav").sidenav();

// To do:

// Get data of users and total of asset values (probably on routing side - nope i lied let's do it here - Sean)

$.get();

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
