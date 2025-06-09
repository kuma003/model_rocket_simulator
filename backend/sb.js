const { Pool } = require('pg');

const pool = new Pool({
  host: 'db',
  user: 'user',
  password: 'password',
  database: 'mydb',
  port: 5432,
});

module.exports = pool;
