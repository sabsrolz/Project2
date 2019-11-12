$(".sidenav").sidenav();
$(".modal").modal();

$("#loginForm").on("submit", function() {
  event.preventDefault();

  const login = {
    email: $("#loginEmail").val(),
    password: $("#loginPass").val()
  };
  let userId = -1;
  $.post("/api/user/loginid", login, function(data) {
    if (data === null) {
      $("#failedLog").modal("open");
    } else {
      if (data.id) {
        userId = data.id;
      }
      sessionStorage.setItem("stockAppUser", userId);
      if (sessionStorage.getItem("stockAppUser") > 0) {
        $("#loggedIn").modal("open");
      }
    }
  });
});

$(document).on("click", "#toLeaderBoard", function() {
  window.location.href = "/top";
});

$("#signupForm").on("submit", function() {
  event.preventDefault();
  let userId = -1;
  const newUser = {
    firstName: $("#signupFirstName").val(),
    lastName: $("#signupLastName").val(),
    email: $("#signupEmail").val(),
    password: $("#signupPass").val()
  };

  $.post("/api/user", newUser, function(data) {
    // sign up conversation here
    // console.log(data);
    if (data.id) {
      userId = data.id;
    }
    sessionStorage.setItem("stockAppUser", userId);
  });
});

// switches between two forms
$("#showSignup").on("click", function() {
  event.preventDefault();
  $("#loginForm").addClass("hide");
  $("#signupForm").removeClass("hide");
});

$("#showLogin").on("click", function() {
  event.preventDefault();
  $("#signupForm").addClass("hide");
  $("#loginForm").removeClass("hide");
});
