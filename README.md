# ProjectHub - Modern Project Management Platform

A full-stack project management application built with modern technologies, featuring task management, team collaboration, real-time analytics, and an intuitive Kanban board interface.

## 🎥 Demo Video

**[Watch Demo Video Here](YOUR_VIDEO_LINK_HERE)**

> 📹 A 2-minute screen capture demonstrating the application's key features, technical implementation, and design decisions.

## 🚀 Features

- **Task Management**: Create, update, delete, and organize tasks with priorities and status tracking
- **Kanban Board**: Drag-and-drop interface for visual task organization (TODO, IN_PROGRESS, DONE)
- **Project Collaboration**: Multi-user project management with team member invitations
- **Real-time Analytics**: Visual dashboards with charts showing project progress and task distribution
- **User Authentication**: Secure JWT-based authentication with role-based access
- **Responsive Design**: Mobile-first approach with DaisyUI and Tailwind CSS
- **Dark/Light Theme**: Toggle between themes with persistent preferences
- **Search & Filters**: Advanced filtering and search capabilities for tasks and projects
- **Bulk Operations**: Select multiple tasks for batch operations

## 🛠️ Technologies Used

### Backend
- **Java 21** with **Spring Boot 3.2.1**
- **Spring Security** with JWT authentication
- **Spring Data JPA** for database operations
- **PostgreSQL 16** database
- **Maven 3.9** for dependency management
- **Lombok** for reducing boilerplate code

### Frontend
- **React 19.0.0** with **TypeScript**
- **Vite** for blazing-fast development
- **React Router** for navigation
- **TailwindCSS** + **DaisyUI** for styling
- **Recharts** for data visualization
- **Vitest** for unit testing (62 test suites)
- **@hello-pangea/dnd** for drag-and-drop functionality

### DevOps & Testing
- **Docker** & **Docker Compose** for containerization
- **PostgreSQL** with persistent volumes
- **Nginx** as production web server
- **GitHub Actions** for CI/CD
- **JUnit 5** & **Mockito** for backend testing (18 test suites)
- **Total Test Coverage**: 80 tests (100% passing)

## 📋 Prerequisites

### Recommended: Docker Setup (Easiest)

Only need:
- **Docker Desktop** (Windows/Mac) or **Docker** + **Docker Compose** (Linux)

That's it! Everything else is containerized.

### Alternative: Manual Setup

If you prefer running without Docker:
- **Java 21** (OpenJDK or Amazon Corretto)
- **Node.js 20.x** or higher
- **PostgreSQL 16** or higher
- **Maven 3.9** or higher

## 🚀 Quick Start with Docker Compose (Recommended)

The easiest way to run the entire application:

### 1️⃣ Start the Application

```bash
# Clone the repository
git clone https://github.com/Idir0u/ProjectHub
cd ProjectHub

# Start all services (database, backend, frontend)
docker-compose up -d
```

### 2️⃣ Access the Application

- **Frontend**: http://localhost
- **Backend API**: http://localhost:8080
- **Database**: localhost:5432

### 3️⃣ Stop the Application

```bash
# Stop all services
docker-compose down

# Stop and remove all data (clean slate)
docker-compose down -v
```

### That's It! 🎉

The application is now running with:
- ✅ PostgreSQL database with persistent storage
- ✅ Spring Boot backend API
- ✅ React frontend with Nginx
- ✅ Automatic database schema creation
- ✅ Network configuration for inter-service communication

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Rebuild After Code Changes

```bash
# Rebuild and restart
docker-compose up -d --build
```

## 🐳 Docker Testing

Run the complete test suite in Docker:

### Windows (PowerShell)

```powershell
# Run all tests (backend + frontend)
.\test.ps1 test-all

# Run only backend tests
.\test.ps1 test-backend

# Run only frontend tests
.\test.ps1 test-frontend

# Clean up
.\test.ps1 clean
```

### Linux/Mac

```bash
# Run all tests
make test-all

# Run only backend tests
make test-backend

# Run only frontend tests
make test-frontend

# Clean up
make clean
```


## 🛠️ Alternative: Manual Setup (Without Docker)

