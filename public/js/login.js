$(".sidenav").sidenav();

$("#loginForm").on("submit", function() {
  event.preventDefault();

  // login conversation here
});

$("#signupForm").on("submit", function() {
  event.preventDefault();

  // sign up conversation here
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
