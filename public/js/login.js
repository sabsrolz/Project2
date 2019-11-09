$(".sidenav").sidenav();

$("#loginForm").on("submit", function() {
  event.preventDefault();

  const login = {
    email: $("#signupEmail").val(),
    password: $("#signupPassword").val()
  };
  $.get("api/getAllUsers", function(data) {
    let validLogin = false;
    for (const key in data) {
      const element = data[key];
      // if (data.email === login.email
      // && data.password === login.password){
      // validLogin = true
      //
      // }
    }
  });
  // login conversation here
  localStorage.setItem("stockAppUser", login);
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
  localStorage
    .setItem("stockAppUser", {
      email: newUser.email,
      password: newUser.password
    })
    .then(function() {
      $.get("/api/");
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
