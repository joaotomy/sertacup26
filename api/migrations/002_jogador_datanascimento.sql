SET XACT_ABORT ON;
BEGIN TRANSACTION;

IF COL_LENGTH(N'dbo.jogador', N'DataNascimento') IS NULL
BEGIN
  -- A data provisória só pode ser aplicada aos jogadores de demonstração.
  IF EXISTS (SELECT 1 FROM dbo.jogador WHERE nome NOT LIKE N'Jogador Demo %' AND nome NOT LIKE N'Jogador teste %')
    THROW 50001, 'Existem jogadores que necessitam de uma data de nascimento antes da migração.', 1;

  ALTER TABLE dbo.jogador ADD DataNascimento DATETIME NOT NULL
    CONSTRAINT DF_jogador_nascimento_migracao DEFAULT ('20160101') WITH VALUES;
  ALTER TABLE dbo.jogador DROP CONSTRAINT DF_jogador_nascimento_migracao;
END;

COMMIT TRANSACTION;
