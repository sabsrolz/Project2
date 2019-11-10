$(".sidenav").sidenav();

$("#loginForm").on("submit", function() {
  event.preventDefault();

  const login = {
    loginEmail: $("#loginEmail").val(),
    loginPassword: $("#loginPass").val()
  };
  let userId = -1;
  $.post("api/user/loginid", login, function(data) {
    if (data.id) {
      userId = data.id;
    }
    sessionStorage.setItem("stockAppUser", userId);
    if (sessionStorage.getItem("stockAppUser") > 0) {
      console.log("logged in!");
    } else {
      console.log("invalid credentials");
    }
  });
});

$("#signupForm").on("submit", function() {
  event.preventDefault();
  const newUser = {
    firstName: $("#signupFirstName").val(),
    lastName: $("#signupLastName").val(),
    email: $("#signupEmail").val(),
    password: $("#signupPass").val()
  };
  $.post("/api/user", newUser);
  // sign up conversation here

  sessionStorage.setItem("stockAppUser", {
    email: newUser.email,
    password: newUser.password
  });

  $.get("/api/user/login", newUser, function(data) {
    console.log(data);
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
