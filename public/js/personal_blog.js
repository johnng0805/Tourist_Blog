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
                                            <div class="blog-action">
                                                <form class="float-right">
                                                    <input type="hidden" name="id" value="${id}">
                                                    <button type="submit" name="deleteBtn" class="updateBtn btn">
                                                        <i class="ti-close"></i>
                                                    </button>
                                                </form>
                                                <button type="button" name="updateBtn" class="updateBtn btn float-right">
                                                    <i class="ti-pencil"></i>
                                                </button>
                                            </div>
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
                                                    <div class="post-image">
                                                        ${img}
                                                    </div>
                                                    <div class="description mt-3">
                                                        <form enctype="multipart/form-data" name="editForm">
                                                            <input type="hidden" name="id" value="${id}">
                                                            <h1>${value.title}</h1>
                                                            <p style="white-space: pre-wrap; color: black;" class="text-justify font-weight-normal">${value.content}</p>
                                                        </form                       
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
    $(document.body).on("click", 'button[name="updateBtn"]', function(event) {
        var title = $(this).parent("div").next().find(".post-meta > .description > form > h1");
        var content = $(this).parent("div").next().find(".post-meta > .description > form > p");
        title.replaceWith(function() {
            return `
            <div class="form-group">
                <label for="image">Image</label>
                <input type="file" name="blogImage" class="form-control p-2 h-100">
            </div>
            <div class="form-group">
                <label for="title">Title</label>
                <input type="text" name="title" class="form-control border p-2" value="${title.html()}" required>
            </div>`;
        })
        content.replaceWith(function() {
            return `
            <div class="form-group">
                <label for="content">Content</label>
                <textarea name="content" rows="10" class="form-control border p-2" required>${content.html()}</textarea>
            </div>
            <button type="submit" name="saveBtn" class="btn btn-primary float-right">Save</button>`;
        })
    });
    $(document.body).on("click", 'button[name="saveBtn"]', function(event) {
        event.preventDefault();
        var id = $(this).parent("form").find('input[name="id"]').val();
        console.log(id);
        var form = $(this).parent("form")[0];
        var formData = new FormData(form);
        $.ajax({
            type: "PUT",
            url: `http://localhost:3000/blog/${id}`,
            data: formData,
            contentType: false,
            processData: false,
            success: function(data) {
                location.reload();
            }
        })
    });
    $(document.body).on("click", 'button[name="deleteBtn"]', function(event) {
        event.preventDefault();
        var id = $(this).parent("form").find('input[name="id"]').val();
        $.ajax({
            type: "DELETE",
            url: `http://localhost:3000/blog/${id}`,
            success: function(data) {
                location.reload();
            }
        })
    });
    $("#logoutA").on("click", function(event) {
        event.preventDefault();
        $.ajax({
            type: "POST",
            url: "http://localhost:3000/user/logout",
            success: function(data) {
                location.href = "htpp://localhost:3000";
            }
        })
    })
});