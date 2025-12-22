import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BulkActionsToolbar from '../../components/BulkActionsToolbar';
import * as api from '../../services/api';

vi.mock('../../services/api');

describe('BulkActionsToolbar Component', () => {
  const mockOnClearSelection = vi.fn();
  const mockOnSuccess = vi.fn();
  const mockSelectedTaskIds = new Set([1, 2, 3]);

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window.confirm
    vi.stubGlobal('confirm', vi.fn(() => true));
  });

  const renderToolbar = (selectedIds = mockSelectedTaskIds) => {
    return render(
      <BulkActionsToolbar
        selectedTaskIds={selectedIds}
        onClearSelection={mockOnClearSelection}
        onSuccess={mockOnSuccess}
      />
    );
  };

  it('renders with selected task count', () => {
    renderToolbar();
    
    expect(screen.getByText(/3 tasks selected/)).toBeInTheDocument();
  });

  it('displays all action buttons', () => {
    renderToolbar();
    
    expect(screen.getByText('Complete')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
    expect(screen.getByTitle('Clear selection')).toBeInTheDocument();
  });

  it('calls onClearSelection when clear button is clicked', () => {
    renderToolbar();
    
    const clearButton = screen.getByTitle('Clear selection');
    fireEvent.click(clearButton);
    
    expect(mockOnClearSelection).toHaveBeenCalledTimes(1);
  });

  it('completes tasks successfully', async () => {
    vi.mocked(api.bulkCompleteTasks).mockResolvedValue({ data: {} } as any);
    renderToolbar();
    
    const completeButton = screen.getByText('Complete');
    fireEvent.click(completeButton);
    
    await waitFor(() => {
      expect(api.bulkCompleteTasks).toHaveBeenCalledWith([1, 2, 3]);
      expect(mockOnSuccess).toHaveBeenCalled();
      expect(mockOnClearSelection).toHaveBeenCalled();
    });
  });

  it('shows loading state during bulk complete', async () => {
    vi.mocked(api.bulkCompleteTasks).mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 100))
    );
    renderToolbar();
    
    const completeButton = screen.getByText('Complete');
    fireEvent.click(completeButton);
    
    expect(completeButton).toBeDisabled();
  });

  it('deletes tasks after confirmation', async () => {
    vi.mocked(api.bulkDeleteTasks).mockResolvedValue({ data: {} } as any);
    renderToolbar();
    
    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);
    
    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalledWith(
        'Are you sure you want to delete 3 tasks? This action cannot be undone.'
      );
      expect(api.bulkDeleteTasks).toHaveBeenCalledWith([1, 2, 3]);
      expect(mockOnSuccess).toHaveBeenCalled();
      expect(mockOnClearSelection).toHaveBeenCalled();
    });
  });

  it('does not delete if confirmation is cancelled', async () => {
    vi.mocked(window.confirm).mockReturnValue(false);
    renderToolbar();
    
    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);
    
    await waitFor(() => {
      expect(api.bulkDeleteTasks).not.toHaveBeenCalled();
    });
  });

  it('displays error message on bulk complete failure', async () => {
    const errorMessage = 'Failed to complete tasks';
    vi.mocked(api.bulkCompleteTasks).mockRejectedValue({
      response: { data: { message: errorMessage } },
    });
    renderToolbar();
    
    const completeButton = screen.getByText('Complete');
    fireEvent.click(completeButton);
    
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('displays error message on bulk delete failure', async () => {
    const errorMessage = 'Failed to delete tasks';
    vi.mocked(api.bulkDeleteTasks).mockRejectedValue({
      response: { data: { message: errorMessage } },
    });
    renderToolbar();
    
    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);
    
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('does not render when selection is empty', () => {
    const emptySet = new Set<number>();
    const { container } = renderToolbar(emptySet);
    
    // Component returns null, so container should be empty
    expect(container.firstChild).toBeNull();
  });

  it('uses singular form for single task', () => {
    const singleTask = new Set([1]);
    renderToolbar(singleTask);
    
    expect(screen.getByText(/1 task selected/)).toBeInTheDocument();
    
    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);
    
    expect(window.confirm).toHaveBeenCalledWith(
      'Are you sure you want to delete 1 task? This action cannot be undone.'
    );
  });
});
