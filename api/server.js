const express = require('express');
const sql = require('mssql/msnodesqlv8');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const crypto = require('crypto');

const config = {
  server: 'localhost',
  database: 'sertacup26',
  driver: 'ODBC Driver 17 for SQL Server',
  options: {
    instanceName: 'MSSQLSERVER01',
    trustedConnection: true,
    encrypt: false,
    trustServerCertificate: true
  }
};

const poolPromise = sql.connect(config);

// As sessões são temporárias e desaparecem quando a API é reiniciada.
const teamSessions = new Map();
app.use('/admin', require('./admin')({
  sql,
  poolPromise,
  revokeAccountSessions: accountId => {
    for (const [token, session] of teamSessions) {
      if (Number(session.accountId) === accountId) teamSessions.delete(token);
    }
  }
}));
app.post('/team-login', async (req, res) => {
  const { username, password } = req.body || {};
  if (typeof username !== 'string' || typeof password !== 'string' || !username.trim() || !password || username.length > 100 || password.length > 255) return res.status(400).json({ error: 'Preenche o utilizador e a palavra-passe.' });
  try {
    const pool = await poolPromise;
    const result = await pool.request().input('username', sql.NVarChar(100), username.trim()).query('SELECT id, idequipa, password FROM dbo.equipa_login WHERE username = @username');
    const account = result.recordset[0];
    const supplied = Buffer.from(password, 'utf8');
    const stored = Buffer.from(account?.password || '', 'utf8');
    if (!account || supplied.length !== stored.length || !crypto.timingSafeEqual(supplied, stored)) return res.status(401).json({ error: 'Utilizador ou palavra-passe incorretos.' });
    const token = crypto.randomBytes(32).toString('hex');
    teamSessions.set(token, { accountId: account.id, teamId: account.idequipa, expires: Date.now() + 8 * 60 * 60 * 1000 });
    res.json({ token });
  } catch (err) {
    console.error('Erro no login de equipa:', err);
    res.status(500).json({ error: 'Não foi possível iniciar sessão.' });
  }
});

app.get('/team-session', (req, res) => {
  const token = req.get('Authorization')?.match(/^Bearer ([a-f0-9]{64})$/)?.[1];
  const session = token && teamSessions.get(token);
  if (!session || session.expires <= Date.now()) {
    if (token) teamSessions.delete(token);
    return res.status(401).json({ error: 'Sessão inválida ou expirada.' });
  }
  res.json({ teamId: session.teamId });
});

function requireTeam(req, res, next) {
  const token = req.get('Authorization')?.match(/^Bearer ([a-f0-9]{64})$/)?.[1];
  const session = token && teamSessions.get(token);
  if (!session || session.expires <= Date.now()) return res.status(401).json({ error: 'Sessão inválida ou expirada.' });
  if (session.teamId == null) return res.status(403).json({ error: 'Esta conta ainda não está associada a uma equipa.' });
  req.teamId = session.teamId;
  req.accountId = session.accountId;
  next();
}

app.get('/team-accommodation', requireTeam, async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().input('teamId', sql.Int, req.teamId).query('SELECT tipo, localizacao, maps_url, regras FROM dbo.admin_alojamento WHERE idequipa=@teamId');
    res.json(result.recordset[0] || null);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Não foi possível carregar o alojamento.' }); }
});

async function teamRegistrationOpen(pool, accountId, teamId) {
  const result = await pool.request().input('accountId', sql.Int, accountId).input('teamId', sql.Int, teamId).query(`
    SELECT COALESCE(l.InscricaoAberta, (SELECT Valor FROM dbo.parametro WHERE Codigo = N'inscricoes_abertas'), 0) AS aberta
    FROM dbo.equipa_login l WHERE l.id = @accountId AND l.idequipa = @teamId
  `);
  return Boolean(result.recordset[0]?.aberta);
}

function validBirthDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value) || value < '2014-01-01' || value > '2018-01-01') return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

app.get('/team-players', requireTeam, async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().input('teamId', sql.Int, req.teamId).query('SELECT id, nome, numero, CONVERT(varchar(10), DataNascimento, 23) AS datanascimento FROM dbo.jogador WHERE idequipa = @teamId ORDER BY nome');
    const inscricoesAbertas = await teamRegistrationOpen(pool, req.accountId, req.teamId);
    res.json({ jogadores: result.recordset, inscricoesAbertas });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Não foi possível carregar os jogadores.' }); }
});

