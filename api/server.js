// filepath: /C:/Users/IT Jaringan/Desktop/proj/proj1/api/server.js
import express from 'express';
import fs from 'fs';
import path from 'path';
import bodyParser from 'body-parser';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const dataFilePath = path.join(__dirname, '..', 'src', 'data.json');
const devicesFilePath = path.join(__dirname, '..', 'src', 'devices.json');

app.use(bodyParser.json());
app.use(cors());

app.get('/api/users', (req, res) => {
  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading data');
    }
    res.send(JSON.parse(data));
  });
});

app.get('/api/devices', (req, res) => {
  fs.readFile(devicesFilePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading devices');
    }
    res.send(JSON.parse(data));
  });
});

app.post('/api/users', (req, res) => {
  const users = req.body;
  fs.writeFile(dataFilePath, JSON.stringify(users, null, 2), (err) => {
    if (err) {
      return res.status(500).send('Error saving data');
    }
    res.send('Data saved successfully');
  });
});

export default app;