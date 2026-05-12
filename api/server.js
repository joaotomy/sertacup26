const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());


const config = {
  user: 'jtomas',
  password: 'jtomas',
  server: 'JAIME',       
  port: 1433,
  database: 'sertacup26',
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

sql.connect(config).then(() => {
  console.log('DB connected');
  app.listen(3000, () => console.log('API running'));
}).catch(err => console.error('DB connection failed:', err));


app.get('/teams', async (req, res) => {
  try {
    const result = await sql.query`SELECT * FROM equipa`;
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(3000, () => console.log('API running'));