app.post('/team-players', requireTeam, async (req, res) => {
  const { nome, numero, datanascimento } = req.body || {};
  if (typeof nome !== 'string' || !nome.trim() || nome.trim().length > 100 || !Number.isInteger(numero) || numero < 0 || numero > 99 || !validBirthDate(datanascimento)) return res.status(400).json({ error: 'Indica um nome, número de camisola entre 0 e 99 e data de nascimento entre 01/01/2014 e 01/01/2018.' });
  try {
    const pool = await poolPromise;
    const result = await pool.request().input('teamId', sql.Int, req.teamId).input('accountId', sql.Int, req.accountId).input('nome', sql.NVarChar(100), nome.trim()).input('numero', sql.Int, numero).input('datanascimento', sql.VarChar(8), datanascimento.replace(/-/g, '')).query(`
      INSERT INTO dbo.jogador (nome, numero, idequipa, DataNascimento) OUTPUT INSERTED.id, INSERTED.nome, INSERTED.numero, CONVERT(varchar(10), INSERTED.DataNascimento, 23) AS datanascimento
      SELECT @nome, @numero, @teamId, CONVERT(datetime, @datanascimento, 112) WHERE EXISTS (
        SELECT 1 FROM dbo.equipa_login l WHERE l.id = @accountId AND l.idequipa = @teamId
        AND COALESCE(l.InscricaoAberta, (SELECT Valor FROM dbo.parametro WHERE Codigo = N'inscricoes_abertas'), 0) = 1
      )`);
    if (!result.recordset.length) return res.status(403).json({ error: 'As inscrições estão encerradas para esta equipa.' });
    res.status(201).json(result.recordset[0]);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Não foi possível adicionar o jogador.' }); }
});

app.put('/team-players/:id', requireTeam, async (req, res) => {
  const id = Number(req.params.id);
  const { nome, numero, datanascimento } = req.body || {};
  if (!Number.isInteger(id) || id < 1 || id > 2147483647 || typeof nome !== 'string' || !nome.trim() || nome.trim().length > 100 || !Number.isInteger(numero) || numero < 0 || numero > 99 || !validBirthDate(datanascimento)) return res.status(400).json({ error: 'Indica um jogador, nome, número de camisola entre 0 e 99 e data de nascimento entre 01/01/2014 e 01/01/2018.' });
  try {
    const pool = await poolPromise;
    const result = await pool.request().input('id', sql.Int, id).input('teamId', sql.Int, req.teamId).input('accountId', sql.Int, req.accountId).input('nome', sql.NVarChar(100), nome.trim()).input('numero', sql.Int, numero).input('datanascimento', sql.VarChar(8), datanascimento.replace(/-/g, '')).query(`
      UPDATE dbo.jogador SET nome = @nome, numero = @numero, DataNascimento = CONVERT(datetime, @datanascimento, 112) OUTPUT INSERTED.id, INSERTED.nome, INSERTED.numero, CONVERT(varchar(10), INSERTED.DataNascimento, 23) AS datanascimento
      WHERE id = @id AND idequipa = @teamId AND EXISTS (
        SELECT 1 FROM dbo.equipa_login l WHERE l.id = @accountId AND l.idequipa = @teamId
        AND COALESCE(l.InscricaoAberta, (SELECT Valor FROM dbo.parametro WHERE Codigo = N'inscricoes_abertas'), 0) = 1
      )`);
    if (result.recordset.length) return res.json(result.recordset[0]);
    if (!await teamRegistrationOpen(pool, req.accountId, req.teamId)) return res.status(403).json({ error: 'As inscrições estão encerradas para esta equipa.' });
    res.status(404).json({ error: 'Jogador não encontrado nesta equipa.' });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Não foi possível atualizar o jogador.' }); }
});

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



app.put('/group-stats/:idequipa', async (req, res) => {
  try {
    const {
      jogos,
      vitorias,
      empates,
      derrotas,
      golos_marcados,
      golos_sofridos
    } = req.body;

    const pool = await poolPromise;

    await pool.request()
      .input('idequipa', sql.Int, req.params.idequipa)
      .input('jogos', sql.Int, jogos)
      .input('vitorias', sql.Int, vitorias)
      .input('empates', sql.Int, empates)
      .input('derrotas', sql.Int, derrotas)
      .input('golos_marcados', sql.Int, golos_marcados)
      .input('golos_sofridos', sql.Int, golos_sofridos)
      .query(`
        UPDATE equipa_stats_grupo
        SET
          jogos = jogos + @jogos,
          vitorias = vitorias + @vitorias,
          empates = empates + @empates,
          derrotas = derrotas + @derrotas,
          golos_marcados = golos_marcados + @golos_marcados,
          golos_sofridos = golos_sofridos + @golos_sofridos
        WHERE idequipa = @idequipa
      `);

    res.json({ success: true });

  } catch (err) {
    res.status(500).send(err.message);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API running on port ${port}`);
});

poolPromise.catch(err => {
  console.error('DB connection failed:', err);
});
