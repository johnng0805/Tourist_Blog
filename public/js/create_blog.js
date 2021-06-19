$(function() {
    $("#main_form").on('submit', function(event) {
        event.preventDefault();
        var blogForm = new FormData(this);
        $.ajax({
            url: $(this).attr('action'),
            type: $(this).attr('method'),
            data: blogForm,
            processData: false,
            contentType: false,
            success: function(data) {
                alert('Posted');
            },
            error: function(jqXHR, exception) {
               if (jqXHR.status === 500) {
                   alert('Image only');
               }
            }
        });
    });
});