$(function() {
    $('form[name="postTitle"]').on("click", 'button[name="postTitleBtn"]', function(event) {
        event.preventDefault();
        var form = new FormData(this);
        $.ajax({
            type: "POST",
            url: "http://localhost:3000/blog/view_blog",
            data: form,
            processData: false,
            success: function(data) {
                location.href = "http://localhost:3000/blog_detail";
            }
        })
    });
});