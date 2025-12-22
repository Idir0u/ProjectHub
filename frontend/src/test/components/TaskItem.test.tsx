import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import TaskItem from '../../components/TaskItem';
import { ToastProvider } from '../../context/ToastContext';
import * as api from '../../services/api';

vi.mock('../../services/api');

const mockTask = {
  id: 1,
  title: 'Test Task',
  description: 'Test Description',
  completed: false,
  dueDate: '2025-12-31',
  priority: 'HIGH' as const,
  status: 'TODO' as const,
  recurrencePattern: 'NONE' as const,
  projectId: 1,
  tags: [{ id: 1, name: 'Frontend', color: '#3b82f6', projectId: 1 }],
  dependsOnIds: [2],
  blockedByIds: [],
  assignedToId: undefined,
  assignedToEmail: undefined,
  createdAt: '2025-01-01',
  updatedAt: '2025-01-01',
};

const mockMembers = [
  { id: 1, userId: 1, userEmail: 'admin@projecthub.com', role: 'OWNER', joinedAt: '2025-01-01' },
  { id: 2, userId: 2, userEmail: 'user@projecthub.com', role: 'MEMBER', joinedAt: '2025-01-01' },
];

const renderTaskItem = async (props: Partial<React.ComponentProps<typeof TaskItem>> = {}) => {
  let result: any;
  await act(async () => {
    result = render(
      <ToastProvider>
        <TaskItem
          task={mockTask}
          projectId={1}
          currentUserRole="OWNER"
          onToggle={vi.fn()}
          onDelete={vi.fn()}
          {...props}
        />
      </ToastProvider>
    );
  });
  return result!;
};

describe('TaskItem Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(api.getProjectMembers).mockResolvedValue({ data: mockMembers } as any);
  });

  it('renders task title and description', async () => {
    await renderTaskItem();
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('displays priority badge with correct styling', async () => {
    await renderTaskItem();
    
    const priorityBadge = screen.getByText('HIGH');
    expect(priorityBadge).toBeInTheDocument();
    expect(priorityBadge).toHaveClass('badge-error');
  });

  it('displays due date', async () => {
    await renderTaskItem();
    
    expect(screen.getByText(/Dec 31, 2025/)).toBeInTheDocument();
  });

  it('displays tags with correct colors', async () => {
    await renderTaskItem();
    
    const tag = screen.getByText('Frontend');
    expect(tag).toBeInTheDocument();
    expect(tag).toHaveStyle({ backgroundColor: '#3b82f6' });
  });

  it('displays dependency indicator', async () => {
    await renderTaskItem();
    
    expect(screen.getByText('1 dep.')).toBeInTheDocument();
  });

  it('shows assign button for OWNER/ADMIN', async () => {
    await renderTaskItem();
    
    await waitFor(() => {
      expect(screen.getByText('Assign')).toBeInTheDocument();
    });
  });

  it('does not show assign button for regular members', async () => {
    await renderTaskItem({ currentUserRole: 'MEMBER' });
    
    expect(screen.queryByText('Assign')).not.toBeInTheDocument();
  });

  it('calls onToggle when checkbox is clicked', async () => {
    const mockToggle = vi.fn();
    await renderTaskItem({ onToggle: mockToggle });
    
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(mockToggle).toHaveBeenCalledWith(1, false);
  });

  it('calls onDelete when delete button is clicked', async () => {
    const mockDelete = vi.fn();
    await renderTaskItem({ onDelete: mockDelete });
    
    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);
    
    expect(mockDelete).toHaveBeenCalledWith(1);
  });

  it('shows assigned user when task is assigned', async () => {
    const assignedTask = { ...mockTask, assignedToEmail: 'user@projecthub.com', assignedToId: 2 };
    await renderTaskItem({ task: assignedTask });
    
    expect(screen.getByText('user')).toBeInTheDocument();
  });

  it('opens assignment menu when assign button is clicked', async () => {
    await renderTaskItem();
    
    await waitFor(() => {
      const assignButton = screen.getByText('Assign');
      fireEvent.click(assignButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Assign to:')).toBeInTheDocument();
      expect(screen.getByText('admin@projecthub.com')).toBeInTheDocument();
      expect(screen.getByText('user@projecthub.com')).toBeInTheDocument();
    });
  });

  it('displays correctly in selection mode', async () => {
    await renderTaskItem({ selectionMode: true, isSelected: true });
    
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });
});
