.PHONY: test test-backend test-frontend test-all up down clean logs help

# Help command
help:
	@echo "Available commands:"
	@echo "  make up              - Start all application services"
	@echo "  make down            - Stop all services"
	@echo "  make test-all        - Run all tests (backend + frontend)"
	@echo "  make test-backend    - Run backend tests only"
	@echo "  make test-frontend   - Run frontend tests only"
	@echo "  make logs            - View logs from all services"
	@echo "  make logs-backend    - View backend logs"
	@echo "  make logs-frontend   - View frontend logs"
	@echo "  make clean           - Remove all containers, volumes, and images"
	@echo "  make rebuild         - Rebuild all images"

# Run all tests
test-all:
	@echo "Running all tests..."
	docker-compose --profile test up --build --abort-on-container-exit
	docker-compose --profile test down

# Run backend tests only
test-backend:
	@echo "Running backend tests..."
	docker-compose --profile test up backend-test --build --abort-on-container-exit
	docker-compose --profile test down

# Run frontend tests only
test-frontend:
	@echo "Running frontend tests..."
	docker-compose --profile test up frontend-test --build --abort-on-container-exit
	docker-compose --profile test down

# Run application services
up:
	@echo "Starting ProjectHub..."
	docker-compose up -d

# Stop all services
down:
	@echo "Stopping ProjectHub..."
	docker-compose down

# View logs
logs:
	docker-compose logs -f

logs-backend:
	docker-compose logs -f backend

logs-frontend:
	docker-compose logs -f frontend

logs-db:
	docker-compose logs -f db

# Rebuild images
rebuild:
	@echo "Rebuilding all images..."
	docker-compose build --no-cache

# Clean everything
clean:
	@echo "Cleaning up..."
	docker-compose down -v
	docker system prune -f

# Run tests locally (without Docker)
test-local-backend:
	@echo "Running backend tests locally..."
	cd backend && mvn test

test-local-frontend:
	@echo "Running frontend tests locally..."
	cd frontend && npm run test

# Database operations
db-shell:
	docker-compose exec db psql -U postgres -d projecthub

db-backup:
	docker-compose exec db pg_dump -U postgres projecthub > backup_$$(date +%Y%m%d_%H%M%S).sql

# Development helpers
dev-backend:
	cd backend && mvn spring-boot:run

dev-frontend:
	cd frontend && npm run dev
