const { Sequelize } = require("sequelize");
const dotenv = require('dotenv');
dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host    : process.env.DB_HOST,
    dialect : 'mysql',
    define  : {
        timestamps: false
    }
});

sequelize.authenticate().then(() => {
    console.log('Database connected');
}).catch(error => {
    console.log('Unable to connect to database:', error);
});

module.exports = sequelize;