### Database Setup

1. **Install PostgreSQL 16** from [postgresql.org](https://www.postgresql.org/download/)

2. **Create Database**:
   ```bash
   psql -U postgres
   CREATE DATABASE projecthub;
   ```

3. **Update Configuration** in `backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/projecthub
   spring.datasource.username=postgres
   spring.datasource.password=your_password
   ```

### Run Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend will start on http://localhost:8080

### Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will start on http://localhost:5173 (dev mode) or http://localhost (production)

## 📡 API Endpoints

**Authentication**:
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

**Projects**:
- `GET /api/projects` - Get all user projects
- `POST /api/projects` - Create new project
- `GET /api/projects/{id}` - Get project details
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project

**Tasks**:
- `GET /api/projects/{projectId}/tasks` - Get project tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task

**Analytics**:
- `GET /api/analytics/projects/{projectId}` - Get project analytics

### Run Tests in Docker

**All tests**:
```bash
docker-compose --profile test up --abort-on-container-exit
```

**Backend tests only**:
```bash
docker-compose --profile test up backend-test --abort-on-container-exit
```

**Frontend tests only**:
```bash
docker-compose --profile test up frontend-test --abort-on-container-exit
```

For more Docker testing commands, see [DOCKER-TESTING.md](./DOCKER-TESTING.md).

### Windows Users

Use the PowerShell script for easier testing:

```powershell
# Run all tests
.\test.ps1 test-all

# Run backend tests
.\test.ps1 test-backend

# Run frontend tests
.\test.ps1 test-frontend

# View logs
.\test.ps1 logs

# Clean up
.\test.ps1 clean
```

Try the application with these pre-configured demo accounts:

### Admin Account (Full Access)
- **Email**: `admin@projecthub.com`
- **Password**: `admin123`

### User Account (Standard Access)
- **Email**: `user@projecthub.com`
- **Password**: `user123`

## 🧪 Testing

### Backend Tests

```bash
cd backend
mvn test
```

**Test Coverage**:
- 18 unit tests across controllers, services, and repositories
- Mockito for mocking dependencies
- JUnit 5 for test framework
- Test coverage includes authentication, CRUD operations, and business logic

### Frontend Tests

```bash
cd frontend
npm run test
```

**Test Coverage**:
- 62 test suites covering components, hooks, and context
- Vitest + React Testing Library
- Tests include UI interactions, state management, and API calls

### Total Project Tests

- ✅ **80 tests** (18 backend + 62 frontend)
- ✅ **100% passing**
- 🐳 **Dockerized test execution**

## 📁 Project Structure

```
ProjectHub/
├── backend/                    # Spring Boot application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/projecthub/
│   │   │   │   ├── config/    # Security, CORS configuration
│   │   │   │   ├── controller/# REST API endpoints
│   │   │   │   ├── dto/       # Data Transfer Objects
│   │   │   │   ├── model/     # JPA entities
│   │   │   │   ├── repository/# Data access layer
│   │   │   │   ├── security/  # JWT, authentication
│   │   │   │   └── service/   # Business logic
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/              # Unit tests
│   ├── Dockerfile
│   └── pom.xml
│
├── frontend/                   # React + TypeScript application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── context/           # React Context (Auth, Theme, Toast)
│   │   ├── hooks/             # Custom React hooks
│   │   ├── pages/             # Page components
│   │   ├── services/          # API service layer
│   │   ├── test/              # Component tests
│   │   └── types/             # TypeScript interfaces
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── vite.config.ts
│
├── .github/
│   └── workflows/
│       └── test.yml           # CI/CD pipeline
│
├── docker-compose.yml         # Multi-container orchestration
├── test.ps1                   # Windows test script
├── Makefile                   # Unix/Linux test commands
├── DOCKER-TESTING.md          # Docker testing guide
└── README.md                  # This file
```

## 🔑 Key Technical Decisions

### 1. Architecture
- **Separation of Concerns**: Clear separation between presentation, business logic, and data layers
- **RESTful API**: Stateless API design following REST principles
- **JWT Authentication**: Stateless authentication for scalability
- **Single Page Application**: React SPA for smooth user experience

### 2. Security
- **Spring Security**: Industry-standard security framework
- **Password Encryption**: BCrypt hashing for password storage
- **CORS Configuration**: Controlled cross-origin resource sharing
- **JWT Tokens**: Secure, stateless authentication with expiration

### 3. Database
- **PostgreSQL**: ACID compliance, robust relational database
- **JPA/Hibernate**: ORM for database abstraction
- **Flyway/Liquibase**: (Optional) Database migration versioning
- **Cascading Operations**: Proper entity relationships with cascade types

### 4. Frontend State Management
- **React Context API**: Lightweight state management for auth, theme, and notifications
- **Custom Hooks**: Reusable logic encapsulation
- **LocalStorage**: Persistent authentication state

### 5. Testing Strategy
- **Unit Tests**: Component and service-level testing
- **Integration Tests**: API endpoint testing
- **Dockerized Tests**: Consistent test environment
- **CI/CD Pipeline**: Automated testing on every commit

### 6. UI/UX Design
- **Mobile-First**: Responsive design starting from mobile
- **DaisyUI Components**: Consistent, accessible UI components
- **Dark Mode**: User preference with system detection
- **Toast Notifications**: Non-intrusive user feedback

### 7. Performance
- **Vite**: Fast build tool with HMR
- **Code Splitting**: Lazy loading for optimal bundle size
- **Database Indexing**: Optimized queries with proper indexes
- **Connection Pooling**: Efficient database connections (HikariCP)

## 🚀 Deployment

### Production Deployment Checklist

- [ ] Update JWT secret key (strong, random value)
- [ ] Configure production database
- [ ] Set environment-specific CORS origins
- [ ] Enable HTTPS/TLS
- [ ] Configure proper logging levels
- [ ] Set up monitoring and alerting
- [ ] Configure backup strategy
- [ ] Review security headers
- [ ] Optimize database indexes
- [ ] Set up CDN for static assets

### Environment Variables for Production

**Backend**:
```bash
SPRING_PROFILES_ACTIVE=prod
SPRING_DATASOURCE_URL=jdbc:postgresql://prod-db:5432/projecthub
SPRING_DATASOURCE_USERNAME=prod_user
SPRING_DATASOURCE_PASSWORD=strong_password
JWT_SECRET=very-long-random-secret-key-at-least-256-bits
CORS_ALLOWED_ORIGINS=https://your-domain.com
```

**Frontend**:
```bash
VITE_API_URL=https://api.your-domain.com
```

## 📊 System Requirements

### Minimum Requirements
- **CPU**: 2 cores
- **RAM**: 4 GB
- **Disk**: 10 GB
- **OS**: Windows 10+, macOS 10.15+, Linux (Ubuntu 20.04+)

### Recommended for Development
- **CPU**: 4 cores
- **RAM**: 8 GB
- **Disk**: 20 GB SSD
- **OS**: Latest stable versions

## 🐛 Troubleshooting

### Backend Issues

**Database Connection Error**:
```bash
# Check PostgreSQL is running
docker ps | grep postgres

# Verify connection
psql -h localhost -U postgres -d projecthub
```

**Port Already in Use**:
```bash
# Change port in application.properties
server.port=8081
```

### Frontend Issues

**Dependencies Installation Failed**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**API Connection Error**:
- Verify backend is running on `http://localhost:8080`
- Check CORS configuration in backend
- Verify `.env` file has correct `VITE_API_URL`

### Docker Issues

**Build Failed**:
```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

**Container Exits Immediately**:
```bash
# Check logs
docker-compose logs backend
docker-compose logs frontend
```

## 📝 License

This project is developed for educational purposes.

## 👨‍💻 Author

**Your Name**
- GitHub: [@Idir0u](https://github.com/Idir0u)
- Email: oubezaidir@gmail.com

## 🙏 Acknowledgments

- Spring Boot for the robust backend framework
- React team for the excellent frontend library
- DaisyUI for beautiful UI components
- All open-source contributors

---

**Made with ❤️ for amazing teams | © 2025 ProjectHub**
