# dev.ps1 — Start Next.js dev server on port 3000 (kills anything blocking it first)

$PORT = 3000

# Fix SSL for corporate proxy
npm config set strict-ssl false 2>$null

# Reload PATH so node/npm are available
$env:PATH = [System.Environment]::GetEnvironmentVariable("PATH","Machine") + ";" +
            [System.Environment]::GetEnvironmentVariable("PATH","User")

Write-Host "Checking port $PORT..." -ForegroundColor Cyan

# Find and kill process on the port
$pids = (netstat -ano | Select-String ":$PORT\s") |
        ForEach-Object { ($_ -split '\s+')[-1] } |
        Select-Object -Unique |
        Where-Object { $_ -match '^\d+$' -and $_ -ne '0' }

if ($pids) {
    foreach ($p in $pids) {
        try {
            Stop-Process -Id $p -Force -ErrorAction Stop
            Write-Host "  Killed PID $p on port $PORT" -ForegroundColor Yellow
        } catch {
            Write-Host "  Could not kill PID $p (already gone)" -ForegroundColor DarkGray
        }
    }
    Start-Sleep -Milliseconds 500
} else {
    Write-Host "  Port $PORT is free" -ForegroundColor Green
}

Write-Host ""
Write-Host "Starting Next.js dev server at http://localhost:$PORT" -ForegroundColor Green
Write-Host ""

Set-Location $PSScriptRoot
npm run dev
