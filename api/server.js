import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import Database from 'better-sqlite3';

const app = express();
const db = new Database('data.db', { verbose: console.log });

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    division TEXT,
    problem TEXT,
    solving TEXT,
    date TEXT,
    device TEXT
  );
`);

app.use(bodyParser.json());
app.use(cors());

app.get('/api/users', (req, res) => {
  const users = db.prepare('SELECT * FROM users').all();
  res.json(users);
});

app.get('/api/devices', (req, res) => {
  const devices = [
    { id: 1, name: 'PC' },
    { id: 2, name: 'Laptop' },
    { id: 3, name: 'Printer' },
    { id: 4, name: 'Mini PC' },
    { id: 5, name: 'Mouse' }
  ];
  res.json(devices);
});

app.post('/api/users', (req, res) => {
  const users = req.body;
  db.prepare('DELETE FROM users').run();
  const insert = db.prepare('INSERT INTO users (name, division, problem, solving, date, device) VALUES (?, ?, ?, ?, ?, ?)');
  users.forEach(user => {
    insert.run(user.name, user.division, user.problem, user.solving, user.date, user.device);
  });
  res.send('Data saved successfully');
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});

export default app;