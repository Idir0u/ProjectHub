# Docker Testing Quick Reference

## ✅ What's Been Set Up

### Files Created/Modified
- ✅ `docker-compose.yml` - Added test services with profiles
- ✅ `Makefile` - Easy command shortcuts
- ✅ `.github/workflows/test.yml` - CI/CD pipeline
- ✅ `TESTING.md` - Complete testing documentation
- ✅ `frontend/package.json` - Added `test:ci` script

### Test Services Available
- `backend-test` - Runs Maven tests in Docker
- `frontend-test` - Runs Vitest tests in Docker

## 🚀 Quick Start Commands

### Run All Tests (Backend + Frontend)
```bash
# From project root
cd C:\Users\Idir\Desktop\Projects\ProjectHub

# Using Make (easiest)
make test-all

# Using Docker Compose
docker-compose --profile test up --build --abort-on-container-exit
docker-compose --profile test down
```

### Run Backend Tests Only
```bash
make test-backend

# Or
docker-compose --profile test up backend-test --build --abort-on-container-exit
docker-compose --profile test down
```

### Run Frontend Tests Only
```bash
make test-frontend

# Or
docker-compose --profile test up frontend-test --build --abort-on-container-exit
docker-compose --profile test down
```

### View Test Logs
```bash
# During test run
docker-compose --profile test logs -f backend-test
docker-compose --profile test logs -f frontend-test

# After test run
docker-compose --profile test logs backend-test
docker-compose --profile test logs frontend-test
```

## 📊 Test Results

### Current Status
- **Total Tests**: 80/80 passing (100%)
- **Backend**: 18/18 tests ✅
- **Frontend**: 62/62 tests ✅

### Where to Find Reports
- **Backend**: `backend/target/surefire-reports/`
- **Frontend**: `frontend/coverage/`

## 🔧 Make Commands

```bash
make help              # Show all commands
make up                # Start application
make down              # Stop application
make test-all          # Run all tests
make test-backend      # Backend tests only
make test-frontend     # Frontend tests only
make logs              # View all logs
make logs-backend      # Backend logs
make logs-frontend     # Frontend logs
make clean             # Clean everything
make rebuild           # Rebuild images
make db-shell          # PostgreSQL shell
```

## 🐛 Troubleshooting

### Tests Won't Start
```bash
# Clean and rebuild
docker-compose down -v
docker-compose build --no-cache
```

### Port Already in Use
```bash
# Check what's using port 5433
netstat -ano | findstr :5433

# Or change port in docker-compose.yml
```

### Tests Pass Locally but Fail in Docker
```bash
# Ensure clean build
docker-compose --profile test down -v
docker-compose --profile test up --build --abort-on-container-exit
```

## 📝 Local Testing (Faster for Development)

### Backend
```bash
cd backend
mvn test
```

### Frontend
```bash
cd frontend
npm test

# Or watch mode
npm test -- --watch
```

## 🔄 CI/CD

Tests automatically run on GitHub Actions when you:
- Push to `main` or `develop`
- Create a pull request

View results in: **GitHub → Actions tab**

## 💡 Tips

1. **Use local testing during development** - It's faster
2. **Use Docker testing before commits** - Ensures consistency
3. **Check test logs if failures occur** - `make logs-backend` or `make logs-frontend`
4. **Clean environment if weird issues** - `make clean`

## 📖 Full Documentation

See `TESTING.md` for complete testing guide with:
- Detailed test coverage
- All testing scenarios
- Advanced troubleshooting
- Best practices
- Performance tips

---

**Quick Test**: Run `make test-all` to verify everything works!
