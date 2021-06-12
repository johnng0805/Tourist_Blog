create user 'admin'@'localhost' identified by 'admin';
grant all PRIVILEGES on *.* to 'admin'@'localhost';
flush privileges;