IF EXISTS (
  SELECT 1 FROM sys.columns
  WHERE object_id = OBJECT_ID(N'dbo.jogador')
    AND name COLLATE Latin1_General_100_BIN2 = N'datanascimento'
)
  EXEC sp_rename N'dbo.jogador.datanascimento', N'DataNascimento', N'COLUMN';
