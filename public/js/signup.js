$(document).ready(function() {
  // Getting references to our form and input
  var signUpForm = $("form.signup");
  var firstNameInput = $("#firstName-input");
  var lastNameInput = $("#lastName-input");
  var emailInput = $("#email-input");
  var passwordInput = $("#password-input");

  // When the signup button is clicked, we validate the email and password are not blank
  signUpForm.on("submit", function(event) {
    event.preventDefault();
    var userData = {
      firstName: firstNameInput.val().trim(),
      lastName: lastNameInput.val().trim(),
      email: emailInput.val().trim(),
      password: passwordInput.val().trim()
    };

    if (!userData.email || !userData.password) {
      return;
    }
    // If we have an email and password, run the signUpUser function
    signUpUser(userData.email, userData.password);
    emailInput.val("");
    passwordInput.val("");
  });

  // Does a post to the signup route. If successful, we are redirected to the members page
  // Otherwise we log any errors
  function signUpUser(firstName, lastName, email, password) {
    // $.post(
    //   "https://cors-anywhere.herokuapp.com/https://0h0gi4jt5b.execute-api.us-east-2.amazonaws.com/signupTest",
    //   {
    //     firstName: firstName,
    //     lastName: lastName,
    //     email: email,
    //     password: password
    //   }
    // )
    //   .then(function(data) {
    //     //window.location.replace("/members");
    //     console.log(data);
    //     // If there's an error, handle it by throwing up a bootstrap alert
    //   })
    //   .catch(handleLoginErr);
    $.ajax({
      headers: {
        "Content-Type": "application/json",
        "x-amzn-RequestId": "8cc4008a-d5cc-470b-8bf9-d4dcd4d3172f",
        "Access-Control-Allow-Origin": "*",
        "x-amz-apigw-id": "DE84HHdYCYcF9kg=",
        "X-Amzn-Trace-Id": "Root=1-5dcb7500-db8ee15e07f39de8bfc0fe82;Sampled=0"
      },
      type: "POST",
      url: "https://0h0gi4jt5b.execute-api.us-east-2.amazonaws.com/signupTest",
      data: {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password
      }

      //   //OR
      //   //beforeSend: function(xhr) {
      //   //  xhr.setRequestHeader("My-First-Header", "first value");
      //   //  xhr.setRequestHeader("My-Second-Header", "second value");
      //   //}
      // }).done(function(data) {
      //   console.log(data);
    });
  }

  function handleLoginErr(err) {
    $("#alert .msg").text(err.responseJSON);
    $("#alert").fadeIn(500);
  }
});
