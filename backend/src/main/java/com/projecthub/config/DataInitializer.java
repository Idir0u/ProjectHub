package com.projecthub.config;

import com.projecthub.model.Project;
import com.projecthub.model.Task;
import com.projecthub.model.User;
import com.projecthub.repository.ProjectRepository;
import com.projecthub.repository.TaskRepository;
import com.projecthub.repository.UserRepository;
import com.projecthub.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

/**
 * Initializes demo users and sample data on application startup.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final AuthService authService;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final Random random = new Random();

    @Override
    public void run(String... args) {
        log.info("Initializing demo users...");
        authService.initializeUsers();
        log.info("Demo users initialized successfully");
        
        log.info("Initializing sample data...");
        initializeSampleData();
        log.info("Sample data initialized successfully");
        
        log.info("Available test users:");
        log.info("  - Email: admin@projecthub.com | Password: admin123");
        log.info("  - Email: user@projecthub.com  | Password: user123");
    }

    private void initializeSampleData() {
        User admin = userRepository.findByEmail("admin@projecthub.com").orElse(null);
        User user = userRepository.findByEmail("user@projecthub.com").orElse(null);
        
        if (admin == null || user == null) {
            log.warn("Demo users not found, skipping sample data initialization");
            return;
        }

        // Check if data already exists for admin
        if (projectRepository.findByUserId(admin.getId()).size() > 0) {
            log.info("Sample data already exists, skipping initialization");
            return;
        }

        // Create projects for admin user
        List<Project> adminProjects = createProjects(admin);
        log.info("Created {} projects for admin user", adminProjects.size());
        
        // Create projects for regular user
        List<Project> userProjects = createProjectsForRegularUser(user);
        log.info("Created {} projects for regular user", userProjects.size());
    }

    private List<Project> createProjects(User user) {
        List<Project> projects = new ArrayList<>();

        // Project 1: E-Commerce Platform
        Project ecommerce = createProject(user, "E-Commerce Platform", 
            "Full-stack online shopping platform with payment integration and inventory management");
        projects.add(ecommerce);
        createTasks(ecommerce, new String[][]{
            {"Design database schema", "Create ER diagram and normalize tables", "true", "-5"},
            {"Setup authentication system", "Implement JWT-based auth with refresh tokens", "true", "-4"},
            {"Build product catalog API", "RESTful API for product CRUD operations", "true", "-3"},
            {"Implement shopping cart", "Add to cart, update quantities, remove items", "true", "-2"},
            {"Payment gateway integration", "Integrate Stripe for secure payments", "false", "7"},
            {"Order management system", "Track orders, status updates, notifications", "false", "14"},
            {"Deploy to production", "Setup CI/CD pipeline and deploy", "false", "21"}
        });

        // Project 2: Mobile Fitness App
        Project fitness = createProject(user, "Mobile Fitness App",
            "Cross-platform fitness tracking app with workout plans and nutrition tracking");
        projects.add(fitness);
        createTasks(fitness, new String[][]{
            {"User onboarding flow", "Create welcome screens and profile setup", "true", "-6"},
            {"Workout tracking feature", "Log exercises, sets, reps, and weight", "true", "-4"},
            {"Nutrition calculator", "Calorie and macro tracking", "true", "-1"},
            {"Social features", "Follow friends, share achievements", "false", "5"},
            {"Integrate wearables", "Connect with Fitbit and Apple Watch", "false", "12"},
            {"Premium subscription", "In-app purchases for pro features", "false", "20"}
        });

        // Project 3: Project Management Dashboard
        Project dashboard = createProject(user, "Project Management Dashboard",
            "Internal tool for team collaboration and task management");
        projects.add(dashboard);
        createTasks(dashboard, new String[][]{
            {"Create project board UI", "Kanban-style drag and drop interface", "true", "-7"},
            {"Real-time notifications", "WebSocket implementation for live updates", "true", "-3"},
            {"Team member management", "Invite users, assign roles and permissions", "true", "-1"},
            {"Time tracking feature", "Log hours spent on tasks", "false", "8"},
            {"Generate reports", "Export project statistics and timesheets", "false", "15"},
            {"Mobile responsiveness", "Optimize for tablets and phones", "false", "22"}
        });

        // Project 4: AI Chatbot Integration
        Project chatbot = createProject(user, "AI Chatbot Integration",
            "Customer service chatbot powered by machine learning");
        projects.add(chatbot);
        createTasks(chatbot, new String[][]{
            {"Research NLP models", "Compare GPT-4, BERT, and custom solutions", "true", "-10"},
            {"Setup training pipeline", "Collect and preprocess training data", "true", "-6"},
            {"Build chat interface", "React-based chat UI with typing indicators", "true", "-2"},
            {"Implement context awareness", "Maintain conversation history and context", "false", "4"},
            {"Add multilingual support", "Support English, Spanish, French", "false", "11"},
            {"Performance optimization", "Reduce response time under 1 second", "false", "18"}
        });

        // Project 5: Cloud Migration
        Project migration = createProject(user, "Cloud Migration",
            "Migrate legacy on-premise infrastructure to AWS cloud");
        projects.add(migration);
        createTasks(migration, new String[][]{
            {"Infrastructure audit", "Document current architecture and dependencies", "true", "-8"},
            {"Design cloud architecture", "Plan VPCs, subnets, security groups", "true", "-5"},
            {"Setup AWS accounts", "Configure organizations, IAM, and billing", "true", "-3"},
            {"Migrate databases", "RDS setup and data migration", "false", "6"},
            {"Container orchestration", "Setup EKS cluster for microservices", "false", "13"},
            {"Disaster recovery plan", "Implement backup and failover strategies", "false", "20"}
        });

        // Project 6: Analytics Platform
        Project analytics = createProject(user, "Analytics Platform",
            "Real-time data analytics and visualization dashboard");
        projects.add(analytics);
        createTasks(analytics, new String[][]{
            {"Setup data warehouse", "Configure Snowflake/Redshift", "true", "-9"},
            {"Build ETL pipelines", "Extract, transform, load data processes", "true", "-4"},
            {"Create visualization library", "Interactive charts with D3.js", "true", "-1"},
            {"Implement caching layer", "Redis for query result caching", "false", "7"},
            {"Add export functionality", "PDF and Excel report generation", "false", "14"},
            {"User analytics tracking", "Monitor user behavior and engagement", "false", "21"}
        });

        // Project 7: Security Audit
        Project security = createProject(user, "Security Audit",
            "Comprehensive security assessment and vulnerability remediation");
        projects.add(security);
        createTasks(security, new String[][]{
            {"Run penetration tests", "Identify security vulnerabilities", "true", "-7"},
            {"Review code for SQL injection", "Scan codebase for security issues", "true", "-4"},
            {"Update dependencies", "Patch known vulnerabilities in libraries", "true", "-2"},
            {"Implement rate limiting", "Prevent DDoS and brute force attacks", "false", "5"},
            {"Setup WAF rules", "Configure Web Application Firewall", "false", "12"},
            {"Security training", "Educate team on security best practices", "false", "19"}
        });

        // Project 8: Marketing Website Redesign
        Project marketing = createProject(user, "Marketing Website Redesign",
            "Modern, responsive website with improved SEO and conversion rates");
        projects.add(marketing);
        createTasks(marketing, new String[][]{
            {"Conduct user research", "Surveys and interviews with target audience", "true", "-6"},
            {"Create wireframes", "Design user flow and page layouts", "true", "-3"},
            {"Develop design system", "Colors, typography, component library", "true", "-1"},
            {"Build homepage", "Hero section, features, testimonials", "false", "8"},
            {"SEO optimization", "Meta tags, schema markup, performance", "false", "15"},
            {"A/B testing setup", "Implement experiments for conversion optimization", "false", "22"}
        });

        return projects;
    }

    private Project createProject(User user, String title, String description) {
        Project project = Project.builder()
            .title(title)
            .description(description)
            .user(user)
            .build();
        return projectRepository.save(project);
    }

    private void createTasks(Project project, String[][] taskData) {
        LocalDateTime now = LocalDateTime.now();
        
        for (String[] data : taskData) {
            String title = data[0];
            String description = data[1];
            boolean completed = Boolean.parseBoolean(data[2]);
            int daysOffset = Integer.parseInt(data[3]);
            
            LocalDate dueDate = LocalDate.now().plusDays(daysOffset);
            
            Task task = Task.builder()
                .title(title)
                .description(description)
                .completed(completed)
                .dueDate(dueDate)
                .project(project)
                .createdAt(now.plusDays(daysOffset - 1))
                .updatedAt(completed ? now.plusDays(daysOffset) : now)
                .build();
            
            taskRepository.save(task);
        }
    }

    private List<Project> createProjectsForRegularUser(User user) {
        List<Project> projects = new ArrayList<>();

        // Project 1: Personal Website
        Project website = createProject(user, "Personal Portfolio Website",
            "Modern portfolio website showcasing projects and skills");
        projects.add(website);
        createTasks(website, new String[][]{
            {"Design homepage mockup", "Create wireframe and visual design", "true", "-8"},
            {"Setup React project", "Initialize project with TypeScript and Vite", "true", "-6"},
            {"Build about section", "Add bio, skills, and experience", "true", "-3"},
            {"Portfolio gallery", "Display projects with images and descriptions", "false", "5"},
            {"Contact form integration", "Add email functionality", "false", "10"},
            {"Deploy to Vercel", "Setup CI/CD and custom domain", "false", "15"}
        });

        // Project 2: Budget Tracker App
        Project budget = createProject(user, "Budget Tracker App",
            "Personal finance management tool with expense tracking");
        projects.add(budget);
        createTasks(budget, new String[][]{
            {"Setup database schema", "Design tables for transactions and categories", "true", "-7"},
            {"Create expense entry form", "UI for adding income and expenses", "true", "-4"},
            {"Build dashboard", "Overview with charts and summaries", "true", "-2"},
            {"Category management", "Add, edit, delete expense categories", "false", "6"},
            {"Export to CSV", "Download transaction history", "false", "12"},
            {"Monthly reports", "Generate spending analysis reports", "false", "18"}
        });

        // Project 3: Task Management Tool
        Project taskTool = createProject(user, "Task Management Tool",
            "Personal productivity app with task prioritization");
        projects.add(taskTool);
        createTasks(taskTool, new String[][]{
            {"Design task board UI", "Kanban-style interface", "true", "-9"},
            {"Implement task CRUD", "Create, read, update, delete tasks", "true", "-5"},
            {"Add priority levels", "High, medium, low priority tags", "true", "-1"},
            {"Due date reminders", "Email notifications for upcoming tasks", "false", "7"},
            {"Dark mode support", "Toggle between light and dark themes", "false", "14"},
            {"Mobile app version", "React Native implementation", "false", "21"}
        });

        // Project 4: Recipe Book
        Project recipes = createProject(user, "Digital Recipe Book",
            "Collection of favorite recipes with search and filters");
        projects.add(recipes);
        createTasks(recipes, new String[][]{
            {"Recipe card design", "Create attractive recipe display", "true", "-6"},
            {"Add recipe form", "Input ingredients, steps, and photos", "true", "-3"},
            {"Search functionality", "Find recipes by name or ingredient", "false", "4"},
            {"Recipe categories", "Organize by meal type and cuisine", "false", "9"},
            {"Shopping list", "Generate list from recipe ingredients", "false", "16"}
        });

        // Project 5: Weather Dashboard
        Project weather = createProject(user, "Weather Dashboard",
            "Real-time weather information with forecasts");
        projects.add(weather);
        createTasks(weather, new String[][]{
            {"Integrate weather API", "Connect to OpenWeatherMap API", "true", "-4"},
            {"Display current weather", "Show temperature, conditions, humidity", "true", "-2"},
            {"5-day forecast", "Show upcoming weather predictions", "false", "8"},
            {"Location search", "Find weather for any city", "false", "13"},
            {"Save favorites", "Store frequently checked locations", "false", "20"}
        });

        return projects;
    }
}
