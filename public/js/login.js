$(".sidenav").sidenav();

$("#loginForm").on("submit", function() {
  event.preventDefault();

  // login conversation here
  localStorage.setItem("stockAppUser", {
    email: $("#signupEmail").val(),
    password: $("#signupPassword").val()
  });
});

$("#signupForm").on("submit", function() {
  event.preventDefault();
  const newUser = {
    firstname: $("#signupFirstName").val(),
    lastname: $("#signupLastName").val(),
    email: $("#signupEmail").val(),
    password: $("#signupPassword").val()
  };
  $.post("/api/signup", newUser);
  // sign up conversation here
  localStorage.setItem("stockAppUser", {
    email: newUser.email,
    password: newUser.password
  });
});

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
