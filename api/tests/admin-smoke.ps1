$ErrorActionPreference = 'Stop'
$env:PORT = '3017'
$testName = 'AdminTeste' + [guid]::NewGuid().ToString('N').Substring(0, 10)
$teamA = $null; $teamB = $null; $gameId = $null; $programId = $null
$testDocument = $false; $pdfFile = $null; $downloadFile = $null
$log = Join-Path $env:TEMP ('serta-admin-' + [guid]::NewGuid().ToString('N') + '.log')
$process = Start-Process -FilePath 'node.exe' -ArgumentList 'server.js' -WorkingDirectory (Split-Path -Parent $PSScriptRoot) -WindowStyle Hidden -RedirectStandardError $log -PassThru
$connection = New-Object System.Data.SqlClient.SqlConnection 'Server=localhost\MSSQLSERVER01;Database=sertacup26;Integrated Security=True;Encrypt=False;TrustServerCertificate=True;Connection Timeout=5'
function Call-Api($method, $path, $payload = $null, $headers = @{}) {
  $requestArgs = @{ Method=$method; Uri="http://127.0.0.1:3017$path"; TimeoutSec=5; Headers=$headers }
  if ($null -ne $payload) { $requestArgs.ContentType='application/json'; $requestArgs.Body=ConvertTo-Json -Compress -InputObject $payload }
  return Invoke-RestMethod @requestArgs
}
function Sql-Exec($text) { $command=$connection.CreateCommand(); $command.CommandText=$text; return $command.ExecuteScalar() }
try {
  $connection.Open()
  $ready=$false
  for($i=0;$i -lt 20;$i++){try{$null=Call-Api 'GET' '/admin/overview';$ready=$true;break}catch{Start-Sleep -Milliseconds 500}}
  if(-not $ready){throw 'A API de teste não iniciou.'}
  $fields=Call-Api 'GET' '/admin/fields'; if(-not $fields.Count){throw 'É necessário um campo para o teste.'}
  $a=Call-Api 'POST' '/admin/teams' @{nome_completo=($testName+' A');nome=($testName+' A');sigla='TAA';cor_principal='#000000';cor_secundaria='#ffffff';simbolo='/images/logo.png'}; $teamA=[int]$a.id
  $b=Call-Api 'POST' '/admin/teams' @{nome_completo=($testName+' B');nome=($testName+' B');sigla='TBB';cor_principal='#000000';cor_secundaria='#ffffff';simbolo='/images/logo.png'}; $teamB=[int]$b.id
  $account=Call-Api 'POST' '/admin/accounts' @{username=$testName;password='Teste123';idequipa=$teamA;inscricaoAberta=$false}
  $login=Call-Api 'POST' '/team-login' @{username=$testName;password='Teste123'}; $auth=@{Authorization="Bearer $($login.token)"}
  try { $null=Call-Api 'POST' '/team-players' @{nome='Teste';numero=7;datanascimento='2016-01-01'} $auth; throw 'Inscrição fechada foi aceite.' } catch { if(-not $_.Exception.Response -or [int]$_.Exception.Response.StatusCode -ne 403){throw} }
  $null=Call-Api 'PUT' "/admin/accounts/$($account.id)" @{username=$testName;password='';idequipa=$teamA;inscricaoAberta=$true}
  try { $null=Call-Api 'GET' '/team-session' $null $auth; throw 'A sessão antiga não foi invalidada.' } catch { if(-not $_.Exception.Response -or [int]$_.Exception.Response.StatusCode -ne 401){throw} }
  $login=Call-Api 'POST' '/team-login' @{username=$testName;password='Teste123'}; $auth=@{Authorization="Bearer $($login.token)"}
  $player=Call-Api 'POST' '/team-players' @{nome=$testName;numero=7;datanascimento='2016-01-01'} $auth
  $null=Call-Api 'PUT' "/admin/players/$($player.id)" @{nome=$testName;numero=8;datanascimento='2016-02-01';idequipa=$teamA}
  $null=Call-Api 'PUT' "/admin/accommodation/$teamA" @{tipo='Teste';localizacao='Teste';maps_url='https://maps.google.com/';regras='Teste'}
  $accommodation=Call-Api 'GET' '/team-accommodation' $null $auth; if($accommodation.tipo -ne 'Teste'){throw 'Alojamento não chegou à equipa.'}
  $entry=Call-Api 'POST' '/admin/program' @{dia=1;hora='10:30';descricao=$testName}; $programId=[int]$entry.id
  $null=Call-Api 'PUT' "/admin/program/$programId" @{dia=2;hora='11:30';descricao=$testName}
  $contacts=Call-Api 'GET' '/admin/contacts'; $null=Call-Api 'PUT' '/admin/contacts' @{email=$contacts.email;telefone=$contacts.telefone;outros=$contacts.outros}
  $documents=Call-Api 'GET' '/admin/documents'
  if(-not ($documents | Where-Object {$_.codigo -eq 'manual'})) {
    $pdfFile=Join-Path $env:TEMP ($testName+'.pdf'); $downloadFile=Join-Path $env:TEMP ($testName+'-download.pdf')
    $pdfBytes=[System.Text.Encoding]::ASCII.GetBytes("%PDF-1.4`n% test $testName`n%%EOF`n"); [System.IO.File]::WriteAllBytes($pdfFile,$pdfBytes)
    $testDocument=$true
    $null=Invoke-RestMethod -Uri 'http://127.0.0.1:3017/admin/documents/manual' -Method Put -ContentType 'application/pdf' -InFile $pdfFile -TimeoutSec 10
    Invoke-WebRequest -Uri 'http://127.0.0.1:3017/admin/documents/manual' -OutFile $downloadFile -TimeoutSec 10
    if((Get-FileHash -LiteralPath $pdfFile).Hash -ne (Get-FileHash -LiteralPath $downloadFile).Hash){throw 'O documento descarregado é diferente do carregado.'}
  }
  $fieldId=[int]$fields[0].id
  $gameId=[int](Sql-Exec "SET XACT_ABORT ON; BEGIN TRAN; IF EXISTS(SELECT 1 FROM dbo.jogo WHERE chave='QZ9') THROW 50000,'Chave de teste ja existe.',1; DECLARE @id int; SELECT @id=ISNULL(MAX(id),0)+1 FROM dbo.jogo WITH (UPDLOCK,HOLDLOCK); INSERT dbo.jogo(id,chave,hora_prevista,equipa1,equipa2,golos_equipa1,golos_equipa2,primeira_parte_terminada,segunda_parte_comecada,[come$([char]0x00e7)ado],terminado,campo,grupo,jogo_grupo) VALUES(@id,'QZ9',GETDATE(),$teamA,$teamB,0,0,0,0,0,0,$fieldId,1,1); COMMIT; SELECT @id;")
  $null=Call-Api 'PUT' "/admin/games/$gameId/schedule" @{hora_prevista='2027-06-10T09:30';campo=$fieldId}
  $null=Call-Api 'POST' "/admin/games/$gameId/action" @{action='start'}
  $null=Call-Api 'POST' "/admin/games/$gameId/action" @{action='home_plus';scorer=$player.id}
  $scorers=Call-Api 'GET' "/admin/games/$gameId/scorers"; if(-not ($scorers | Where-Object {$_.idjogador -eq $player.id})){throw 'Marcador não guardado.'}
  foreach($action in @('interval','second','finish')){$null=Call-Api 'POST' "/admin/games/$gameId/action" @{action=$action}}
  try {$null=Call-Api 'POST' "/admin/games/$gameId/action" @{action='finish'};throw 'Fecho repetido foi aceite.'} catch {if(-not $_.Exception.Response -or [int]$_.Exception.Response.StatusCode -ne 409){throw}}
  $stats=Call-Api 'GET' '/admin/standings'; $standing=$stats | Where-Object {$_.idequipa -eq $teamA}; if($standing.jogos -ne 1 -or $standing.vitorias -ne 1){throw 'Classificação não atualizada.'}
  $null=Call-Api 'POST' "/admin/games/$gameId/action" @{action='away_plus'}; $stats=Call-Api 'GET' '/admin/standings'; $standing=$stats | Where-Object {$_.idequipa -eq $teamA}; if($standing.empates -ne 1 -or $standing.vitorias -ne 0){throw 'Correção da classificação falhou.'}
  $null=Call-Api 'POST' "/admin/games/$gameId/action" @{action='home_minus'}; $scorers=Call-Api 'GET' "/admin/games/$gameId/scorers"; if(@($scorers).Count -gt 0){throw 'Marcador não removido na correção.'}
  'Contas, inscrições, jogadores, alojamento, programa, horários, jogo e classificações: OK.'
} catch {
  if(Test-Path -LiteralPath $log){Get-Content -LiteralPath $log}
  throw
} finally {
  if($connection.State -eq 'Open'){
    if($testDocument -and $pdfBytes){[void](Sql-Exec "DELETE FROM dbo.admin_documento WHERE codigo='manual' AND nome='manual.pdf' AND DATALENGTH(conteudo)=$($pdfBytes.Length)")}
    if($programId){[void](Sql-Exec "DELETE FROM dbo.admin_programa WHERE id=$programId")}
    if($gameId){[void](Sql-Exec "DELETE FROM dbo.marcador WHERE idjogo=$gameId AND EXISTS (SELECT 1 FROM dbo.jogo WHERE id=$gameId AND chave='QZ9' AND equipa1=$teamA AND equipa2=$teamB); DELETE FROM dbo.jogo WHERE id=$gameId AND chave='QZ9' AND equipa1=$teamA AND equipa2=$teamB")}
    foreach($id in @($teamA,$teamB)){if($id){[void](Sql-Exec "DELETE FROM dbo.admin_alojamento WHERE idequipa=$id; DELETE FROM dbo.jogador WHERE idequipa=$id; DELETE FROM dbo.equipa_login WHERE idequipa=$id; DELETE FROM dbo.equipa_stats_grupo WHERE idequipa=$id; DELETE FROM dbo.equipa WHERE id=$id AND nome_completo LIKE 'AdminTeste%';")}}
    $connection.Close()
  }
  Stop-Process -Id $process.Id -ErrorAction SilentlyContinue
  if($pdfFile){Remove-Item -LiteralPath $pdfFile -ErrorAction SilentlyContinue}
  if($downloadFile){Remove-Item -LiteralPath $downloadFile -ErrorAction SilentlyContinue}
  Remove-Item -LiteralPath $log -ErrorAction SilentlyContinue
  Remove-Item Env:PORT -ErrorAction SilentlyContinue
}
