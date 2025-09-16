import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Plus, Filter, Search, BarChart3, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import DashboardLayout from '../layouts/DashboardLayout';
import KanbanBoard from '../components/KanbanBoard';
import TaskForm from '../components/TaskForm';
import { useTasks, useTaskStats, useCreateTask, useUpdateTask, useDeleteTask } from '../hooks/useTasks';
import { useSocket } from '../hooks/useSocket';
import { useNotifications } from '../components/Notifications';
import { Task, TaskStatus, CreateTaskRequest, UpdateTaskRequest } from '../types';

const Dashboard: React.FC = () => {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formDefaultStatus, setFormDefaultStatus] = useState<TaskStatus>('todo');
  const [searchQuery, setSearchQuery] = useState('');

  // Notifications
  const { addNotification } = useNotifications();

  // Socket connection for real-time updates
  const { isConnected, emitTaskCreated, emitTaskUpdated, emitTaskDeleted, emitTaskStatusChanged } = useSocket();

  // Queries and mutations
  const { data: tasksResponse, isLoading: tasksLoading } = useTasks({ search: searchQuery });
  const { data: stats, isLoading: statsLoading } = useTaskStats();
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  const tasks = tasksResponse?.tasks || [];

  const handleAddTask = (status: TaskStatus) => {
    setFormDefaultStatus(status);
    setEditingTask(null);
    setShowTaskForm(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleDeleteTask = async (task: Task) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTaskMutation.mutateAsync(task.id);
        emitTaskDeleted(task.id);
        addNotification({
          type: 'success',
          title: 'Task Deleted',
          message: `"${task.title}" has been deleted successfully.`,
        });
      } catch (error: any) {
        console.error('Failed to delete task:', error);
        addNotification({
          type: 'error',
          title: 'Error',
          message: error.response?.data?.message || 'Failed to delete task. Please try again.',
        });
      }
    }
  };

  const handleTaskSubmit = async (data: CreateTaskRequest) => {
    try {
      if (editingTask) {
        const result = await updateTaskMutation.mutateAsync({
          id: editingTask.id,
          data: data as UpdateTaskRequest,
        });
        emitTaskUpdated(result.task);
        addNotification({
          type: 'success',
          title: 'Task Updated',
          message: `"${data.title}" has been updated successfully.`,
        });
      } else {
        const result = await createTaskMutation.mutateAsync(data);
        emitTaskCreated(result.task);
        addNotification({
          type: 'success',
          title: 'Task Created',
          message: `"${data.title}" has been created successfully.`,
        });
      }
      setShowTaskForm(false);
      setEditingTask(null);
    } catch (error: any) {
      console.error('Failed to save task:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: error.response?.data?.message || 'Failed to save task. Please try again.',
      });
    }
  };

  const handleTaskMove = async (taskId: string, newStatus: TaskStatus) => {
    try {
      const result = await updateTaskMutation.mutateAsync({
        id: taskId,
        data: { status: newStatus },
      });
      emitTaskStatusChanged(taskId, newStatus);
    } catch (error) {
      console.error('Failed to move task:', error);
    }
  };

  const handleStatusChange = async (task: Task, status: TaskStatus) => {
    try {
      const result = await updateTaskMutation.mutateAsync({
        id: task.id,
        data: { status },
      });
      emitTaskStatusChanged(task.id, status);
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  const isFormLoading = createTaskMutation.isPending || updateTaskMutation.isPending;

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Task Dashboard</h1>
            <p className="text-gray-600">Manage your tasks efficiently</p>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Connection Status */}
            <div className="flex items-center space-x-2">
              <div className={`h-2 w-2 rounded-full ${
                isConnected ? 'bg-green-500' : 'bg-red-500'
              }`} />
              <span className="text-xs text-gray-500">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            
            <button
              onClick={() => handleAddTask('todo')}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              New Task
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {!statsLoading && stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{stats.byStatus.completed}</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.byStatus['in-progress']}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Overdue</p>
                  <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
                </div>
                <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 input-field"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button className="btn-secondary flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </button>
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="bg-white rounded-lg shadow-sm border min-h-96">
          {tasksLoading ? (
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="p-6">
              <DndProvider backend={HTML5Backend}>
                <KanbanBoard
                  tasks={tasks}
                  onTaskMove={handleTaskMove}
                  onAddTask={handleAddTask}
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteTask}
                  onStatusChange={handleStatusChange}
                />
              </DndProvider>
            </div>
          )}
        </div>

        {/* Task Form Modal */}
        <TaskForm
          isOpen={showTaskForm}
          onClose={() => {
            setShowTaskForm(false);
            setEditingTask(null);
          }}
          onSubmit={handleTaskSubmit}
          task={editingTask || undefined}
          defaultStatus={formDefaultStatus}
          isLoading={isFormLoading}
        />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;