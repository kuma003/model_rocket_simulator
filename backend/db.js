const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.POSTGRES_USER || 'user',
  host: process.env.POSTGRES_HOST || 'db',
  database: process.env.POSTGRES_DB || 'ORV-DB',
  password: process.env.POSTGRES_PASSWORD || 'password',
  port: 5432,
});

module.exports = pool;
