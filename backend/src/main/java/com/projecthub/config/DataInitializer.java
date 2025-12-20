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
 * Clean DataInitializer with Smart Features
 * 
 * Creates demo data with:
 * - Task Status (TODO, IN_PROGRESS, DONE) for Kanban board
 * - Task Priority (LOW, MEDIUM, HIGH) with color-coded badges
 * - Custom Tags with colors
 * - Task Dependencies
 * - Recurrence Patterns (DAILY, WEEKLY, MONTHLY, NONE)
 * 
 * Admin user: 4 projects with smart features
 * Regular user: 5 projects with smart features
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

        // Check if data already exists
        if (projectRepository.findByUserId(admin.getId()).size() > 0) {
            log.info("Sample data already exists, skipping initialization");
            return;
        }

        // Create projects for admin
        createAdminProjects(admin);
        log.info("Created projects for admin user");
        
        // Create projects for regular user
        createUserProjects(user);
        log.info("Created projects for regular user");
    }

    // ========== ADMIN PROJECTS ==========
    
    private void createAdminProjects(User admin) {
        LocalDateTime now = LocalDateTime.now();
        
        // Project 1: E-Commerce Platform
        Project ecommerce = createProject(admin, "E-Commerce Platform", 
            "Full-stack online shopping platform with payment integration");
        
        Tag bugTag = createTag(ecommerce, "Bug", "#ef4444");
        Tag featureTag = createTag(ecommerce, "Feature", "#3b82f6");
        Tag urgentTag = createTag(ecommerce, "Urgent", "#f97316");
        Tag backendTag = createTag(ecommerce, "Backend", "#8b5cf6");
        
        createTaskWithSmartFeatures(ecommerce, "Setup database schema", 
            "Design and implement PostgreSQL schema for products, users, orders", 
            TaskStatus.DONE, TaskPriority.HIGH, RecurrencePattern.NONE, 
            List.of(backendTag, urgentTag), -10, true, null, now);
            
        createTaskWithSmartFeatures(ecommerce, "Build product catalog API", 
            "REST endpoints for product listing, search, and filtering", 
            TaskStatus.DONE, TaskPriority.HIGH, RecurrencePattern.NONE, 
            List.of(backendTag, featureTag), -7, true, null, now);
            
        createTaskWithSmartFeatures(ecommerce, "Implement shopping cart", 
            "Session-based cart with add, remove, update quantity", 
            TaskStatus.DONE, TaskPriority.MEDIUM, RecurrencePattern.NONE, 
            List.of(featureTag), -4, true, null, now);
            
        createTaskWithSmartFeatures(ecommerce, "Payment gateway integration", 
            "Stripe API for secure checkout and payment processing", 
            TaskStatus.IN_PROGRESS, TaskPriority.HIGH, RecurrencePattern.NONE, 
            List.of(backendTag, urgentTag), 0, false, null, now);
            
        createTaskWithSmartFeatures(ecommerce, "Order management system", 
            "Admin dashboard for order tracking and fulfillment", 
            TaskStatus.TODO, TaskPriority.MEDIUM, RecurrencePattern.NONE, 
            List.of(featureTag), 5, false, null, now);
            
        createTaskWithSmartFeatures(ecommerce, "Email notifications", 
            "Send order confirmation and shipping updates", 
            TaskStatus.TODO, TaskPriority.LOW, RecurrencePattern.NONE, 
            List.of(featureTag), 10, false, null, now);
            
        createTaskWithSmartFeatures(ecommerce, "Performance optimization", 
            "Implement caching and optimize database queries", 
            TaskStatus.TODO, TaskPriority.HIGH, RecurrencePattern.NONE, 
            List.of(backendTag, urgentTag), 15, false, null, now);

        // Project 2: Mobile Fitness App
        Project fitness = createProject(admin, "Mobile Fitness App", 
            "Cross-platform fitness tracking app with workout plans");
        
        Tag mobileTag = createTag(fitness, "Mobile", "#10b981");
        Tag uiTag = createTag(fitness, "UI/UX", "#a855f7");
        Tag integrationTag = createTag(fitness, "Integration", "#14b8a6");
        
        createTaskWithSmartFeatures(fitness, "Design app UI/UX", 
            "Create wireframes and high-fidelity mockups", 
            TaskStatus.DONE, TaskPriority.HIGH, RecurrencePattern.NONE, 
            List.of(uiTag), -12, true, null, now);
            
        createTaskWithSmartFeatures(fitness, "Setup React Native project", 
            "Initialize project with navigation and state management", 
            TaskStatus.DONE, TaskPriority.HIGH, RecurrencePattern.NONE, 
            List.of(mobileTag), -8, true, null, now);
            
        createTaskWithSmartFeatures(fitness, "Workout tracking feature", 
            "Log exercises, sets, reps, and weight", 
            TaskStatus.DONE, TaskPriority.MEDIUM, RecurrencePattern.NONE, 
            List.of(mobileTag, featureTag), -5, true, null, now);
            
        createTaskWithSmartFeatures(fitness, "Nutrition calculator", 
            "Calorie and macro tracking functionality", 
            TaskStatus.IN_PROGRESS, TaskPriority.MEDIUM, RecurrencePattern.NONE, 
            List.of(featureTag), -1, false, null, now);
            
        createTaskWithSmartFeatures(fitness, "Social features", 
            "Follow friends and share achievements", 
            TaskStatus.TODO, TaskPriority.LOW, RecurrencePattern.NONE, 
            List.of(mobileTag, featureTag), 7, false, null, now);
            
        createTaskWithSmartFeatures(fitness, "Integrate wearables", 
            "Connect with Fitbit and Apple Watch", 
            TaskStatus.TODO, TaskPriority.MEDIUM, RecurrencePattern.NONE, 
            List.of(integrationTag), 14, false, null, now);

        // Project 3: Project Management Dashboard
        Project dashboard = createProject(admin, "Project Management Dashboard", 
            "Internal tool for team collaboration and task management");
        
        Tag apiTag = createTag(dashboard, "API", "#14b8a6");
        Tag testingTag = createTag(dashboard, "Testing", "#eab308");
        Tag docTag = createTag(dashboard, "Documentation", "#84cc16");
        
        createTaskWithSmartFeatures(dashboard, "Create project board UI", 
            "Kanban-style drag and drop interface", 
            TaskStatus.DONE, TaskPriority.HIGH, RecurrencePattern.NONE, 
            List.of(uiTag, featureTag), -9, true, null, now);
            
        createTaskWithSmartFeatures(dashboard, "Real-time notifications", 
            "WebSocket implementation for live updates", 
            TaskStatus.DONE, TaskPriority.MEDIUM, RecurrencePattern.NONE, 
            List.of(apiTag, featureTag), -6, true, null, now);
            
        createTaskWithSmartFeatures(dashboard, "Team member management", 
            "Invite users, assign roles and permissions", 
            TaskStatus.DONE, TaskPriority.HIGH, RecurrencePattern.NONE, 
            List.of(apiTag, featureTag), -2, true, null, now);
            
        createTaskWithSmartFeatures(dashboard, "Time tracking feature", 
            "Log hours spent on tasks", 
            TaskStatus.IN_PROGRESS, TaskPriority.MEDIUM, RecurrencePattern.NONE, 
            List.of(featureTag), 3, false, null, now);
            
        createTaskWithSmartFeatures(dashboard, "Generate reports", 
            "Export project statistics and timesheets", 
            TaskStatus.TODO, TaskPriority.LOW, RecurrencePattern.WEEKLY, 
            List.of(featureTag, docTag), 8, false, LocalDate.now().plusMonths(3), now);
            
        createTaskWithSmartFeatures(dashboard, "Mobile responsiveness", 
            "Optimize for tablets and phones", 
            TaskStatus.TODO, TaskPriority.MEDIUM, RecurrencePattern.NONE, 
            List.of(uiTag), 12, false, null, now);

        // Project 4: AI Chatbot Integration
        Project chatbot = createProject(admin, "AI Chatbot Integration", 
            "Customer service chatbot powered by machine learning");
        
        Tag aiTag = createTag(chatbot, "AI/ML", "#6366f1");
        Tag researchTag = createTag(chatbot, "Research", "#0ea5e9");
        Tag performanceTag = createTag(chatbot, "Performance", "#f97316");
        
        createTaskWithSmartFeatures(chatbot, "Research NLP models", 
            "Compare GPT-4, BERT, and custom solutions", 
            TaskStatus.DONE, TaskPriority.HIGH, RecurrencePattern.NONE, 
            List.of(aiTag, researchTag), -15, true, null, now);
            
        createTaskWithSmartFeatures(chatbot, "Setup training pipeline", 
            "Collect and preprocess training data", 
            TaskStatus.DONE, TaskPriority.HIGH, RecurrencePattern.NONE, 
            List.of(aiTag, backendTag), -10, true, null, now);
            
        createTaskWithSmartFeatures(chatbot, "Build chat interface", 
            "React-based chat UI with typing indicators", 
            TaskStatus.DONE, TaskPriority.MEDIUM, RecurrencePattern.NONE, 
            List.of(uiTag), -5, true, null, now);
            
        createTaskWithSmartFeatures(chatbot, "Implement context awareness", 
            "Maintain conversation history and context", 
            TaskStatus.IN_PROGRESS, TaskPriority.HIGH, RecurrencePattern.NONE, 
            List.of(aiTag, featureTag), 2, false, null, now);
            
        createTaskWithSmartFeatures(chatbot, "Add multilingual support", 
            "Support English, Spanish, French", 
            TaskStatus.TODO, TaskPriority.MEDIUM, RecurrencePattern.NONE, 
            List.of(featureTag), 9, false, null, now);
            
        createTaskWithSmartFeatures(chatbot, "Performance optimization", 
            "Reduce response time under 1 second", 
            TaskStatus.TODO, TaskPriority.HIGH, RecurrencePattern.NONE, 
            List.of(performanceTag, urgentTag), 16, false, null, now);
    }

    // ========== REGULAR USER PROJECTS ==========
    
    private void createUserProjects(User user) {
        LocalDateTime now = LocalDateTime.now();
        
        // Project 1: Personal Website
        Project website = createProject(user, "Personal Portfolio Website", 
            "Modern portfolio website showcasing projects and skills");
        
        Tag designTag = createTag(website, "Design", "#ec4899");
        Tag devTag = createTag(website, "Development", "#3b82f6");
        Tag deployTag = createTag(website, "Deployment", "#10b981");
        
        createTaskWithSmartFeatures(website, "Design homepage mockup", 
            "Create wireframe and visual design", 
            TaskStatus.DONE, TaskPriority.HIGH, RecurrencePattern.NONE, 
            List.of(designTag), -8, true, null, now);
            
        createTaskWithSmartFeatures(website, "Setup React project", 
            "Initialize with TypeScript and Vite", 
            TaskStatus.DONE, TaskPriority.HIGH, RecurrencePattern.NONE, 
            List.of(devTag), -6, true, null, now);
            
        createTaskWithSmartFeatures(website, "Build about section", 
            "Add bio, skills, and experience", 
            TaskStatus.DONE, TaskPriority.MEDIUM, RecurrencePattern.NONE, 
            List.of(devTag), -3, true, null, now);
            
        createTaskWithSmartFeatures(website, "Portfolio gallery", 
            "Display projects with images and descriptions", 
            TaskStatus.IN_PROGRESS, TaskPriority.HIGH, RecurrencePattern.NONE, 
            List.of(devTag), 0, false, null, now);
            
        createTaskWithSmartFeatures(website, "Contact form integration", 
            "Add email functionality", 
            TaskStatus.TODO, TaskPriority.MEDIUM, RecurrencePattern.NONE, 
            List.of(devTag), 5, false, null, now);
            
        createTaskWithSmartFeatures(website, "Deploy to Vercel", 
            "Setup CI/CD and custom domain", 
            TaskStatus.TODO, TaskPriority.LOW, RecurrencePattern.NONE, 
            List.of(deployTag), 10, false, null, now);

        // Project 2: Budget Tracker
        Project budget = createProject(user, "Budget Tracker App", 
            "Personal finance management with expense tracking");
        
        Tag dbTag = createTag(budget, "Database", "#8b5cf6");
        Tag frontendTag = createTag(budget, "Frontend", "#3b82f6");
        Tag chartTag = createTag(budget, "Charts", "#06b6d4");
        
        createTaskWithSmartFeatures(budget, "Setup database schema", 
            "Design tables for transactions and categories", 
            TaskStatus.DONE, TaskPriority.HIGH, RecurrencePattern.NONE, 
            List.of(dbTag), -7, true, null, now);
            
        createTaskWithSmartFeatures(budget, "Create expense entry form", 
            "UI for adding income and expenses", 
            TaskStatus.DONE, TaskPriority.HIGH, RecurrencePattern.NONE, 
            List.of(frontendTag), -4, true, null, now);
            
        createTaskWithSmartFeatures(budget, "Build dashboard", 
            "Overview with charts and summaries", 
            TaskStatus.DONE, TaskPriority.MEDIUM, RecurrencePattern.NONE, 
            List.of(frontendTag, chartTag), -2, true, null, now);
            
        createTaskWithSmartFeatures(budget, "Category management", 
            "Add, edit, delete expense categories", 
            TaskStatus.IN_PROGRESS, TaskPriority.MEDIUM, RecurrencePattern.NONE, 
            List.of(frontendTag), 1, false, null, now);
            
        createTaskWithSmartFeatures(budget, "Export to CSV", 
            "Download transaction history", 
            TaskStatus.TODO, TaskPriority.LOW, RecurrencePattern.NONE, 
            List.of(frontendTag), 6, false, null, now);
            
        createTaskWithSmartFeatures(budget, "Monthly reports", 
            "Generate spending analysis reports", 
            TaskStatus.TODO, TaskPriority.MEDIUM, RecurrencePattern.MONTHLY, 
            List.of(chartTag), 12, false, LocalDate.now().plusMonths(6), now);

        // Project 3: Task Management Tool
        Project taskTool = createProject(user, "Task Management Tool", 
            "Personal productivity app with prioritization");
        
        Tag kanbanTag = createTag(taskTool, "Kanban", "#a855f7");
        Tag notifTag = createTag(taskTool, "Notifications", "#f59e0b");
        Tag themeTag = createTag(taskTool, "Theme", "#6366f1");
        
        createTaskWithSmartFeatures(taskTool, "Design task board UI", 
            "Kanban-style interface", 
            TaskStatus.DONE, TaskPriority.HIGH, RecurrencePattern.NONE, 
            List.of(kanbanTag, designTag), -9, true, null, now);
            
        createTaskWithSmartFeatures(taskTool, "Implement task CRUD", 
            "Create, read, update, delete tasks", 
            TaskStatus.DONE, TaskPriority.HIGH, RecurrencePattern.NONE, 
            List.of(devTag), -5, true, null, now);
            
        createTaskWithSmartFeatures(taskTool, "Add priority levels", 
            "High, medium, low priority tags", 
            TaskStatus.DONE, TaskPriority.MEDIUM, RecurrencePattern.NONE, 
            List.of(devTag), -1, true, null, now);
            
        createTaskWithSmartFeatures(taskTool, "Due date reminders", 
            "Email notifications for upcoming tasks", 
            TaskStatus.IN_PROGRESS, TaskPriority.HIGH, RecurrencePattern.NONE, 
            List.of(notifTag), 2, false, null, now);
            
        createTaskWithSmartFeatures(taskTool, "Dark mode support", 
            "Toggle between light and dark themes", 
            TaskStatus.TODO, TaskPriority.LOW, RecurrencePattern.NONE, 
            List.of(themeTag), 7, false, null, now);
            
        createTaskWithSmartFeatures(taskTool, "Mobile app version", 
            "React Native implementation", 
            TaskStatus.TODO, TaskPriority.MEDIUM, RecurrencePattern.NONE, 
            List.of(devTag), 14, false, null, now);

        // Project 4: Recipe Book
        Project recipes = createProject(user, "Digital Recipe Book", 
            "Collection of recipes with search and filters");
        
        Tag recipeTag = createTag(recipes, "Recipe", "#ec4899");
        Tag searchTag = createTag(recipes, "Search", "#06b6d4");
        Tag photoTag = createTag(recipes, "Photos", "#f59e0b");
        
        createTaskWithSmartFeatures(recipes, "Recipe card design", 
            "Create attractive recipe display", 
            TaskStatus.DONE, TaskPriority.HIGH, RecurrencePattern.NONE, 
            List.of(recipeTag, designTag), -6, true, null, now);
            
        createTaskWithSmartFeatures(recipes, "Add recipe form", 
            "Input ingredients, steps, and photos", 
            TaskStatus.DONE, TaskPriority.HIGH, RecurrencePattern.NONE, 
            List.of(recipeTag, photoTag), -3, true, null, now);
            
        createTaskWithSmartFeatures(recipes, "Search functionality", 
            "Find recipes by name or ingredient", 
            TaskStatus.IN_PROGRESS, TaskPriority.MEDIUM, RecurrencePattern.NONE, 
            List.of(searchTag), 0, false, null, now);
            
        createTaskWithSmartFeatures(recipes, "Recipe categories", 
            "Organize by meal type and cuisine", 
            TaskStatus.TODO, TaskPriority.MEDIUM, RecurrencePattern.NONE, 
            List.of(recipeTag), 4, false, null, now);
            
        createTaskWithSmartFeatures(recipes, "Shopping list", 
            "Generate list from recipe ingredients", 
            TaskStatus.TODO, TaskPriority.LOW, RecurrencePattern.NONE, 
            List.of(recipeTag), 9, false, null, now);

        // Project 5: Weather Dashboard
        Project weather = createProject(user, "Weather Dashboard", 
            "Real-time weather with forecasts");
        
        Tag weatherApiTag = createTag(weather, "API", "#3b82f6");
        Tag weatherUiTag = createTag(weather, "UI", "#a855f7");
        Tag dataTag = createTag(weather, "Data", "#10b981");
        
        createTaskWithSmartFeatures(weather, "Integrate weather API", 
            "Connect to OpenWeatherMap API", 
            TaskStatus.DONE, TaskPriority.HIGH, RecurrencePattern.NONE, 
            List.of(weatherApiTag), -4, true, null, now);
            
        createTaskWithSmartFeatures(weather, "Display current weather", 
            "Show temperature, conditions, humidity", 
            TaskStatus.DONE, TaskPriority.HIGH, RecurrencePattern.NONE, 
            List.of(weatherUiTag), -2, true, null, now);
            
        createTaskWithSmartFeatures(weather, "5-day forecast", 
            "Show upcoming weather predictions", 
            TaskStatus.IN_PROGRESS, TaskPriority.MEDIUM, RecurrencePattern.NONE, 
            List.of(weatherUiTag, dataTag), 1, false, null, now);
            
        createTaskWithSmartFeatures(weather, "Location search", 
            "Find weather for any city", 
            TaskStatus.TODO, TaskPriority.MEDIUM, RecurrencePattern.NONE, 
            List.of(weatherUiTag), 6, false, null, now);
            
        createTaskWithSmartFeatures(weather, "Save favorites", 
            "Store frequently checked locations", 
            TaskStatus.TODO, TaskPriority.LOW, RecurrencePattern.NONE, 
            List.of(dataTag), 11, false, null, now);
    }

    // ========== HELPER METHODS ==========
    
    private Project createProject(User user, String title, String description) {
        Project project = Project.builder()
            .title(title)
            .description(description)
            .user(user)
            .build();
        project = projectRepository.save(project);
        
        // Add creator as owner
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
    
    private void createTaskWithSmartFeatures(
            Project project, 
            String title, 
            String description,
            TaskStatus status,
            TaskPriority priority,
            RecurrencePattern recurrence,
            List<Tag> tags,
            int daysOffset,
            boolean completed,
            LocalDate recurrenceEndDate,
            LocalDateTime baseTime) {
        
        LocalDate dueDate = LocalDate.now().plusDays(daysOffset);
        
        Task task = Task.builder()
            .title(title)
            .description(description)
            .status(status)
            .priority(priority)
            .recurrencePattern(recurrence)
            .recurrenceEndDate(recurrenceEndDate)
            .completed(completed)
            .dueDate(dueDate)
            .project(project)
            .tags(new HashSet<>(tags))
            .createdAt(baseTime.plusDays(daysOffset - 1))
            .updatedAt(completed ? baseTime.plusDays(daysOffset) : baseTime)
            .build();
        
        taskRepository.save(task);
    }
}
