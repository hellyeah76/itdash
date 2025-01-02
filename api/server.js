import express from 'express';
import Database from 'better-sqlite3';
import bodyParser from 'body-parser';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const dbFilePath = join(__dirname, 'database.sqlite');
const db = new Database(dbFilePath); // Use a file-based database

app.use(bodyParser.json());
app.use(cors());

// Create tables and seed initial data if they don't exist
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

  CREATE TABLE IF NOT EXISTS devices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT
  );

  INSERT OR IGNORE INTO devices (name) VALUES 
    ('PC'), ('Laptop'), ('Printer'), ('Mini PC'), ('Mouse'), ('Keyboard'), 
    ('Monitor'), ('Access Point'), ('SWOS'), ('Internet'), ('LAN'), 
    ('Mikrotik'), ('Modem'), ('Server'), ('NAS'), ('Scanner'), 
    ('Charger'), ('HP'), ('CCTV');
`);

app.get('/api/users', (req, res) => {
  const users = db.prepare('SELECT * FROM users').all();
  res.send(users);
});

app.get('/api/devices', (req, res) => {
  const devices = db.prepare('SELECT * FROM devices').all();
  res.send(devices);
});

app.post('/api/users', (req, res) => {
  const { name, division, problem, solving, date, device } = req.body;
  const stmt = db.prepare('INSERT INTO users (name, division, problem, solving, date, device) VALUES (?, ?, ?, ?, ?, ?)');
  stmt.run(name, division, problem, solving, date, device);
  res.send('Data saved successfully');
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});

export default app;