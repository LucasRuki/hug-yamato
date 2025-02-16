const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');  // Adicione esta linha
const app = express();
const port = process.env.PORT || 8080;

app.use(cors());  // Adicione esta linha

let db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Conectado ao banco de dados SQLite.');
});

db.run('CREATE TABLE pet_count (count INTEGER)', (err) => {
  if (err) {
    console.error(err.message);
  }
  db.run('INSERT INTO pet_count (count) VALUES (0)');
});

app.use(express.static('public'));

app.get('/count', (req, res) => {
  db.get('SELECT count FROM pet_count', (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ count: row.count });
  });
});

app.post('/pet', (req, res) => {
  db.run('UPDATE pet_count SET count = count + 1', function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Carinho adicionado!' });
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
