const express = require('express');
const sql = require('mssql/msnodesqlv8');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const config = {
  connectionString:
    'Driver={ODBC Driver 18 for SQL Server};Server=localhost;Database=sertacup26_fem;Trusted_Connection=yes;Encrypt=no;TrustServerCertificate=yes;'
};

const poolPromise = sql.connect(config);

app.get('/teams', async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .query('SELECT * FROM equipa');

    res.json(result.recordset);

  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get('/groups', async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool
      .request()
      .query('SELECT * FROM vwequipa_stats_grupo');

    res.json(result.recordset);

  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get('/games', async (req, res) => {
  try {

    const pool = await poolPromise;
    const request = pool.request();

    let query = `
      SELECT *
      FROM jogo
      WHERE 1=1
    `;

    if (req.query.chave) {
      query += ` AND chave = @chave`;
      request.input('chave', sql.VarChar, req.query.chave);
    }

    if (req.query.equipa1) {
      query += ` AND equipa1 = @equipa1`;
      request.input('equipa1', sql.Int, req.query.equipa1);
    }

    if (req.query.equipa2) {
      query += ` AND equipa2 = @equipa2`;
      request.input('equipa2', sql.Int, req.query.equipa2);
    }

    if (req.query.campo) {
      query += ` AND campo = @campo`;
      request.input('campo', sql.Int, req.query.campo);
    }

    if (req.query.grupo) {
      query += ` AND grupo = @grupo`;
      request.input('grupo', sql.Int, req.query.grupo);
    }

    if (req.query.fase) {
      query += ` AND fase = @fase`;
      request.input('fase', sql.Int, req.query.fase);
    }

    if (req.query.liga) {
      query += ` AND liga = @liga`;
      request.input('liga', sql.Int, req.query.liga);
    }

    if (req.query.comecado) {
      query += ` AND comecado = @comecado`;
      request.input('comecado', sql.Bit, req.query.comecado);
    }

    if (req.query.terminado) {
      query += ` AND terminado = @terminado`;
      request.input('terminado', sql.Bit, req.query.terminado);
    }

    if (req.query.jogo_grupo) {
      query += ` AND jogo_grupo = @jogo_grupo`;
      request.input('jogo_grupo', sql.Bit, req.query.jogo_grupo);
    }

    if (req.query.data) {
      query += `
        AND CAST(hora_prevista AS DATE) = @data
      `;

      request.input('data', sql.Date, req.query.data);
    }

    const result = await request.query(query);

    res.json(result.recordset);

  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(3000, () => {
  console.log('API running on port 3000');
});

poolPromise.catch(err => {
  console.error('DB connection failed:', err);
});