import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { updateTaskStatus } from '../services/api';

interface Task {
  id: number;
  title: string;
  description?: string;
  dueDate?: string;
  completed: boolean;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  assignedToEmail?: string;
}

interface KanbanBoardProps {
  tasks: Task[];
  onTaskUpdate: () => void;
  onTaskClick?: (taskId: number) => void;
}

interface Column {
  id: 'TODO' | 'IN_PROGRESS' | 'DONE';
  title: string;
  color: string;
}

const columns: Column[] = [
  { id: 'TODO', title: 'To Do', color: 'bg-base-300' },
  { id: 'IN_PROGRESS', title: 'In Progress', color: 'bg-info/10' },
  { id: 'DONE', title: 'Done', color: 'bg-success/10' },
];

const KanbanBoard = ({ tasks, onTaskUpdate, onTaskClick }: KanbanBoardProps) => {
  const handleDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // Dropped outside a column
    if (!destination) return;

    // Dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const taskId = parseInt(draggableId);
    const newStatus = destination.droppableId as 'TODO' | 'IN_PROGRESS' | 'DONE';

    try {
      await updateTaskStatus(taskId, newStatus);
      onTaskUpdate();
    } catch (error) {
      console.error('Error updating task status:', error);
      alert('Failed to update task status');
    }
  };

  const getTasksByStatus = (status: 'TODO' | 'IN_PROGRESS' | 'DONE') => {
    return tasks.filter((task) => task.status === status);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map((column) => {
          const columnTasks = getTasksByStatus(column.id);
          
          return (
            <div key={column.id} className="flex flex-col h-full">
              {/* Column Header */}
              <div className="card bg-base-200 border border-base-300 mb-3">
                <div className="card-body p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg">{column.title}</h3>
                    <span className="badge badge-lg">{columnTasks.length}</span>
                  </div>
                </div>
              </div>

              {/* Droppable Column */}
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 p-3 rounded-lg transition-colors ${
                      snapshot.isDraggingOver ? 'bg-primary/10 border-2 border-primary border-dashed' : column.color
                    } min-h-[400px]`}
                  >
                    <div className="space-y-3">
                      {columnTasks.map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id.toString()}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`card bg-base-100 border border-base-300 shadow-sm hover:shadow-md transition-all cursor-move ${
                                snapshot.isDragging ? 'shadow-xl rotate-2 scale-105' : ''
                              }`}
                              onClick={() => onTaskClick?.(task.id)}
                            >
                              <div className="card-body p-4">
                                {/* Task Title */}
                                <h4 className={`font-semibold mb-2 ${task.completed ? 'line-through text-base-content/40' : ''}`}>
                                  {task.title}
                                </h4>

                                {/* Task Description */}
                                {task.description && (
                                  <p className="text-sm text-base-content/60 mb-3 line-clamp-2">
                                    {task.description}
                                  </p>
                                )}

                                {/* Task Metadata */}
                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                  {task.dueDate && (
                                    <div className="flex items-center gap-1 text-base-content/60">
                                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                      </svg>
                                      <span>{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                    </div>
                                  )}

                                  {task.assignedToEmail && (
                                    <div className="flex items-center gap-1 text-primary">
                                      <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold">
                                        {task.assignedToEmail.charAt(0).toUpperCase()}
                                      </div>
                                      <span className="max-w-[100px] truncate">{task.assignedToEmail}</span>
                                    </div>
                                  )}

                                  {task.completed && (
                                    <div className="badge badge-success badge-sm gap-1">
                                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                      </svg>
                                      Completed
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>

                    {/* Empty State */}
                    {columnTasks.length === 0 && !snapshot.isDraggingOver && (
                      <div className="flex flex-col items-center justify-center py-12 text-base-content/40">
                        <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p className="text-sm">No tasks</p>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
