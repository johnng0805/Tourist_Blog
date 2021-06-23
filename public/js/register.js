$(function() {
    $("#registerForm").on('click', "#register-submitBtn", function(event) {
		const newUser = {
			first_name: $("#register-first_name").val().trim(),
			last_name: $("#register-last_name").val().trim(),
			birthday: $("#register-birthday").val(),
			gender: $("input[name='gender']:checked").val(),
			email: $("#register-email").val().trim(),
			phone: $("#register-phone").val().trim(),
			password: $("#register-password").val().trim(),
		};
        console.log(newUser);

		$.ajax({
			method: "POST",
			url: "http://localhost:3000/user/register",
			contentType: "application/json",
			data: JSON.stringify(newUser),
			encode: true,
			success: function(data) {
				console.log(data);
				location.href = 'http://localhost:3000';
			},
            error: function(jqXHR, exception) {
                event.preventDefault();
                console.log(jqXHR);
                if (jqXHR.status == 409) {
                    alert('Email taken');
                }
                if (jqXHR.status == 400) {
                    alert('Invalid input');
                }
            }
		});
	});
});