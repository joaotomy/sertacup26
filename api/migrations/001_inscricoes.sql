SET XACT_ABORT ON;
BEGIN TRANSACTION;

IF OBJECT_ID(N'dbo.parametro', N'U') IS NULL
BEGIN
  CREATE TABLE dbo.parametro (
    Codigo NVARCHAR(100) NOT NULL CONSTRAINT PK_parametro PRIMARY KEY,
    Valor BIT NOT NULL,
    DataCriacao DATETIME NOT NULL,
    DataAlteracao DATETIME NOT NULL
  );
END;

IF NOT EXISTS (SELECT 1 FROM dbo.parametro WHERE Codigo = N'inscricoes_abertas')
  INSERT INTO dbo.parametro (Codigo, Valor, DataCriacao, DataAlteracao)
  VALUES (N'inscricoes_abertas', 1, GETDATE(), GETDATE());

IF COL_LENGTH(N'dbo.equipa_login', N'InscricaoAberta') IS NULL
  ALTER TABLE dbo.equipa_login ADD InscricaoAberta BIT NULL;

COMMIT TRANSACTION;
