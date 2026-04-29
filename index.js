const express = require('express');
const pool = require('./db');
require('dotenv').config();

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Database connected ✅' });
});

app.get('/users', async (req, res) => {
  const result = await pool.query('SELECT * FROM users');
  res.json(result.rows);
});

app.get('/users/:id', async (req, res) => {
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [req.params.id]);
  res.json(result.rows[0]);
});

app.post('/users', async (req, res) => {
  const { name, email } = req.body;
  const result = await pool.query('INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *', [name, email]);
  res.json(result.rows[0]);
});

app.put('/users/:id', async (req, res) => {
  const { name, email } = req.body;
  const result = await pool.query('UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *', [name, email, req.params.id]);
  res.json(result.rows[0]);
});

app.delete('/users/:id', async (req, res) => {
  await pool.query('DELETE FROM users WHERE id = $1', [req.params.id]);
  res.json({ message: 'User deleted ✅' });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});