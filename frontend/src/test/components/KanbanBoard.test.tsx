import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import KanbanBoard from '../../components/KanbanBoard';
import { ToastProvider } from '../../context/ToastContext';

vi.mock('../../services/api');

const mockTasks = [
  {
    id: 1,
    title: 'Task 1',
    description: 'Description 1',
    completed: false,
    status: 'TODO' as const,
    priority: 'HIGH' as const,
    recurrencePattern: 'NONE' as const,
    projectId: 1,
    tags: [],
    dependsOnIds: [],
    blockedByIds: [],
    assignedToId: undefined,
    assignedToEmail: undefined,
    createdAt: '2025-01-01',
    updatedAt: '2025-01-01',
  },
  {
    id: 2,
    title: 'Task 2',
    description: 'Description 2',
    completed: false,
    status: 'IN_PROGRESS' as const,
    priority: 'MEDIUM' as const,
    recurrencePattern: 'NONE' as const,
    projectId: 1,
    tags: [],
    dependsOnIds: [],
    blockedByIds: [],
    assignedToId: undefined,
    assignedToEmail: undefined,
    createdAt: '2025-01-01',
    updatedAt: '2025-01-01',
  },
  {
    id: 3,
    title: 'Task 3',
    description: 'Description 3',
    completed: true,
    status: 'DONE' as const,
    priority: 'LOW' as const,
    recurrencePattern: 'NONE' as const,
    projectId: 1,
    tags: [],
    dependsOnIds: [],
    blockedByIds: [],
    assignedToId: undefined,
    assignedToEmail: undefined,
    createdAt: '2025-01-01',
    updatedAt: '2025-01-01',
  },
];

describe('KanbanBoard Component', () => {
  const mockOnTaskUpdate = vi.fn();
  const mockOnTaskClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderKanbanBoard = (tasks = mockTasks) => {
    return render(
      <ToastProvider>
        <KanbanBoard
          tasks={tasks}
          onTaskUpdate={mockOnTaskUpdate}
          onTaskClick={mockOnTaskClick}
        />
      </ToastProvider>
    );
  };

  it('renders all three columns', () => {
    renderKanbanBoard();
    
    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  it('displays correct task count in each column', () => {
    renderKanbanBoard();
    
    // Check badges showing task counts
    const badges = screen.getAllByText('1');
    expect(badges).toHaveLength(3); // One task in each column
  });

  it('renders tasks in correct columns', () => {
    renderKanbanBoard();
    
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
    expect(screen.getByText('Task 3')).toBeInTheDocument();
  });

  it('displays empty state when no tasks', () => {
    renderKanbanBoard([]);
    
    const badges = screen.getAllByText('0');
    expect(badges).toHaveLength(3); // All columns should show 0
  });

  it('calls onTaskClick when task is clicked', async () => {
    renderKanbanBoard();
    
    const task1 = screen.getByText('Task 1');
    task1.click();
    
    await waitFor(() => {
      expect(mockOnTaskClick).toHaveBeenCalledWith(1);
    });
  });

  it('shows task descriptions', () => {
    renderKanbanBoard();
    
    expect(screen.getByText('Description 1')).toBeInTheDocument();
    expect(screen.getByText('Description 2')).toBeInTheDocument();
    expect(screen.getByText('Description 3')).toBeInTheDocument();
  });

  it('displays priority badges correctly', () => {
    renderKanbanBoard();
    
    expect(screen.getByText('HIGH')).toBeInTheDocument();
    expect(screen.getByText('MEDIUM')).toBeInTheDocument();
    expect(screen.getByText('LOW')).toBeInTheDocument();
  });

  it('handles multiple tasks in same column', () => {
    const tasksInTodo = [
      { ...mockTasks[0], id: 1, title: 'Task 1' },
      { ...mockTasks[0], id: 2, title: 'Task 2' },
      { ...mockTasks[0], id: 3, title: 'Task 3' },
    ];
    
    renderKanbanBoard(tasksInTodo);
    
    // Should show count of 3 in TODO column
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
    expect(screen.getByText('Task 3')).toBeInTheDocument();
  });
});
