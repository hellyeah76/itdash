import express from 'express';
import Database from 'better-sqlite3';
import bodyParser from 'body-parser';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const db = new Database(':memory:'); // Use an in-memory database
const dataFilePath = path.join(__dirname, 'data.json');

app.use(bodyParser.json());
app.use(cors());

const readData = () => {
  const data = fs.readFileSync(dataFilePath, 'utf-8');
  return JSON.parse(data);
};

// Create tables
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
`);

// Seed initial data from data.json
const initialData = readData();
const insertDeviceStmt = db.prepare('INSERT INTO devices (name) VALUES (?)');
initialData.devices.forEach(device => {
  insertDeviceStmt.run(device);
});

app.get('/api/users', (req, res) => {
  const users = db.prepare('SELECT * FROM users').all();
  console.log('Users:', users); // Log users to console
  res.send(users);
});

app.get('/api/devices', (req, res) => {
  const devices = db.prepare('SELECT * FROM devices').all();
  console.log('Devices:', devices); // Log devices to console
  res.send(devices);
});

app.post('/api/users', (req, res) => {
  const { name, division, problem, solving, date, device } = req.body;
  console.log('Received data:', { name, division, problem, solving, date, device }); // Log received data to console

  if (!name || !division || !problem || !solving || !date || !device) {
    console.error('Missing required fields:', { name, division, problem, solving, date, device });
    return res.status(400).send('Missing required fields');
  }

  try {
    const stmt = db.prepare('INSERT INTO users (name, division, problem, solving, date, device) VALUES (?, ?, ?, ?, ?, ?)');
    stmt.run(name, division, problem, solving, date, device);
    console.log('Inserted user:', { name, division, problem, solving, date, device }); // Log inserted user to console
    res.send('Data saved successfully');
  } catch (error) {
    console.error('Error inserting user:', error);
    res.status(500).send('Error inserting user');
  }
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});

export default app;