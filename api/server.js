const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const crypto = require('crypto');

const config = {
  user: 'sa',
  password: 'Bexigaemuitoburro8_',
  server: '49.12.237.72',
  database: 'sertacup26_fem',
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
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
        FROM vwjogo
        WHERE 1=1
      `;

      
      if (req.query.id) {
        query += ` AND id = @id`;
        request.input('id', sql.Int, req.query.id);
      }

      if (req.query.chave) {
        query += ` AND chave = @chave`;
        request.input('chave', sql.VarChar, req.query.chave);
      }

      if (req.query.equipa1) {
        query += ` AND idequipa1 = @equipa1`;
        request.input('equipa1', sql.Int, req.query.equipa1);
      }

      if (req.query.equipa2) {
        query += ` AND idequipa2 = @equipa2`;
        request.input('equipa2', sql.Int, req.query.equipa2);
      }

      if (req.query.campo) {
        query += ` AND campoid = @campo`;
        request.input('campo', sql.Int, req.query.campo);
      }

      if (req.query.grupo) {
        query += ` AND grupoid = @grupo`;
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

      if (req.query.comecado !== undefined) {
        query += ` AND começado = @comecado`;
        request.input('comecado', sql.Bit, req.query.comecado === 'true');
      }

      if (req.query.terminado !== undefined) {
        query += ` AND terminado = @terminado`;
        request.input('terminado', sql.Bit, req.query.terminado === 'true');
      }

      if (req.query.jogo_grupo !== undefined) {
        query += ` AND jogo_grupo = @jogo_grupo`;
        request.input('jogo_grupo', sql.Bit, req.query.jogo_grupo === 'true');
      }

      if (req.query.data) {
        query += ` AND CAST(hora_prevista AS DATE) = @data`;
        request.input('data', sql.Date, req.query.data);
      }

      const result = await request.query(query);

      const jogos = result.recordset.map(j => ({
        ...j,

        hora_prevista: j.hora_prevista
          ?.toISOString()
          .replace('Z', ''),

        hora_inicio: j.hora_inicio
          ?.toISOString()
          .replace('Z', ''),

        hora_inicio_2parte: j.hora_inicio_2parte
          ?.toISOString()
          .replace('Z', ''),

        Estado: 
          j.terminado ? 'Resultado Final' :
            j.segunda_parte_comecada ? '2ªP' :
              j.primeira_parte_terminada ? 'Intervalo' :
                j.começado ? '1ªP' :
                  'Agendado'
      }));

      res.json(jogos);

    } catch (err) {
      res.status(500).send(err.message);
    }
  });

app.post('/games/:id/start', async (req, res) => {
  try {
    const pool = await poolPromise;

    await pool.request()
      .input('id', sql.Int, req.params.id)
      .query(`
        UPDATE jogo
        SET
          começado = 1,
          terminado = 0,
          primeira_parte_terminada = 0,
          segunda_parte_comecada = 0,
          hora_inicio = DATEADD(HOUR, 1, GETDATE()),
          hora_inicio_2parte = NULL
        WHERE id = @id
      `);

    res.json({ success: true });

  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post('/games/:id/end-first-half', async (req, res) => {
  try {
    const pool = await poolPromise;

    await pool.request()
      .input('id', sql.Int, req.params.id)
      .query(`
        UPDATE jogo
        SET
          começado = 1,
          terminado = 0,
          primeira_parte_terminada = 1,
          segunda_parte_comecada = 0
        WHERE id = @id
      `);

    res.json({ success: true });

  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post('/games/:id/start-second-half', async (req, res) => {
  try {
    const pool = await poolPromise;

    await pool.request()
      .input('id', sql.Int, req.params.id)
      .query(`
        UPDATE jogo
        SET
          começado = 1,
          terminado = 0,
          primeira_parte_terminada = 1,
          segunda_parte_comecada = 1,
          hora_inicio_2parte = DATEADD(HOUR, 1, GETDATE())
        WHERE id = @id
      `);

    res.json({ success: true });

  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post('/games/:id/end', async (req, res) => {
  try {
    const pool = await poolPromise;

    await pool.request()
      .input('id', sql.Int, req.params.id)
      .query(`
        UPDATE jogo
        SET
          começado = 1,
          terminado = 1,
          primeira_parte_terminada = 1,
          segunda_parte_comecada = 1
        WHERE id = @id
      `);

    res.json({ success: true });

  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post('/games/:id/home-goal', async (req, res) => {
  try {
    const pool = await poolPromise;

    await pool.request()
      .input('id', sql.Int, req.params.id)
      .query(`
        UPDATE jogo
        SET golos_equipa1 = golos_equipa1 + 1
        WHERE id = @id
      `);

    res.json({ success: true });

  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post('/games/:id/away-goal', async (req, res) => {
  try {
    const pool = await poolPromise;

    await pool.request()
      .input('id', sql.Int, req.params.id)
      .query(`
        UPDATE jogo
        SET golos_equipa2 = golos_equipa2 + 1
        WHERE id = @id
      `);

    res.json({ success: true });

  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post('/games/:id/home-goal-minus', async (req, res) => {
  try {
    const pool = await poolPromise;

    await pool.request()
      .input('id', sql.Int, req.params.id)
      .query(`
        UPDATE jogo
        SET golos_equipa1 =
          CASE
            WHEN golos_equipa1 > 0 THEN golos_equipa1 - 1
            ELSE 0
          END
        WHERE id = @id
      `);

    res.json({ success: true });

  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post('/games/:id/away-goal-minus', async (req, res) => {
  try {
    const pool = await poolPromise;

    await pool.request()
      .input('id', sql.Int, req.params.id)
      .query(`
        UPDATE jogo
        SET golos_equipa2 =
          CASE
            WHEN golos_equipa2 > 0 THEN golos_equipa2 - 1
            ELSE 0
          END
        WHERE id = @id
      `);

    res.json({ success: true });

  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post('/game-access', async (req, res) => {
  try {
    const { gameId, chave } = req.body;

    const pool = await poolPromise;

    const gameResult = await pool
      .request()
      .input('id', sql.Int, gameId)
      .input('chave', sql.VarChar, chave)
      .query(`
        SELECT id
        FROM jogo
        WHERE id = @id
          AND chave = @chave
      `);

    if (gameResult.recordset.length === 0) {
      return res.status(401).json({
        error: 'Invalid game ID or chave.'
      });
    }

    const token = crypto.randomUUID();

    await pool
      .request()
      .input('jogo_id', sql.Int, gameId)
      .input('token', sql.UniqueIdentifier, token)
      .query(`
        INSERT INTO jogo_acesso (jogo_id, token)
        VALUES (@jogo_id, @token)
      `);

    res.json({
      token
    });

  } catch (err) {
    res.status(500).send(err.message);
  }
});


app.get('/players', async (req, res) => {
  try {
    const pool = await poolPromise;
    const request = pool.request();

    let query = `
      SELECT
        id,
        nome,
        numero
      FROM jogador
      WHERE 1 = 1
    `;

    if (req.query.idequipa) {
      query += ` AND idequipa = @idequipa`;
      request.input('idequipa', sql.Int, req.query.idequipa);
    }

    const result = await request.query(query);

    res.json(result.recordset);

  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post('/goals', async (req, res) => {
  try {
    const { idjogo, idjogador } = req.body;

    const pool = await poolPromise;

    await pool.request()
      .input('idjogo', sql.Int, idjogo)
      .input('idjogador', sql.Int, idjogador)
      .query(`
        INSERT INTO marcador (
          idjogo,
          idjogador,
          minuto,
          hora
        )
        VALUES (
          @idjogo,
          @idjogador,
          NULL,
          DATEADD(HOUR, 1, GETDATE())
        )
      `);

    res.json({ success: true });

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