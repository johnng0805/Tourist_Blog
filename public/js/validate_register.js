//Document is reaady
$(document).ready(function () {
    //validate firstname
    $('#firstnamecheck').hide();
    let firstnameError = true;
    $('#register-first_name').keyup(function () {
        validateFirstname();
    });

    function validateFirstname() {
        let firstnameValue = $('#register-first_name').val();
        if (firstnameValue.length == '') {
            $('#firstnamecheck').show();
            firstnameError = false;
            return false;
        }
        else {
            $('#firstnamecheck').hide();
        }
    }

    //validateLastname
    $('#lastnamecheck').hide();
    let lastnameError = true;
    $('#register-last_name').keyup(function () {
        validateLastname();
    });

    function validateLastname() {
        let lastnameValue = $('#register-last_name').val();
        if (lastnameValue.length == '') {
            $('#lastnamecheck').show();
            lastnameError = false;
            return false;
        }
        else {
            $('#lastnamecheck').hide();
        }
    }
    //validate email
    $('#mailcheck').hide();
    let mailError = true;
    $('#register-email').keyup(function () {
        validateEmail();
    });

    function validateEmail() {
        let mailValue = $('#register-email').val();
        if (mailValue.length == '') {
            $('#mailcheck').show();
            mailError = false;
            return false;
        }
        else {
            $('#mailcheck').hide();
        }
    }
//    // Validate phone
//     $('#phonecheck').hide();
//     let phoneError = true;
//     $('#register-phone').keyup(function () {
//         validatePhone();
//     });
//     function validatePhone() {
//         let phoneValue = $('#register-phone').val();
//         if (phoneValue.length == '') {
//             $('#phonecheck').show();
//             phoneError = false;
//             return false;
//         }
//         if (phoneValue.length < 11) {
//             $('#phonecheck').show();
//             $('#phonecheck').html
//                 ("*Invalid phone number!");
//             $('#phonecheck').css("color", "red");
//             phoneError = false;
//             return false;
//         } else {
//             $('#phonecheck').hide();
//         }
//     }
    //validate password
    $('#passcheck').hide();
    let passError = true;
    $('#register-password').keyup(function () {
        validatePassword();
    });
    function validatePassword() {
        let passValue = $('#register-password').val();
        if (passValue.length == '') {
            $('#passcheck').show();
            passError = false;
            return false;
        }
        if ((passValue.length < 3) || (passValue.length > 10)) {
            $('#passcheck').show();
            $('#passcheck').html
                ("*Length of your password must be between 3 and 10!");
            $('#passcheck').css("color", "red");
            passError = false;
            return false;
        } else {
            $('#passcheck').hide();
        }
    }


    // Validate Confirm Password
    $('#conpasscheck').hide();
    let confirmPasswordError = true;
    $('#register-repassword').keyup(function () {
        validateConfirmPasswrd();
    });
    function validateConfirmPasswrd() {
        let confirmPasswordValue = $('#register-repassword').val();
        let passwrdValue = $('#register-password').val();
        if (passwrdValue != confirmPasswordValue) {
            $('#conpasscheck').show();
            $('#conpasscheck').html(
                "*Password didn't Match!");
            $('#conpasscheck').css(
                "color", "red");
            confirmPasswordError = false;
            return false;
        } else {
            $('#conpasscheck').hide();
        }
    }
    //Submit button
    $('#register-submitBtn').click(function () {
        validateFirstname();
        validateLastname();
        //validatePhone();
        validateEmail();
        validatePassword();
        validateConfirmPasswrd();
        if (
            (firstnameError == true) &&
            (lastnameError == true) &&
            //(emailError == true) &&
            (passError == true) &&
            //(phoneError == true) &&
            (confirmPasswordError == true) &&
            (mailError == true)
        ) {
            return true;
        }
        else {
            return false;
        }
    });
});