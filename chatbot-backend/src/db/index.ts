import { Pool } from "pg";
import fs from 'fs';
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432", 10),
});

// Function to initialize the database if tables don't exist
async function initializeDatabase() {
  if (process.env.INITIALIZED === 'true') {
    console.log('Database already initialized.');
    return;
  }

  try {
    const schema = fs.readFileSync('/usr/src/app/init.sql', 'utf8');
    await pool.query(schema);
    console.log('Database schema applied successfully.');
    process.env.INITIALIZED = 'true';  // This would need to be set somewhere durable if used across restarts
  } catch (err) {
    console.error('Error applying database schema:', err);
  }
}


// Call the initialization function at startup
initializeDatabase();

export default pool;
