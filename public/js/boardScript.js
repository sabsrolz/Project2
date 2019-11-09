$(".sidenav").sidenav();

// To do:

// Get data of users and total of asset values (probably on routing side)

// Display on table, and sort by net worth (https://blog.niklasottosson.com/javascript/jquery-sort-table-rows-on-column-value/)

function sortTable() {
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
}
sortTable();

function rankings() {
  const rows = $("#leaderboard tbody tr").get();
  console.log(rows);
  rows.forEach(row => {
    $(row)
      .children()
      .eq(0)
      .text(row.rowIndex);
  });
}
rankings();
