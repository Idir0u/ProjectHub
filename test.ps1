# ProjectHub Test Runner - PowerShell Script
# Alternative to Makefile for Windows users

param(
    [Parameter(Position=0)]
    [string]$Command = "help"
)

function Show-Help {
    Write-Host "Available commands:" -ForegroundColor Cyan
    Write-Host "  .\test.ps1 up                - Start all application services"
    Write-Host "  .\test.ps1 down              - Stop all services"
    Write-Host "  .\test.ps1 test-all          - Run all tests (backend + frontend)"
    Write-Host "  .\test.ps1 test-backend      - Run backend tests only"
    Write-Host "  .\test.ps1 test-frontend     - Run frontend tests only"
    Write-Host "  .\test.ps1 logs              - View logs from all services"
    Write-Host "  .\test.ps1 logs-backend      - View backend logs"
    Write-Host "  .\test.ps1 logs-frontend     - View frontend logs"
    Write-Host "  .\test.ps1 logs-db           - View database logs"
    Write-Host "  .\test.ps1 clean             - Remove all containers, volumes, and images"
    Write-Host "  .\test.ps1 rebuild           - Rebuild all images"
    Write-Host "  .\test.ps1 db-shell          - Connect to PostgreSQL shell"
    Write-Host ""
    Write-Host "Local testing (faster):" -ForegroundColor Yellow
    Write-Host "  .\test.ps1 test-local-backend  - Run backend tests locally"
    Write-Host "  .\test.ps1 test-local-frontend - Run frontend tests locally"
}

function Test-All {
    Write-Host "Running all tests..." -ForegroundColor Green
    docker-compose --profile test up --build --abort-on-container-exit
    docker-compose --profile test down
}

function Test-Backend {
    Write-Host "Running backend tests..." -ForegroundColor Green
    docker-compose --profile test up backend-test --build --abort-on-container-exit
    docker-compose --profile test down
}

function Test-Frontend {
    Write-Host "Running frontend tests..." -ForegroundColor Green
    docker-compose --profile test up frontend-test --build --abort-on-container-exit
    docker-compose --profile test down
}

function Start-App {
    Write-Host "Starting ProjectHub..." -ForegroundColor Green
    docker-compose up -d
}

function Stop-App {
    Write-Host "Stopping ProjectHub..." -ForegroundColor Yellow
    docker-compose down
}

function Show-Logs {
    docker-compose logs -f
}

function Show-BackendLogs {
    docker-compose logs -f backend
}

function Show-FrontendLogs {
    docker-compose logs -f frontend
}

function Show-DbLogs {
    docker-compose logs -f db
}

function Rebuild-Images {
    Write-Host "Rebuilding all images..." -ForegroundColor Yellow
    docker-compose build --no-cache
}

function Clean-All {
    Write-Host "Cleaning up..." -ForegroundColor Red
    docker-compose down -v
    docker system prune -f
}

function Test-LocalBackend {
    Write-Host "Running backend tests locally..." -ForegroundColor Green
    Push-Location backend
    mvn test
    Pop-Location
}

function Test-LocalFrontend {
    Write-Host "Running frontend tests locally..." -ForegroundColor Green
    Push-Location frontend
    npm run test:ci
    Pop-Location
}

function Open-DbShell {
    docker-compose exec db psql -U postgres -d projecthub
}

# Main command dispatcher
switch ($Command.ToLower()) {
    "help" { Show-Help }
    "test-all" { Test-All }
    "test-backend" { Test-Backend }
    "test-frontend" { Test-Frontend }
    "up" { Start-App }
    "down" { Stop-App }
    "logs" { Show-Logs }
    "logs-backend" { Show-BackendLogs }
    "logs-frontend" { Show-FrontendLogs }
    "logs-db" { Show-DbLogs }
    "rebuild" { Rebuild-Images }
    "clean" { Clean-All }
    "test-local-backend" { Test-LocalBackend }
    "test-local-frontend" { Test-LocalFrontend }
    "db-shell" { Open-DbShell }
    default {
        Write-Host "Unknown command: $Command" -ForegroundColor Red
        Write-Host ""
        Show-Help
    }
}
