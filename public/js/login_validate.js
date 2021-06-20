$(document).ready(function(){

    //Validate Username
    $('#usercheck').hide();
    let usernameError=true;
    $('#email-field').keyup(function(){
        validateUsername();
    });

    function validateUsername()
    {
        let usernameValue=$('#email-field').val();
        if(usernameValue.length =='')
        {
            $('#usercheck').show();
            //window.alert('Please enter username');
            usernameError= false;
            return false;
        }
        else
        {
            $('#usercheck').hide();
        }
    }
    //validation password
    $('#passcheck').hide();
    let passwordError=true;
    $('#password-field').keyup(function()
    {
        validatePassword();
    });

    function validatePassword()
    {
        let passValue=$('#password-field').val();
        if(passValue.length == '')
        {
            $('#passcheck').show();
            passwordError = false;
            return false;
        }
        else{
            $('#passcheck').hide();
        }
    }

    //submitt button
    $('#loginBtn').click(function()
    {
        validateUsername();
        validatePassword();
        if((usernameError == true)&&(passError == true))
        {
            return true;
        }else
        {
            return false;
        }
    });

});