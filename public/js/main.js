(function($) {

	"use strict";

	var fullHeight = function() {

		$('.js-fullheight').css('height', $(window).height());
		$(window).resize(function(){
			$('.js-fullheight').css('height', $(window).height());
		});

	};
	fullHeight();

	$(".toggle-password").click(function() {

	  $(this).toggleClass("fa-eye fa-eye-slash");
	  var input = $($(this).attr("toggle"));
	  if (input.attr("type") == "password") {
	    input.attr("type", "text");
	  } else {
	    input.attr("type", "password");
	  }
	});

	$("#registerForm").on('submit', function(event) {
		var gender;
		if ($("#register-gendel_male").attr("checked") == "checked") {
			gender = "Male";
		} else {
			gender = "Female";
		}

		const newUser = {
			first_name: $("#register-first_name").val().trim(),
			last_name: $("#register-last_name").val().trim(),
			birthday: $("#register-birthday").val(),
			gender: gender,
			email: $("#register-email").val().trim(),
			phone: $("#register-phone").val().trim()
		};

		$.ajax({
			method: "POST",
			url: "http://localhost:3000/user/register",
			contentType: "application/json",
			data: JSON.stringify(newUser),
			encode: true,
			success: function(data) {
				console.log(data);
				if (data.status) {
					alert('Email taken');
				} else {
					location.href = '/';
				}
			}
		})
	});

})(jQuery);
