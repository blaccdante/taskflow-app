import React from 'react';
import { useDrop } from 'react-dnd';
import { Plus } from 'lucide-react';
import { Task, TaskStatus } from '../types';
import TaskCard from './TaskCard';

interface KanbanColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  count: number;
  onDrop: (taskId: string, newStatus: TaskStatus) => void;
  onAddTask: (status: TaskStatus) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  onStatusChange: (task: Task, status: TaskStatus) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  title,
  status,
  tasks,
  count,
  onDrop,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onStatusChange,
}) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'task',
    drop: (item: { id: string; status: TaskStatus }) => {
      if (item.status !== status) {
        onDrop(item.id, status);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const getColumnColor = (status: TaskStatus) => {
    switch (status) {
      case 'todo':
        return 'border-gray-200 bg-gray-50';
      case 'in-progress':
        return 'border-blue-200 bg-blue-50';
      case 'completed':
        return 'border-green-200 bg-green-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getHeaderColor = (status: TaskStatus) => {
    switch (status) {
      case 'todo':
        return 'text-gray-700';
      case 'in-progress':
        return 'text-blue-700';
      case 'completed':
        return 'text-green-700';
      default:
        return 'text-gray-700';
    }
  };

  return (
    <div
      ref={drop}
      className={`flex-1 min-w-80 bg-gray-50 rounded-lg border-2 transition-colors ${
        isOver ? 'border-primary-400 bg-primary-50' : getColumnColor(status)
      }`}
    >
      {/* Column Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <h3 className={`font-semibold ${getHeaderColor(status)}`}>
            {title}
          </h3>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            status === 'todo' ? 'bg-gray-200 text-gray-700' :
            status === 'in-progress' ? 'bg-blue-200 text-blue-700' :
            'bg-green-200 text-green-700'
          }`}>
            {count}
          </span>
        </div>
        
        <button
          onClick={() => onAddTask(status)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-600 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-300 hover:text-primary-600 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Task
        </button>
      </div>

      {/* Tasks */}
      <div className="p-4 space-y-3 min-h-96 max-h-[calc(100vh-300px)] overflow-y-auto">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
            onStatusChange={onStatusChange}
          />
        ))}
        
        {tasks.length === 0 && !isOver && (
          <div className="text-center py-8 text-gray-500">
            <p>No tasks yet</p>
            <p className="text-xs mt-1">Drag tasks here or click "Add Task" above</p>
          </div>
        )}
        
        {isOver && (
          <div className="border-2 border-dashed border-primary-400 bg-primary-50 rounded-lg p-8 text-center">
            <p className="text-primary-600 font-medium">Drop task here</p>
          </div>
        )}
      </div>
    </div>
  );
};

interface KanbanBoardProps {
  tasks: Task[];
  onTaskMove: (taskId: string, newStatus: TaskStatus) => void;
  onAddTask: (status: TaskStatus) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  onStatusChange: (task: Task, status: TaskStatus) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  onTaskMove,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onStatusChange,
}) => {
  const columns: { title: string; status: TaskStatus }[] = [
    { title: 'To Do', status: 'todo' },
    { title: 'In Progress', status: 'in-progress' },
    { title: 'Completed', status: 'completed' },
  ];

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status);
  };

  return (
    <div className="flex gap-6 h-full overflow-x-auto pb-4">
      {columns.map((column) => {
        const columnTasks = getTasksByStatus(column.status);
        return (
          <KanbanColumn
            key={column.status}
            title={column.title}
            status={column.status}
            tasks={columnTasks}
            count={columnTasks.length}
            onDrop={onTaskMove}
            onAddTask={onAddTask}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
            onStatusChange={onStatusChange}
          />
        );
      })}
    </div>
  );
};

export default KanbanBoard;