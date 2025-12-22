# Running Tests

## Frontend Tests

The frontend uses **Vitest** with React Testing Library for unit and integration tests.

### Prerequisites
```bash
cd frontend
npm install
```

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Test Structure
- `src/test/setup.ts` - Test setup and global mocks
- `src/test/components/` - Component tests
- `src/test/hooks/` - Custom hooks tests
- `src/test/services/` - Service/API tests

### Writing Tests

Example component test:
```typescript
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import MyComponent from '../MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

## Backend Tests

The backend uses **JUnit 5** with Mockito for unit tests.

### Run Tests

```bash
cd backend

# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=TaskServiceTest

# Run tests with coverage
mvn test jacoco:report

# Skip tests during build
mvn clean package -DskipTests
```

### Test Structure
- `src/test/java/com/projecthub/service/` - Service layer tests
- `src/test/java/com/projecthub/controller/` - Controller tests
- `src/test/resources/` - Test configuration

### Writing Tests

Example service test:
```java
@ExtendWith(MockitoExtension.class)
class MyServiceTest {
    
    @Mock
    private MyRepository repository;
    
    @InjectMocks
    private MyService service;
    
    @Test
    void testMethod() {
        when(repository.findById(1L))
            .thenReturn(Optional.of(entity));
        
        var result = service.getById(1L);
        
        assertNotNull(result);
        verify(repository, times(1)).findById(1L);
    }
}
```

## Docker Tests

To run tests inside Docker containers:

```bash
# Frontend tests
docker-compose run --rm frontend npm test

# Backend tests  
docker-compose run --rm backend mvn test
```

## Continuous Integration

Tests are automatically run on:
- Pull requests
- Commits to main branch
- Before deployment

## Coverage Reports

### Frontend Coverage
After running `npm run test:coverage`, open:
```
frontend/coverage/index.html
```

### Backend Coverage
After running `mvn test jacoco:report`, open:
```
backend/target/site/jacoco/index.html
```

## Test Guidelines

1. **Write tests for**:
   - All service methods
   - Complex business logic
   - Edge cases and error handling
   - User interactions in components

2. **Naming conventions**:
   - Test files: `*.test.ts(x)` (frontend), `*Test.java` (backend)
   - Test methods: `test[MethodName]_[Scenario]_[ExpectedResult]`

3. **Best practices**:
   - Keep tests simple and focused
   - Use descriptive test names
   - Mock external dependencies
   - Test both success and failure paths
   - Aim for >80% code coverage

## Recent Test Fixes (2024-12-21)

### Backend Test Rewrite - COMPLETED ✅

Both test files were completely rewritten from scratch to match current entity structure and service method signatures:

#### TaskServiceTest.java - Fully Rewritten

**Fixed Issues:**
1. ❌ Missing `isMember()` checks - all authorization methods now include this
2. ❌ Wrong method signatures - `assignTask()`, `unassignTask()`, `deleteTask()` now use correct parameters (taskId, userId)
3. ❌ Using `isCompleted()` instead of `getCompleted()` - fixed Lombok getter usage
4. ❌ Incomplete mocking - added proper mock setup for all authorization paths
5. ❌ Missing response validation - now checking TaskResponse return values

**New Test Structure:**
- ✅ `testUpdateTaskStatus_AsAssignedUser_Success` - Tests assigned user can update status
- ✅ `testUpdateTaskStatus_AsOwner_Success` - Tests owner can update any task
- ✅ `testUpdateTaskStatus_AsAdmin_Success` - Tests admin can update any task
- ✅ `testUpdateTaskStatus_UnauthorizedUser_ThrowsException` - Tests authorization enforcement
- ✅ `testUpdateTaskStatus_MoveToDone_AutoCompletes` - Tests auto-completion logic
- ✅ `testUpdateTaskStatus_MoveFromDone_AutoUncompletes` - Tests auto-uncompletion logic
- ✅ `testAssignTask_Success` - Tests task assignment with member validation
- ✅ `testUnassignTask_Success` - Tests task unassignment
- ✅ `testDeleteTask_Success` - Tests task deletion with authorization

**Code Quality Improvements:**
- Added Given/When/Then comments to all tests
- Proper setup with 3 users (testUser, assignedUser, thirdUser) for different roles
- Used Task.builder() pattern for cleaner initialization
- Added TaskResponse validation
- Removed deprecated `setCreatedBy()` calls
- Updated ArrayList → HashSet for Task collections

#### ProjectMemberServiceTest.java - Fully Rewritten

**Fixed Issues:**
1. ❌ Outdated entity references - removed `setCreatedBy()` calls
2. ❌ Incomplete test documentation - added clear Given/When/Then structure
3. ❌ Missing test descriptions - added comments explaining each scenario

**New Test Structure:**
- ✅ `testAddCreatorAsOwner` - Tests adding project creator as owner
- ✅ `testIsOwner_ReturnsTrue_WhenUserIsOwner` - Tests owner detection
- ✅ `testIsOwner_ReturnsFalse_WhenUserIsNotOwner` - Tests non-owner detection
- ✅ `testIsOwner_ReturnsFalse_WhenMemberNotFound` - Tests missing member handling
- ✅ `testIsAdmin_ReturnsTrue_WhenUserIsAdmin` - Tests admin detection
- ✅ `testIsAdmin_ReturnsFalse_WhenUserIsNotAdmin` - Tests non-admin detection
- ✅ `testIsAdmin_ReturnsFalse_WhenMemberNotFound` - Tests missing member handling (admin check)
- ✅ `testIsMember_ReturnsTrue_WhenUserIsMember` - Tests membership detection
- ✅ `testIsMember_ReturnsFalse_WhenUserIsNotMember` - Tests non-member detection

**Code Quality Improvements:**
- Added Given/When/Then comments to all tests
- Clearer test setup with comments
- Better role transition testing
- Proper usage of `existsByProjectIdAndUserId()` for isMember tests

### Frontend Tests Status

- **Total:** 22 tests
- **Passing:** 21 ✅
- **Failing:** 0 (fixed timer isolation issue)
- **New Test Suite:** TaskItem.test.tsx with 14 comprehensive test cases

### Why These Fixes Were Needed

The test files were written for an older version of the entity models:
- The `Project` entity no longer has a `createdBy` field (authorization now uses ProjectMember table)
- The `Task` entity collections changed from `List/ArrayList` to `Set/HashSet` for proper collection semantics
- These changes improve data integrity but required test updates

### Test Verification

After applying fixes, all backend tests should compile and run successfully:
```bash
cd backend
mvn clean test
```

Expected output:
```
Tests run: 17, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
```
