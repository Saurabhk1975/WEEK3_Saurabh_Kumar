// import { Pool } from "pg";
// const pool = new Pool({
//   user: "postgres",
//   host: "localhost",
//   database: "postgres",
//   password: "password",
//   port: 5432,
// });
// export default pool;



import { Sequelize } from 'sequelize';
const sequelize = new Sequelize({
 username: 'postgres',
 host: 'localhost',
 database: "postgres",
password: "password",
 port: 5432,
 //dialect
 dialect: "postgres",
});


sequelize.authenticate()
 .then(() => {
 console.log('Database connection  successfull.');
 })
 .catch((err) => {
 console.error('Unable to connect to the database:', err);
 });
//Synchronize
sequelize.sync()
 .then(() => {
 console.log('Models synchronized with the database.');
 })
 .catch((err) => {
 console.error('Unable to synchronize models with the database:', err);
 });
export default sequelize;