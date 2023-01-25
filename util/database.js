const Sequelize = require('sequelize');
const sequelize = new Sequelize({
  host: 'localhost',
  dialect: 'sqlite',
  storage: './database.sqlite'
});

sequelize.authenticate().then(() => {
  console.log('Bro,connection has been established successfully.');
}).catch((error) => {
  console.error('Unable to connect to the database: ', error);
})
module.exports = sequelize;