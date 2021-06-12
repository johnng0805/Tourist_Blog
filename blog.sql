create table `users` (
    `id` binary(36) primary key not null,
    `email` varchar(255) not null,
    `name` varchar(255) not null,
    `gender` enum('male', 'female', 'other'),
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