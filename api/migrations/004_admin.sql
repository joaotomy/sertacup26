SET XACT_ABORT ON;
BEGIN TRANSACTION;
IF OBJECT_ID(N'dbo.admin_alojamento', N'U') IS NULL
  CREATE TABLE dbo.admin_alojamento (
    idequipa INT NOT NULL CONSTRAINT PK_admin_alojamento PRIMARY KEY,
    tipo NVARCHAR(100) NOT NULL, localizacao NVARCHAR(250) NOT NULL,
    maps_url NVARCHAR(1000) NULL, regras NVARCHAR(MAX) NULL,
    CONSTRAINT FK_admin_alojamento_equipa FOREIGN KEY (idequipa) REFERENCES dbo.equipa(id)
  );
IF OBJECT_ID(N'dbo.admin_programa', N'U') IS NULL
  CREATE TABLE dbo.admin_programa (
    id INT IDENTITY PRIMARY KEY, dia INT NOT NULL CHECK (dia BETWEEN 1 AND 4),
    hora CHAR(5) NOT NULL, descricao NVARCHAR(250) NOT NULL
  );
IF OBJECT_ID(N'dbo.admin_documento', N'U') IS NULL
  CREATE TABLE dbo.admin_documento (
    codigo VARCHAR(20) NOT NULL PRIMARY KEY, nome NVARCHAR(255) NOT NULL,
    conteudo VARBINARY(MAX) NOT NULL, alterado DATETIME NOT NULL DEFAULT GETDATE()
  );
IF OBJECT_ID(N'dbo.admin_contactos', N'U') IS NULL
  CREATE TABLE dbo.admin_contactos (
    id INT NOT NULL PRIMARY KEY CHECK (id = 1), email NVARCHAR(255) NULL,
    telefone NVARCHAR(100) NULL, outros NVARCHAR(1000) NULL
  );
IF NOT EXISTS (SELECT 1 FROM dbo.admin_contactos WHERE id=1)
  INSERT dbo.admin_contactos(id) VALUES(1);
COMMIT TRANSACTION;
