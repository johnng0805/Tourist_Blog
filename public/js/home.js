$(function() {
    var userProfile;
    $.ajax({
        type: "GET",
        url: "http://localhost:3000/blog",
        success: function(data) {
            if (data) {
                $.each(data, function(key, value) {;
                    console.log(value.id);
                    const id = String.fromCharCode(...value.id.data);
                    const userID = String.fromCharCode(...value.user_id.data);
                    console.log(id);
                    var img;
                    if (value.image) {
                        img = `<img src="/static/images/uploads/${value.image}">`;
                    } else {
                        img = ``;
                    }
                    $.ajax({
                        type: "GET",
                        url: `http://localhost:3000/user/${userID}`,
                        success: function(data) {
                            if (data) {
                                if (data.image) {
                                    userProfile = `<img src="/static/images/uploads/${data.image}">`;
                                    console.log(userProfile + ' ' + img);
                                } else {
                                    userProfile = ``;
                                }
                                $("#blogContainer").append(
                                    `<div class="central-meta item">
                                        <div class="user-post">
                                            <div class="friend-info">
                                                <figure>
                                                    ${userProfile}
                                                </figure>
                                                <div class="friend-name">
                                                    <ins>
                                                        <a href="#">${data.first_name + ' ' + data.last_name}</a>
                                                    </ins>
                                                    <span>Published: ${value.date}</span>
                                                </div>
                                                <div class="post-meta">
                                                    <div class="description">
                                                        <form name="postTitle">
                                                            <input type="hidden" name="id" value="${id}">
                                                            <button type="button" name="postTitleBtn" class="link-button">
                                                                ${value.title}
                                                            </button>
                                                        </form>
                                                    </div>
                                                    <div class="post-image">
                                                        ${img}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>`
                                )
                            }
                        }
                    });
                    console.log(userProfile);
                });
            }
        }
    });
    $(document.body).on("click", 'button[name="postTitleBtn"]', function(event) {
        event.preventDefault();
        const id = {
            id: $(this).prev().val()
        };
        $.ajax({
            type: "POST",
            url: "http://localhost:3000/blog/view_blog",
            contentType: "application/json",
            data: JSON.stringify(id),
            encode: true,
            success: function(data) {
                location.href = "http://localhost:3000/blog_detail";
            }
        })
    })
    $("#logoutA").on("click", function(event) {
        event.preventDefault();
        $.ajax({
            type: "POST",
            url: "http://localhost:3000/user/logout",
            success: function(data) {
                location.reload();
            }
        })
    })
});