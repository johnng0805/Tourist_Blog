$(function() {
    $(".signin-form").on("click", "#loginBtn", function(event) {
        const loginInfo = {
            email: $("#email-field").val().trim(),
            password: $("#password-field").val().trim()
        };
        $.ajax({
            method: "POST",
            url: "http://localhost:3000/user/login",
            contentType: "application/json",
            data: JSON.stringify(loginInfo),
            encode: true,
            success: function(data) {
                console.log(data);
                location.reload();
            },
            error: function(jqXHR, exception) {
                console.log(jqXHR);
                if (jqXHR.status == 401) {
                    alert("Email or password incorrect.");
                }
            }
        })
    })
})