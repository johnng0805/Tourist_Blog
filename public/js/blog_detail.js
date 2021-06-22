$(function() {
    var userProfile;
    $.ajax({
        type: "GET",
        url: "http://localhost:3000/blog/blog_detail",
        success: function(data) {
            if (data) {
                console.log(data.id);
                console.log(data.content);
                const id = String.fromCharCode(...data.id.data);
                const userID = String.fromCharCode(...data.user_id.data);
                console.log(id);
                var img, postImg;
                if (data.image) {
                    img = `<img src="/static/images/uploads/${data.image}">`;
                    postImg = img;
                } else {
                    img = `<img src="/static/images/slider_1.jpg">`;
                    postImg = ``;
                }
                $.ajax({
                    type: "GET",
                    url: `http://localhost:3000/user/${userID}`,
                    success: function(userData) {
                        if (userData) {
                            if (userData.image) {
                                userProfile = `<img src="/static/images/uploads/${userData.image}">`;
                                console.log(userProfile + ' ' + img);
                            } else {
                                userProfile = ``;
                            }
                            $("#postCover").append(
                                `${img}`
                            );
                            $("#blogContainer").append(
                                `<div class="central-meta item">
                                    <div class="user-post">
                                        <div class="friend-info">
                                            <figure>
                                                ${userProfile}
                                            </figure>
                                            <div class="friend-name">
                                                <ins>
                                                    <a href="#">${userData.first_name + ' ' + userData.last_name}</a>
                                                </ins>
                                                <span>Published: ${data.date}</span>
                                            </div>
                                            <div class="post-meta">
                                                <div class="post-image">
                                                    ${postImg}
                                                </div>
                                                <div class="description my-3">
                                                    <h1>${data.title}</h1>
                                                    <p style="white-space: pre-wrap;" class="text-justify font-weight-normal">${data.content}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>`
                            );
                        }
                    }
                });
                console.log(userProfile);
            }
        }
    });
    $("#logoutA").on("click", function(event) {
        event.preventDefault();
        $.ajax({
            type: "POST",
            url: "http://localhost:3000/user/logout",
            success: function(data) {
                location.reload();
            }
        })
    });
});