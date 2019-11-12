$(".sidenav").sidenav();

$("#loginForm").on("submit", function() {
  event.preventDefault();

  const login = {
    email: $("#loginEmail").val(),
    password: $("#loginPass").val()
  };
  let userId = -1;
  $.post("/api/user/loginid", login, function(data) {
    if (data.id) {
      userId = data.id;
    }
    sessionStorage.setItem("stockAppUser", userId);
    if (sessionStorage.getItem("stockAppUser") > 0) {
      console.log("logged in!");
      window.parent.location.href = "/top";
    } else {
      console.log("invalid credentials");
    }
  });
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
    console.log(data);
    if (data.id) {
      userId = data.id;
    }
    sessionStorage.setItem("stockAppUser", userId);
    window.parent.location.href = "/top";
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
