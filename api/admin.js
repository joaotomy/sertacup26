const express = require('express');

module.exports = function createAdminRouter({ sql, poolPromise, revokeAccountSessions }) {
  const router = express.Router();
  const wrap = fn => async (req, res) => { try { await fn(req, res); } catch (err) { console.error('Administração:', err); res.status(500).json({ error: 'Não foi possível concluir a operação.' }); } };
  const intId = value => Number.isInteger(Number(value)) && Number(value) > 0 && Number(value) <= 2147483647;
  const nonempty = (value, max) => typeof value === 'string' && value.trim().length > 0 && value.trim().length <= max;
  const optional = (value, max) => value == null || (typeof value === 'string' && value.length <= max);
  const bad = res => res.status(400).json({ error: 'Verifica os dados indicados.' });
  const missing = res => res.status(404).json({ error: 'Registo não encontrado.' });
  const birthOK = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && value >= '2014-01-01' && value <= '2018-01-01' && !Number.isNaN(new Date(`${value}T00:00:00Z`).getTime()) && new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value;
  const urlOK = value => !value || /^https?:\/\//i.test(value);

  router.get('/overview', wrap(async (req, res) => {
    const pool = await poolPromise;
    const result = await pool.request().query(`SELECT (SELECT COUNT(*) FROM dbo.equipa) equipas, (SELECT COUNT(*) FROM dbo.jogador) jogadores, (SELECT COUNT(*) FROM dbo.jogo WHERE [começado]=1 AND terminado=0) jogosAoVivo, (SELECT Valor FROM dbo.parametro WHERE Codigo=N'inscricoes_abertas') inscricoesAbertas`);
    res.json(result.recordset[0]);
  }));

  router.get('/teams', wrap(async (req, res) => {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT e.*, (SELECT COUNT(*) FROM dbo.jogador j WHERE j.idequipa=e.id) jogadores FROM dbo.equipa e ORDER BY e.nome_completo');
    res.json(result.recordset);
  }));
  async function saveTeam(req, res, isNew) {
    const { nome_completo, nome, sigla, cor_principal, cor_secundaria, simbolo } = req.body || {};
    if ((!isNew && !intId(req.params.id)) || !nonempty(nome_completo,100) || !nonempty(nome,100) || !nonempty(sigla,5) || !nonempty(cor_principal,11) || !optional(cor_secundaria,11) || !nonempty(simbolo,250)) return bad(res);
    const pool = await poolPromise;
    const request = pool.request().input('nome_completo',sql.NVarChar(100),nome_completo.trim()).input('nome',sql.NVarChar(100),nome.trim()).input('sigla',sql.NVarChar(5),sigla.trim()).input('cor_principal',sql.VarChar(11),cor_principal.trim()).input('cor_secundaria',sql.VarChar(11),cor_secundaria?.trim() || null).input('simbolo',sql.VarChar(250),simbolo.trim());
    let result;
    if (isNew) result = await request.query(`SET XACT_ABORT ON; BEGIN TRAN; DECLARE @id INT; SELECT @id=ISNULL(MAX(id),0)+1 FROM dbo.equipa WITH (UPDLOCK,HOLDLOCK); INSERT dbo.equipa(id,nome_completo,nome,sigla,cor_principal,cor_secundaria,simbolo) VALUES(@id,@nome_completo,@nome,@sigla,@cor_principal,@cor_secundaria,@simbolo); INSERT dbo.equipa_stats_grupo(idequipa) VALUES(@id); COMMIT; SELECT @id id;`);
    else result = await request.input('id',sql.Int,Number(req.params.id)).query('UPDATE dbo.equipa SET nome_completo=@nome_completo,nome=@nome,sigla=@sigla,cor_principal=@cor_principal,cor_secundaria=@cor_secundaria,simbolo=@simbolo OUTPUT INSERTED.id WHERE id=@id');
    if (!result.recordset.length) return missing(res); res.status(isNew?201:200).json(result.recordset[0]);
  }
  router.post('/teams', wrap((req,res) => saveTeam(req,res,true)));
  router.put('/teams/:id', wrap((req,res) => saveTeam(req,res,false)));

  router.get('/accounts', wrap(async (req,res) => {
    const pool=await poolPromise; const result=await pool.request().query('SELECT l.id,l.idequipa,l.username,l.datacriacao,l.InscricaoAberta,e.nome_completo equipa FROM dbo.equipa_login l LEFT JOIN dbo.equipa e ON e.id=l.idequipa ORDER BY l.username'); res.json(result.recordset);
  }));
  async function saveAccount(req,res,isNew) {
    const { username,password,idequipa,inscricaoAberta }=req.body || {};
    if ((!isNew && !intId(req.params.id)) || !nonempty(username,100) || (isNew ? !nonempty(password,255) : !optional(password,255)) || (idequipa != null && !intId(idequipa)) || ![true,false,null].includes(inscricaoAberta)) return bad(res);
    const pool=await poolPromise;
    const request=pool.request().input('username',sql.NVarChar(100),username.trim()).input('password',sql.NVarChar(255),password || null).input('idequipa',sql.Int,idequipa == null ? null : Number(idequipa)).input('aberta',sql.Bit,inscricaoAberta);
    try {
      const result=isNew ? await request.query('INSERT dbo.equipa_login(username,password,idequipa,InscricaoAberta,datacriacao) OUTPUT INSERTED.id VALUES(@username,@password,@idequipa,@aberta,GETDATE())') : await request.input('id',sql.Int,Number(req.params.id)).query('UPDATE dbo.equipa_login SET username=@username, password=COALESCE(@password,password), idequipa=@idequipa, InscricaoAberta=@aberta OUTPUT INSERTED.id WHERE id=@id');
      if (!result.recordset.length) return missing(res);
      if (!isNew) revokeAccountSessions(Number(req.params.id));
      res.status(isNew?201:200).json(result.recordset[0]);
    } catch(err) { if ([2601,2627,547].includes(err.number)) return res.status(409).json({ error:'Utilizador já existente ou equipa inválida.' }); throw err; }
  }
  router.post('/accounts',wrap((req,res)=>saveAccount(req,res,true)));
  router.put('/accounts/:id',wrap((req,res)=>saveAccount(req,res,false)));
  router.put('/registration',wrap(async(req,res)=>{
    if(typeof req.body?.aberta !== 'boolean') return bad(res);
    const pool=await poolPromise; await pool.request().input('valor',sql.Bit,req.body.aberta).query("UPDATE dbo.parametro SET Valor=@valor,DataAlteracao=GETDATE() WHERE Codigo=N'inscricoes_abertas'"); res.json({success:true});
  }));

  router.get('/players',wrap(async(req,res)=>{
    if(!intId(req.query.teamId)) return bad(res); const pool=await poolPromise;
    const result=await pool.request().input('teamId',sql.Int,Number(req.query.teamId)).query('SELECT id,nome,numero,idequipa,CONVERT(varchar(10),DataNascimento,23) datanascimento FROM dbo.jogador WHERE idequipa=@teamId ORDER BY nome'); res.json(result.recordset);
  }));
  async function savePlayer(req,res,isNew){
    const {nome,numero,datanascimento,idequipa}=req.body||{};
    if ((!isNew && !intId(req.params.id)) || !intId(idequipa) || !nonempty(nome,100) || !Number.isInteger(numero) || numero<0 || numero>99 || !birthOK(datanascimento)) return bad(res);
    const pool=await poolPromise; const request=pool.request().input('teamId',sql.Int,Number(idequipa)).input('nome',sql.NVarChar(100),nome.trim()).input('numero',sql.Int,numero).input('nascimento',sql.VarChar(8),datanascimento.replace(/-/g,''));
    const result=isNew ? await request.query('INSERT dbo.jogador(nome,numero,idequipa,DataNascimento) OUTPUT INSERTED.id VALUES(@nome,@numero,@teamId,CONVERT(datetime,@nascimento,112))') : await request.input('id',sql.Int,Number(req.params.id)).query('UPDATE dbo.jogador SET nome=@nome,numero=@numero,DataNascimento=CONVERT(datetime,@nascimento,112) OUTPUT INSERTED.id WHERE id=@id AND idequipa=@teamId');
    if(!result.recordset.length) return missing(res); res.status(isNew?201:200).json(result.recordset[0]);
  }
  router.post('/players',wrap((req,res)=>savePlayer(req,res,true)));
  router.put('/players/:id',wrap((req,res)=>savePlayer(req,res,false)));

  router.get('/accommodation',wrap(async(req,res)=>{ const pool=await poolPromise; const result=await pool.request().query('SELECT e.id,e.nome_completo,a.tipo,a.localizacao,a.maps_url,a.regras FROM dbo.equipa e LEFT JOIN dbo.admin_alojamento a ON a.idequipa=e.id ORDER BY e.nome_completo'); res.json(result.recordset); }));
  router.put('/accommodation/:id',wrap(async(req,res)=>{
    const {tipo,localizacao,maps_url,regras}=req.body||{};
    if(!intId(req.params.id)||!nonempty(tipo,100)||!nonempty(localizacao,250)||!optional(maps_url,1000)||!urlOK(maps_url)||!optional(regras,10000)) return bad(res);
    const pool=await poolPromise; await pool.request().input('id',sql.Int,Number(req.params.id)).input('tipo',sql.NVarChar(100),tipo.trim()).input('localizacao',sql.NVarChar(250),localizacao.trim()).input('maps',sql.NVarChar(1000),maps_url?.trim()||null).input('regras',sql.NVarChar(sql.MAX),regras?.trim()||null).query('UPDATE dbo.admin_alojamento SET tipo=@tipo,localizacao=@localizacao,maps_url=@maps,regras=@regras WHERE idequipa=@id; IF @@ROWCOUNT=0 INSERT dbo.admin_alojamento(idequipa,tipo,localizacao,maps_url,regras) VALUES(@id,@tipo,@localizacao,@maps,@regras)'); res.json({success:true});
  }));
  router.get('/program',wrap(async(req,res)=>{const pool=await poolPromise;const result=await pool.request().query('SELECT id,dia,hora,descricao FROM dbo.admin_programa ORDER BY dia,hora,id');res.json(result.recordset);}));
  async function saveProgram(req,res,isNew){ const {dia,hora,descricao}=req.body||{}; if ((!isNew&&!intId(req.params.id))||!Number.isInteger(dia)||dia<1||dia>4||typeof hora!=='string'||!/^([01]\d|2[0-3]):[0-5]\d$/.test(hora)||!nonempty(descricao,250)) return bad(res); const pool=await poolPromise;const q=pool.request().input('dia',sql.Int,dia).input('hora',sql.VarChar(5),hora).input('descricao',sql.NVarChar(250),descricao.trim()); const r=isNew?await q.query('INSERT dbo.admin_programa(dia,hora,descricao) OUTPUT INSERTED.id VALUES(@dia,@hora,@descricao)'):await q.input('id',sql.Int,Number(req.params.id)).query('UPDATE dbo.admin_programa SET dia=@dia,hora=@hora,descricao=@descricao OUTPUT INSERTED.id WHERE id=@id');if(!r.recordset.length)return missing(res);res.status(isNew?201:200).json(r.recordset[0]); }
  router.post('/program',wrap((req,res)=>saveProgram(req,res,true)));
  router.put('/program/:id',wrap((req,res)=>saveProgram(req,res,false)));
  router.delete('/program/:id',wrap(async(req,res)=>{if(!intId(req.params.id))return bad(res);const pool=await poolPromise;const r=await pool.request().input('id',sql.Int,Number(req.params.id)).query('DELETE dbo.admin_programa OUTPUT DELETED.id WHERE id=@id');if(!r.recordset.length)return missing(res);res.json({success:true});}));

  router.get('/contacts',wrap(async(req,res)=>{const pool=await poolPromise;const r=await pool.request().query('SELECT email,telefone,outros FROM dbo.admin_contactos WHERE id=1');res.json(r.recordset[0]);}));
  router.put('/contacts',wrap(async(req,res)=>{const {email,telefone,outros}=req.body||{};if(!optional(email,255)||!optional(telefone,100)||!optional(outros,1000)||(email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)))return bad(res);const pool=await poolPromise;await pool.request().input('email',sql.NVarChar(255),email?.trim()||null).input('telefone',sql.NVarChar(100),telefone?.trim()||null).input('outros',sql.NVarChar(1000),outros?.trim()||null).query('UPDATE dbo.admin_contactos SET email=@email,telefone=@telefone,outros=@outros WHERE id=1');res.json({success:true});}));
  router.get('/documents',wrap(async(req,res)=>{const pool=await poolPromise;const r=await pool.request().query('SELECT codigo,nome,alterado FROM dbo.admin_documento ORDER BY codigo');res.json(r.recordset);}));
  router.get('/documents/:code',wrap(async(req,res)=>{if(!['regulamento','manual'].includes(req.params.code))return missing(res);const pool=await poolPromise;const r=await pool.request().input('code',sql.VarChar(20),req.params.code).query('SELECT nome,conteudo FROM dbo.admin_documento WHERE codigo=@code');if(!r.recordset.length)return missing(res);res.set('Content-Type','application/pdf');res.set('Content-Disposition',`attachment; filename="${req.params.code}.pdf"`);res.send(r.recordset[0].conteudo);}));
  router.put('/documents/:code',express.raw({type:'application/pdf',limit:'15mb'}),wrap(async(req,res)=>{if(!['regulamento','manual'].includes(req.params.code)||!Buffer.isBuffer(req.body)||req.body.length<5||req.body.subarray(0,5).toString()!=='%PDF-')return bad(res);const pool=await poolPromise;await pool.request().input('code',sql.VarChar(20),req.params.code).input('nome',sql.NVarChar(255),`${req.params.code}.pdf`).input('data',sql.VarBinary(sql.MAX),req.body).query('UPDATE dbo.admin_documento SET nome=@nome,conteudo=@data,alterado=GETDATE() WHERE codigo=@code; IF @@ROWCOUNT=0 INSERT dbo.admin_documento(codigo,nome,conteudo) VALUES(@code,@nome,@data)');res.json({success:true});}));

  router.get('/standings',wrap(async(req,res)=>{const pool=await poolPromise;const r=await pool.request().query('SELECT s.*,e.nome_completo FROM dbo.equipa_stats_grupo s JOIN dbo.equipa e ON e.id=s.idequipa ORDER BY e.nome_completo');res.json(r.recordset);}));
  router.put('/standings/:id',wrap(async(req,res)=>{const fields=['jogos','vitorias','empates','derrotas','golos_marcados','golos_sofridos'];if(!intId(req.params.id)||fields.some(f=>!Number.isInteger(req.body?.[f])||req.body[f]<0||req.body[f]>100000))return bad(res);const pool=await poolPromise;const q=pool.request().input('id',sql.Int,Number(req.params.id));for(const f of fields)q.input(f,sql.Int,req.body[f]);const r=await q.query('UPDATE dbo.equipa_stats_grupo SET jogos=@jogos,vitorias=@vitorias,empates=@empates,derrotas=@derrotas,golos_marcados=@golos_marcados,golos_sofridos=@golos_sofridos OUTPUT INSERTED.idequipa WHERE idequipa=@id');if(!r.recordset.length)return missing(res);res.json({success:true});}));

  router.put('/games/:id/schedule',wrap(async(req,res)=>{const {hora_prevista,campo}=req.body||{};if(!intId(req.params.id)||!intId(campo)||typeof hora_prevista!=='string'||!/^\d{4}-\d\d-\d\dT\d\d:\d\d$/.test(hora_prevista))return bad(res);const pool=await poolPromise;const r=await pool.request().input('id',sql.Int,Number(req.params.id)).input('campo',sql.Int,Number(campo)).input('hora',sql.VarChar(16),hora_prevista).query("UPDATE dbo.jogo SET hora_prevista=CONVERT(datetime,REPLACE(@hora,'T',' '),120),campo=@campo OUTPUT INSERTED.id WHERE id=@id");if(!r.recordset.length)return missing(res);res.json({success:true});}));
  router.get('/fields',wrap(async(req,res)=>{const pool=await poolPromise;const r=await pool.request().query('SELECT id,descricao FROM dbo.campo ORDER BY descricao');res.json(r.recordset);}));
  router.get('/games/:id/scorers',wrap(async(req,res)=>{if(!intId(req.params.id))return bad(res);const pool=await poolPromise;const r=await pool.request().input('id',sql.Int,Number(req.params.id)).query('SELECT m.id, m.idjogador, j.nome, j.numero, j.idequipa FROM dbo.marcador m JOIN dbo.jogador j ON j.id=m.idjogador WHERE m.idjogo=@id ORDER BY m.id');res.json(r.recordset);}));
  router.post('/games/:id/action',wrap(async(req,res)=>{
    const {action, scorer}=req.body||{};
    const actions={ start:"[começado]=1,terminado=0,primeira_parte_terminada=0,segunda_parte_comecada=0,hora_inicio=GETDATE(),hora_inicio_2parte=NULL", interval:"primeira_parte_terminada=1", second:"segunda_parte_comecada=1,hora_inicio_2parte=GETDATE()", finish:"terminado=1,primeira_parte_terminada=1,segunda_parte_comecada=1", home_plus:"golos_equipa1=golos_equipa1+1", home_minus:"golos_equipa1=golos_equipa1-1", away_plus:"golos_equipa2=golos_equipa2+1", away_minus:"golos_equipa2=golos_equipa2-1" };
    const conditions={ start:'[começado]=0 AND terminado=0', interval:'[começado]=1 AND terminado=0 AND primeira_parte_terminada=0', second:'[começado]=1 AND terminado=0 AND primeira_parte_terminada=1 AND segunda_parte_comecada=0', finish:'[começado]=1 AND terminado=0 AND segunda_parte_comecada=1', home_plus:'[começado]=1 AND golos_equipa1<255', home_minus:'[começado]=1 AND golos_equipa1>0', away_plus:'[começado]=1 AND golos_equipa2<255', away_minus:'[começado]=1 AND golos_equipa2>0' };
    if(!intId(req.params.id)||!Object.hasOwn(actions,action)||(scorer != null && (!intId(scorer) || !['home_plus','away_plus'].includes(action))))return bad(res);
    const pool=await poolPromise;
    const teamColumn=action.startsWith('home_') ? 'equipa1' : 'equipa2';
    const scorerSql=['home_plus','away_plus'].includes(action) ? `IF @scorer IS NOT NULL BEGIN IF NOT EXISTS(SELECT 1 FROM dbo.jogador p JOIN dbo.jogo j ON p.idequipa=j.${teamColumn} WHERE p.id=@scorer AND j.id=@id) BEGIN ROLLBACK; SELECT CAST(0 AS bit) success; RETURN; END; INSERT dbo.marcador(idjogo,idjogador,minuto,hora) VALUES(@id,@scorer,NULL,GETDATE()); END;` : ['home_minus','away_minus'].includes(action) ? `DECLARE @team INT,@goals INT; SELECT @team=${teamColumn},@goals=${action==='home_minus'?'golos_equipa1':'golos_equipa2'} FROM dbo.jogo WHERE id=@id; IF (SELECT COUNT(*) FROM dbo.marcador m JOIN dbo.jogador p ON p.id=m.idjogador WHERE m.idjogo=@id AND p.idequipa=@team)>@goals DELETE FROM dbo.marcador WHERE id=(SELECT MAX(m.id) FROM dbo.marcador m JOIN dbo.jogador p ON p.id=m.idjogador WHERE m.idjogo=@id AND p.idequipa=@team);` : '';
    const r=await pool.request().input('id',sql.Int,Number(req.params.id)).input('scorer',sql.Int,scorer == null ? null : Number(scorer)).query(`SET XACT_ABORT ON; BEGIN TRAN; UPDATE dbo.jogo SET ${actions[action]} WHERE id=@id AND ${conditions[action]}; IF @@ROWCOUNT=0 BEGIN ROLLBACK; SELECT CAST(0 AS bit) success; RETURN; END; ${scorerSql}
      IF EXISTS (SELECT 1 FROM dbo.jogo WHERE id=@id AND terminado=1 AND jogo_grupo=1)
      BEGIN
        DECLARE @teams TABLE (id INT PRIMARY KEY); INSERT @teams SELECT equipa1 FROM dbo.jogo WHERE id=@id UNION SELECT equipa2 FROM dbo.jogo WHERE id=@id;
        INSERT dbo.equipa_stats_grupo(idequipa) SELECT t.id FROM @teams t WHERE NOT EXISTS(SELECT 1 FROM dbo.equipa_stats_grupo s WHERE s.idequipa=t.id);
        UPDATE s SET jogos=x.jogos,vitorias=x.vitorias,empates=x.empates,derrotas=x.derrotas,golos_marcados=x.gm,golos_sofridos=x.gs FROM dbo.equipa_stats_grupo s JOIN @teams t ON t.id=s.idequipa CROSS APPLY (SELECT COUNT(*) jogos,COALESCE(SUM(CASE WHEN r.gm>r.gs THEN 1 ELSE 0 END),0) vitorias,COALESCE(SUM(CASE WHEN r.gm=r.gs THEN 1 ELSE 0 END),0) empates,COALESCE(SUM(CASE WHEN r.gm<r.gs THEN 1 ELSE 0 END),0) derrotas,COALESCE(SUM(r.gm),0) gm,COALESCE(SUM(r.gs),0) gs FROM (SELECT j.golos_equipa1 gm,j.golos_equipa2 gs FROM dbo.jogo j WHERE j.equipa1=t.id AND j.jogo_grupo=1 AND j.terminado=1 UNION ALL SELECT j.golos_equipa2,j.golos_equipa1 FROM dbo.jogo j WHERE j.equipa2=t.id AND j.jogo_grupo=1 AND j.terminado=1) r) x;
      END; COMMIT; SELECT CAST(1 AS bit) success;`);
    if(!r.recordset[0]?.success)return res.status(409).json({error:'A operação não é permitida no estado atual do jogo.'});res.json({success:true});
  }));

  return router;
};
