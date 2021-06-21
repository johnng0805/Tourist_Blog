$(function() {
    $.ajax({
        type: "GET",
        url: "http://localhost:3000/blog/personalBlog",
        success: function(data) {
            if (data) {
                console.log(data);
                $.each(data, function(key, value) {
                    if (value.image) {
                        $("#photoList").append(
                            `<li>
                                <img src='/static/images/uploads/${value.image}'>
                            </li>`
                        );
                    }
                });
            }
        }
    });
});