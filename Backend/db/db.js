// import { Sequelize } from 'sequelize';
// import dotenv from 'dotenv';

// dotenv.config();

// const sequelize = new Sequelize(process.env.DATABASE_URL, {
//     pool: {
//       max: 5,      // Maximum number of connections
//       min: 0,      // Minimum number of connections
//       acquire: 30000, // Maximum time (ms) to try getting a connection
//       idle: 10000,   // Maximum time (ms) a connection can be idle before being released
//     },
//     logging: false, // Disable logging for cleaner console output
//   });
  

// const testConnection = async () => {
//   try {
//     await sequelize.authenticate();
//     await sequelize.sync({ alter: true }); // alter: true matches schema to the models
//     console.log('Connection has been established successfully.');
//   } catch (error) {
//     console.error('Unable to connect to the database:', error.message);
//     process.exit(1);
//   }
// };

// testConnection();

// export default sequelize;

import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('farmbridge_app', 'postgres', 'myPostgres', {
  host: 'localhost',
  dialect: 'postgres',
});

// Function to test the database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    // Synchronize the models with the database
    await sequelize.sync({ alter: true }); // alter: true matches schema to the models
    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

// Run the connection test
testConnection();

export default sequelize;
