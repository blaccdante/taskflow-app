import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { 
  Clock, 
  Calendar, 
  MoreHorizontal, 
  Edit3, 
  Trash2,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { Task } from '../types';
import { 
  formatDate, 
  isOverdue, 
  getDaysUntilDue, 
  getPriorityColor, 
  getStatusColor 
} from '../utils';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (task: Task, status: Task['status']) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onStatusChange }) => {
  const [showMenu, setShowMenu] = useState(false);

  const [{ isDragging }, drag] = useDrag({
    type: 'task',
    item: { id: task.id, status: task.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const priorityColor = getPriorityColor(task.priority);
  const statusColor = getStatusColor(task.status);
  const overdue = task.dueDate ? isOverdue(task.dueDate) : false;
  const daysUntilDue = task.dueDate ? getDaysUntilDue(task.dueDate) : null;

  const handleStatusClick = () => {
    const statusOrder: Task['status'][] = ['todo', 'in-progress', 'completed'];
    const currentIndex = statusOrder.indexOf(task.status);
    const nextIndex = (currentIndex + 1) % statusOrder.length;
    onStatusChange(task, statusOrder[nextIndex]);
  };

  return (
    <div
      ref={drag}
      className={`bg-white rounded-lg shadow-sm border p-4 cursor-move transition-all hover:shadow-md ${
        isDragging ? 'opacity-50 transform rotate-3' : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-2 flex-1">
          <button
            onClick={handleStatusClick}
            className="mt-0.5 text-gray-400 hover:text-primary-600 transition-colors"
          >
            {task.status === 'completed' ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <div className={`h-5 w-5 border-2 rounded-full ${
                task.status === 'in-progress' 
                  ? 'border-blue-600 bg-blue-100' 
                  : 'border-gray-300'
              }`} />
            )}
          </button>
          <div className="flex-1">
            <h3 className={`font-medium text-gray-900 line-clamp-2 ${
              task.status === 'completed' ? 'line-through text-gray-500' : ''
            }`}>
              {task.title}
            </h3>
          </div>
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 top-8 bg-white border rounded-lg shadow-lg py-1 z-10 min-w-32">
              <button
                onClick={() => {
                  onEdit(task);
                  setShowMenu(false);
                }}
                className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit
              </button>
              <button
                onClick={() => {
                  onDelete(task);
                  setShowMenu(false);
                }}
                className="flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          {/* Priority */}
          <span className={`px-2 py-1 border rounded-full font-medium ${priorityColor}`}>
            {task.priority}
          </span>
          
          {/* Status */}
          <span className={`px-2 py-1 border rounded-full font-medium ${statusColor}`}>
            {task.status.replace('-', ' ')}
          </span>
        </div>

        <div className="flex items-center space-x-2 text-gray-500">
          {/* Time estimate */}
          {task.estimatedHours && (
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span>{task.estimatedHours}h</span>
            </div>
          )}
          
          {/* Due date */}
          {task.dueDate && (
            <div className={`flex items-center ${overdue ? 'text-red-600' : ''}`}>
              <Calendar className="h-3 w-3 mr-1" />
              <span>
                {overdue ? (
                  <span className="flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Overdue
                  </span>
                ) : daysUntilDue === 0 ? (
                  'Today'
                ) : daysUntilDue === 1 ? (
                  'Tomorrow'
                ) : daysUntilDue && daysUntilDue > 0 ? (
                  `${daysUntilDue}d`
                ) : (
                  formatDate(task.dueDate)
                )}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
};

export default TaskCard;