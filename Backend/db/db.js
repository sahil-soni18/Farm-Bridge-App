import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    pool: {
      max: 5,      // Maximum number of connections
      min: 0,      // Minimum number of connections
      acquire: 30000, // Maximum time (ms) to try getting a connection
      idle: 10000,   // Maximum time (ms) a connection can be idle before being released
    },
    logging: false, // Disable logging for cleaner console output
  });
  

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error.message);
    process.exit(1);
  }
};

testConnection();

export default sequelize;
