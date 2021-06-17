create table `users` (
    `id` binary(36) primary key not null,
    `email` varchar(255) not null,
    `first_name` varchar(255) not null,
    `last_name` varchar(255) not null,
    `gender` enum('male', 'female', 'other'),
    `birthday` dateime not null,
    `age` tinyint not null,
    `phone` varchar(255) not null,
    `password` varchar(255) not null
);
create table `blogs` (
    `id` binary(36) primary key not null,
    `title` varchar(255) not null,
    `content` longtext not null,
    `user_id` binary(36) not null,
    `date` datetime,
    foreign key (`user_id`) references `users`(`id`)
);