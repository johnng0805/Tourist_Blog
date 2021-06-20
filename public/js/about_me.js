$(function() {
    $.ajax({
        method: "GET",
        url: "http://localhost:3000/user/userInfo",
        success: function(data) {
            if (data) {
                const { first_name, last_name, email, birthday, gender, phone, image } = data;
                $("#usernameTitle").text(first_name + " " + last_name);
                $("#first_name").val(first_name);
                $("#last_name").val(last_name);
                $("#email").val(email);
                $("#phone").val(phone);
                $("#birthday").val(birthday);
                $("#gender").val(gender);
                $("#image").attr("src", `/static/images/uploads/${image}`);
            }
        }
    });

    $("#userInfoForm").on("submit", function(event) {
        event.preventDefault();
        const userForm = new FormData(this);
        $.ajax({
            type: "PUT",
            url: "http://localhost:3000/user/userInfo",
            data: userForm,
            processData: false,
            contentType: false,
            success: function(data) {
                location.reload();
            },
            error: function(jqXHR, exception) {
                if (jqXHR.status === 500) {
                    alert('Image only');
                }
             }
        });
    });
});