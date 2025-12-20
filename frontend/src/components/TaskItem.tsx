import { useState, useEffect } from 'react';
import { assignTask, unassignTask, getProjectMembers } from '../services/api';
import { Task } from '../types';

interface ProjectMember {
  id: number;
  userId: number;
  userEmail: string;
  role: string;
  joinedAt: string;
}

interface TaskItemProps {
  task: Task;
  projectId: number;
  currentUserRole?: string;
  onToggle: (taskId: number, completed: boolean) => void;
  onDelete: (taskId: number) => void;
  onAssignmentChange?: () => void;
  selectionMode?: boolean;
  isSelected?: boolean;
  onSelect?: (taskId: number) => void;
}

const TaskItem = ({ task, projectId, currentUserRole, onToggle, onDelete, onAssignmentChange, selectionMode, isSelected, onSelect }: TaskItemProps) => {
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [isAssigning, setIsAssigning] = useState(false);
  const [showAssignMenu, setShowAssignMenu] = useState(false);

  const canManageTasks = currentUserRole === 'OWNER' || currentUserRole === 'ADMIN';

  useEffect(() => {
    if (canManageTasks) {
      loadMembers();
    }
  }, [projectId, canManageTasks]);

  const loadMembers = async () => {
    try {
      const response = await getProjectMembers(projectId);
      setMembers(response.data);
    } catch (err) {
      console.error('Error loading members:', err);
    }
  };

  const handleAssign = async (userId: number) => {
    setIsAssigning(true);
    try {
      await assignTask(task.id, userId);
      setShowAssignMenu(false);
      onAssignmentChange?.();
    } catch (err) {
      console.error('Error assigning task:', err);
      alert('Failed to assign task');
    } finally {
      setIsAssigning(false);
    }
  };

  const handleUnassign = async () => {
    setIsAssigning(true);
    try {
      await unassignTask(task.id);
      setShowAssignMenu(false);
      onAssignmentChange?.();
    } catch (err) {
      console.error('Error unassigning task:', err);
      alert('Failed to unassign task');
    } finally {
      setIsAssigning(false);
    }
  };

  return (
    <div className="card bg-base-200 border border-base-300 hover:border-primary/50 transition-all duration-300">
      <div className="card-body p-5">
        <div className="flex items-start gap-4">
          {/* Selection Checkbox (shown in selection mode) */}
          {selectionMode && (
            <div className="flex-shrink-0 pt-1">
              <input
                type="checkbox"
                className="checkbox checkbox-primary checkbox-lg"
                checked={isSelected}
                onChange={() => onSelect?.(task.id)}
              />
            </div>
          )}

          {/* Completion Checkbox (shown when not in selection mode) */}
          {!selectionMode && (
            <div className="flex-shrink-0 pt-1">
              <input
                type="checkbox"
                className="checkbox checkbox-primary checkbox-lg"
                checked={task.completed}
                onChange={() => onToggle(task.id, task.completed)}
              />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h3 className={`text-lg font-semibold mb-1 ${task.completed ? 'line-through text-base-content/40' : 'text-base-content'}`}>
              {task.title}
            </h3>
            {task.description && (
              <p className={`text-sm mb-3 ${task.completed ? 'text-base-content/30' : 'text-base-content/60'}`}>
                {task.description}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-3">
              {/* Priority Badge */}
              <div className={`badge badge-sm ${
                task.priority === 'HIGH' ? 'badge-error' : 
                task.priority === 'MEDIUM' ? 'badge-warning' : 
                'badge-ghost'
              }`}>
                {task.priority}
              </div>

              {task.dueDate && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-base-content/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm text-base-content/60">
                    Due: {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              )}

              {/* Tags */}
              {task.tags && task.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {task.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="badge badge-sm"
                      style={{ backgroundColor: tag.color, color: '#fff', borderColor: tag.color }}
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Dependencies Warning */}
              {task.dependsOnIds && task.dependsOnIds.length > 0 && (
                <div className="badge badge-sm badge-info gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {task.dependsOnIds.length} dep.
                </div>
              )}
              
              {/* Assignment Section */}
              {canManageTasks ? (
                <div className="relative">
                  <button
                    className={`btn btn-xs gap-1 ${task.assignedToEmail ? 'btn-outline btn-primary' : 'btn-ghost'}`}
                    onClick={() => setShowAssignMenu(!showAssignMenu)}
                    disabled={isAssigning}
                    title={task.assignedToEmail ? `Assigned to ${task.assignedToEmail}` : 'Assign this task'}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {task.assignedToEmail ? (
                      <span className="max-w-[120px] truncate">{task.assignedToEmail.split('@')[0]}</span>
                    ) : (
                      'Assign'
                    )}
                  </button>
                  
                  {showAssignMenu && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowAssignMenu(false)}></div>
                      <div className="absolute left-0 top-full mt-2 bg-base-100 rounded-lg shadow-lg border border-base-300 p-2 z-20 w-56">
                        <div className="text-xs font-semibold text-base-content/60 px-2 py-1 mb-1">Assign to:</div>
                        <div className="max-h-48 overflow-y-auto">
                          {task.assignedToId && (
                            <>
                              <button
                                className="w-full text-left px-3 py-2 rounded hover:bg-error/10 text-error text-sm flex items-center gap-2"
                                onClick={handleUnassign}
                                disabled={isAssigning}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Unassign
                              </button>
                              <div className="divider my-1"></div>
                            </>
                          )}
                          {members.map((member) => (
                            <button
                              key={member.id}
                              className={`w-full text-left px-3 py-2 rounded hover:bg-base-200 text-sm flex items-center gap-2 ${
                                task.assignedToId === member.userId ? 'bg-primary/10 text-primary' : ''
                              }`}
                              onClick={() => handleAssign(member.userId)}
                              disabled={isAssigning || task.assignedToId === member.userId}
                            >
                              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold">
                                {member.userEmail.charAt(0).toUpperCase()}
                              </div>
                              <span className="truncate">{member.userEmail}</span>
                              {task.assignedToId === member.userId && (
                                <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : task.assignedToEmail ? (
                <div className="flex items-center gap-1.5 badge badge-sm badge-outline gap-1" title={`Assigned to ${task.assignedToEmail}`}>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="max-w-[100px] truncate">{task.assignedToEmail.split('@')[0]}</span>
                </div>
              ) : null}
            </div>
          </div>
          <button 
            className="btn btn-ghost btn-sm text-error hover:bg-error/10 gap-2 flex-shrink-0"
            onClick={() => onDelete(task.id)}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
