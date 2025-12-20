package com.projecthub.config;

import com.projecthub.model.*;
import com.projecthub.repository.ProjectRepository;
import com.projecthub.repository.TaskRepository;
import com.projecthub.repository.UserRepository;
import com.projecthub.repository.TagRepository;
import com.projecthub.service.AuthService;
import com.projecthub.service.ProjectMemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

/**
 * Initializes demo users and sample data on application startup.
 * 
 * Smart Features Demo Data includes:
 * - Task Priority levels (LOW, MEDIUM, HIGH) with color-coded badges
 * - Custom Tags with colors for categorization
 * - Task Dependencies (tasks that depend on others)
 * - Recurrence Patterns (DAILY, WEEKLY, MONTHLY)
 * - Task Status (TODO, IN_PROGRESS, DONE) for Kanban board
 * 
 * Admin user gets 4 projects with full smart features:
 * 1. E-Commerce Platform - 7 tasks with dependencies and tags
 * 2. Mobile Fitness App - 6 tasks with priorities and tags
 * 3. Project Management Dashboard - 6 tasks with recurrence and tags
 * 4. AI Chatbot Integration - 6 tasks with dependencies and AI tags
 * 
 * Regular user gets 5 simpler projects without smart features.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final AuthService authService;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final TagRepository tagRepository;
    private final ProjectMemberService projectMemberService;
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
        
        // Create tags for this project
        Tag bugTag = createTag(ecommerce, "Bug", "#ef4444");
        Tag featureTag = createTag(ecommerce, "Feature", "#3b82f6");
        Tag urgentTag = createTag(ecommerce, "Urgent", "#f97316");
        Tag backendTag = createTag(ecommerce, "Backend", "#8b5cf6");
        Tag frontendTag = createTag(ecommerce, "Frontend", "#10b981");
        
        createTasksWithSmartFeatures(ecommerce, new Object[][]{
            {"Design database schema", "Create ER diagram and normalize tables", true, "-5", TaskPriority.MEDIUM, TaskStatus.DONE, RecurrencePattern.NONE, null, List.of(backendTag), List.of()},
            {"Setup authentication system", "Implement JWT-based auth with refresh tokens", true, "-4", TaskPriority.HIGH, TaskStatus.DONE, RecurrencePattern.NONE, null, List.of(backendTag, urgentTag), List.of()},
            {"Build product catalog API", "RESTful API for product CRUD operations", true, "-3", TaskPriority.HIGH, TaskStatus.DONE, RecurrencePattern.NONE, null, List.of(backendTag, featureTag), List.of()},
            {"Implement shopping cart", "Add to cart, update quantities, remove items", true, "-2", TaskPriority.MEDIUM, TaskStatus.DONE, RecurrencePattern.NONE, null, List.of(frontendTag, featureTag), List.of()},
            {"Payment gateway integration", "Integrate Stripe for secure payments", false, "7", TaskPriority.HIGH, TaskStatus.IN_PROGRESS, RecurrencePattern.NONE, null, List.of(backendTag, urgentTag), List.of()},
            {"Order management system", "Track orders, status updates, notifications", false, "14", TaskPriority.MEDIUM, TaskStatus.TODO, RecurrencePattern.NONE, null, List.of(backendTag, featureTag), List.of(4)},
            {"Deploy to production", "Setup CI/CD pipeline and deploy", false, "21", TaskPriority.HIGH, TaskStatus.TODO, RecurrencePattern.NONE, null, List.of(urgentTag), List.of(4, 5)}
        });

        // Project 2: Mobile Fitness App
        Project fitness = createProject(user, "Mobile Fitness App",
            "Cross-platform fitness tracking app with workout plans and nutrition tracking");
        projects.add(fitness);
        
        Tag mobileTag = createTag(fitness, "Mobile", "#ec4899");
        Tag designTag = createTag(fitness, "Design", "#f59e0b");
        Tag integrationTag = createTag(fitness, "Integration", "#06b6d4");
        
        createTasksWithSmartFeatures(fitness, new Object[][]{
            {"User onboarding flow", "Create welcome screens and profile setup", true, "-6", TaskPriority.HIGH, TaskStatus.DONE, RecurrencePattern.NONE, null, List.of(mobileTag, designTag), List.of()},
            {"Workout tracking feature", "Log exercises, sets, reps, and weight", true, "-4", TaskPriority.HIGH, TaskStatus.DONE, RecurrencePattern.NONE, null, List.of(mobileTag, featureTag), List.of()},
            {"Nutrition calculator", "Calorie and macro tracking", true, "-1", TaskPriority.MEDIUM, TaskStatus.DONE, RecurrencePattern.NONE, null, List.of(mobileTag, featureTag), List.of()},
            {"Social features", "Follow friends, share achievements", false, "5", TaskPriority.LOW, TaskStatus.IN_PROGRESS, RecurrencePattern.NONE, null, List.of(mobileTag, featureTag), List.of(1, 2)},
            {"Integrate wearables", "Connect with Fitbit and Apple Watch", false, "12", TaskPriority.MEDIUM, TaskStatus.TODO, RecurrencePattern.NONE, null, List.of(integrationTag), List.of(2)},
            {"Premium subscription", "In-app purchases for pro features", false, "20", TaskPriority.LOW, TaskStatus.TODO, RecurrencePattern.NONE, null, List.of(mobileTag, featureTag), List.of()}
        });

        // Project 3: Project Management Dashboard
        Project dashboard = createProject(user, "Project Management Dashboard",
            "Internal tool for team collaboration and task management");
        projects.add(dashboard);
        
        Tag uiTag = createTag(dashboard, "UI/UX", "#a855f7");
        Tag apiTag = createTag(dashboard, "API", "#14b8a6");
        Tag testingTag = createTag(dashboard, "Testing", "#eab308");
        Tag docTag = createTag(dashboard, "Documentation", "#84cc16");
        
        createTasksWithSmartFeatures(dashboard, new Object[][]{
            {"Create project board UI", "Kanban-style drag and drop interface", true, "-7", TaskPriority.HIGH, TaskStatus.DONE, RecurrencePattern.NONE, null, List.of(uiTag, featureTag), List.of()},
            {"Real-time notifications", "WebSocket implementation for live updates", true, "-3", TaskPriority.MEDIUM, TaskStatus.DONE, RecurrencePattern.NONE, null, List.of(apiTag, featureTag), List.of()},
            {"Team member management", "Invite users, assign roles and permissions", true, "-1", TaskPriority.HIGH, TaskStatus.DONE, RecurrencePattern.NONE, null, List.of(apiTag, featureTag), List.of()},
            {"Time tracking feature", "Log hours spent on tasks", false, "8", TaskPriority.MEDIUM, TaskStatus.IN_PROGRESS, RecurrencePattern.NONE, null, List.of(featureTag), List.of()},
            {"Generate reports", "Export project statistics and timesheets", false, "15", TaskPriority.LOW, TaskStatus.TODO, RecurrencePattern.WEEKLY, LocalDate.now().plusMonths(3), List.of(featureTag, docTag), List.of(3)},
            {"Mobile responsiveness", "Optimize for tablets and phones", false, "22", TaskPriority.MEDIUM, TaskStatus.TODO, RecurrencePattern.NONE, null, List.of(uiTag), List.of(0)}
        });

        // Project 4: AI Chatbot Integration
        Project chatbot = createProject(user, "AI Chatbot Integration",
            "Customer service chatbot powered by machine learning");
        projects.add(chatbot);
        
        Tag aiTag = createTag(chatbot, "AI/ML", "#6366f1");
        Tag researchTag = createTag(chatbot, "Research", "#0ea5e9");
        Tag performanceTag = createTag(chatbot, "Performance", "#f97316");
        
        createTasksWithSmartFeatures(chatbot, new Object[][]{
            {"Research NLP models", "Compare GPT-4, BERT, and custom solutions", true, "-10", TaskPriority.HIGH, TaskStatus.DONE, RecurrencePattern.NONE, null, List.of(aiTag, researchTag), List.of()},
            {"Setup training pipeline", "Collect and preprocess training data", true, "-6", TaskPriority.HIGH, TaskStatus.DONE, RecurrencePattern.NONE, null, List.of(aiTag, backendTag), List.of(0)},
            {"Build chat interface", "React-based chat UI with typing indicators", true, "-2", TaskPriority.MEDIUM, TaskStatus.DONE, RecurrencePattern.NONE, null, List.of(frontendTag, uiTag), List.of()},
            {"Implement context awareness", "Maintain conversation history and context", false, "4", TaskPriority.HIGH, TaskStatus.IN_PROGRESS, RecurrencePattern.NONE, null, List.of(aiTag, featureTag), List.of(1, 2)},
            {"Add multilingual support", "Support English, Spanish, French", false, "11", TaskPriority.MEDIUM, TaskStatus.TODO, RecurrencePattern.NONE, null, List.of(featureTag), List.of(3)},
            {"Performance optimization", "Reduce response time under 1 second", false, "18", TaskPriority.HIGH, TaskStatus.TODO, RecurrencePattern.NONE, null, List.of(performanceTag, urgentTag), List.of(3)}
        });

        return projects;
    }

    private Project createProject(User user, String title, String description) {
        Project project = Project.builder()
            .title(title)
            .description(description)
            .user(user)
            .build();
        project = projectRepository.save(project);
        
        // Add creator as owner (ProjectMember)
        projectMemberService.addCreatorAsOwner(project.getId(), user.getId());
        
        return project;
    }

    private Tag createTag(Project project, String name, String color) {
        Tag tag = Tag.builder()
            .name(name)
            .color(color)
            .project(project)
            .build();
        return tagRepository.save(tag);
    }

    private void createTasksWithSmartFeatures(Project project, Object[][] taskData) {
        LocalDateTime now = LocalDateTime.now();
        List<Task> savedTasks = new ArrayList<>();
        
        // First pass: Create all tasks without dependencies
        for (int i = 0; i < taskData.length; i++) {
            Object[] data = taskData[i];
            String title = (String) data[0];
            String description = (String) data[1];
            boolean completed = (Boolean) data[2];
            int daysOffset = Integer.parseInt((String) data[3]);
            TaskPriority priority = (TaskPriority) data[4];
            TaskStatus status = (TaskStatus) data[5];
            RecurrencePattern recurrencePattern = (RecurrencePattern) data[6];
            LocalDate recurrenceEndDate = (LocalDate) data[7];
            @SuppressWarnings("unchecked")
            List<Tag> tags = (List<Tag>) data[8];
            
            LocalDate dueDate = LocalDate.now().plusDays(daysOffset);
            
            Task task = Task.builder()
                .title(title)
                .description(description)
                .completed(completed)
                .dueDate(dueDate)
                .priority(priority)
                .status(status)
                .recurrencePattern(recurrencePattern)
                .recurrenceEndDate(recurrenceEndDate)
                .project(project)
                .tags(new HashSet<>(tags))
                .dependsOn(new HashSet<>())
                .createdAt(now.plusDays(daysOffset - 1))
                .updatedAt(completed ? now.plusDays(daysOffset) : now)
                .build();
            
            savedTasks.add(taskRepository.save(task));
        }
        
        // Second pass: Add dependencies
        for (int i = 0; i < taskData.length; i++) {
            Object[] data = taskData[i];
            @SuppressWarnings("unchecked")
            List<Integer> dependencyIndices = (List<Integer>) data[9];
            
            if (!dependencyIndices.isEmpty()) {
                Task task = savedTasks.get(i);
                Set<Task> dependencies = new HashSet<>();
                
                for (Integer depIndex : dependencyIndices) {
                    if (depIndex < savedTasks.size()) {
                        dependencies.add(savedTasks.get(depIndex));
                    }
                }
                
                task.setDependsOn(dependencies);
                taskRepository.save(task);
            }
        }
    }

    @Deprecated
    private void createTasks(Project project, String[][] taskData) {
        LocalDateTime now = LocalDateTime.now();
        
        for (String[] data : taskData) {
            String title = data[0];
            String description = data[1];
            boolean completed = Boolean.parseBoolean(data[2]);
            int daysOffset = Integer.parseInt(data[3]);
            
            LocalDate dueDate = LocalDate.now().plusDays(daysOffset);
            
            TaskStatus status;
            if (completed) {
                status = TaskStatus.DONE;
            } else if (daysOffset < 0) {
                status = TaskStatus.IN_PROGRESS;
            } else {
                status = TaskStatus.TODO;
            }
            
            Task task = Task.builder()
                .title(title)
                .description(description)
                .completed(completed)
                .dueDate(dueDate)
                .priority(TaskPriority.MEDIUM)
                .status(status)
                .recurrencePattern(RecurrencePattern.NONE)
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
