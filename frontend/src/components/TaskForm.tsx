import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Plus, Minus } from 'lucide-react';
import { Task, CreateTaskRequest, TaskStatus, TaskPriority } from '../types';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().optional(),
  status: z.enum(['todo', 'in-progress', 'completed']).default('todo'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  dueDate: z.string().optional(),
  tags: z.array(z.string()).default([]),
  estimatedHours: z.number().min(0.1).max(1000).optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTaskRequest) => void;
  task?: Task;
  defaultStatus?: TaskStatus;
  isLoading?: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  task,
  defaultStatus = 'todo',
  isLoading = false,
}) => {
  const isEdit = !!task;
  
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isValid }
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      status: defaultStatus,
      priority: 'medium',
      dueDate: '',
      tags: [],
      estimatedHours: undefined,
    },
  });

  const tags = watch('tags') || [];

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        tags: task.tags || [],
        estimatedHours: task.estimatedHours,
      });
    } else {
      reset({
        title: '',
        description: '',
        status: defaultStatus,
        priority: 'medium',
        dueDate: '',
        tags: [],
        estimatedHours: undefined,
      });
    }
  }, [task, defaultStatus, reset]);

  const handleFormSubmit = (data: TaskFormData) => {
    const submitData: CreateTaskRequest = {
      title: data.title,
      description: data.description || undefined,
      status: data.status,
      priority: data.priority,
      dueDate: data.dueDate || undefined,
      tags: data.tags,
      estimatedHours: data.estimatedHours,
    };
    
    onSubmit(submitData);
  };

  const addTag = (tagValue: string) => {
    if (tagValue.trim() && !tags.includes(tagValue.trim())) {
      setValue('tags', [...tags, tagValue.trim()]);
    }
  };

  const removeTag = (index: number) => {
    setValue('tags', tags.filter((_, i) => i !== index));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const input = e.target as HTMLInputElement;
      addTag(input.value);
      input.value = '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEdit ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              {...register('title')}
              type="text"
              id="title"
              className="input-field"
              placeholder="Enter task title..."
              disabled={isLoading}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              {...register('description')}
              id="description"
              rows={3}
              className="input-field"
              placeholder="Enter task description..."
              disabled={isLoading}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                {...register('status')}
                id="status"
                className="input-field"
                disabled={isLoading}
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                {...register('priority')}
                id="priority"
                className="input-field"
                disabled={isLoading}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Due Date */}
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                {...register('dueDate')}
                type="date"
                id="dueDate"
                className="input-field"
                disabled={isLoading}
              />
            </div>

            {/* Estimated Hours */}
            <div>
              <label htmlFor="estimatedHours" className="block text-sm font-medium text-gray-700 mb-1">
                Estimated Hours
              </label>
              <input
                {...register('estimatedHours', { 
                  valueAsNumber: true,
                  setValueAs: (v) => v === '' ? undefined : parseFloat(v)
                })}
                type="number"
                step="0.5"
                min="0.1"
                max="1000"
                id="estimatedHours"
                className="input-field"
                placeholder="e.g., 2.5"
                disabled={isLoading}
              />
              {errors.estimatedHours && (
                <p className="mt-1 text-sm text-red-600">{errors.estimatedHours.message}</p>
              )}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <div className="space-y-2">
              {/* Add tag input */}
              <input
                type="text"
                className="input-field"
                placeholder="Type a tag and press Enter..."
                onKeyPress={handleTagKeyPress}
                disabled={isLoading}
              />
              
              {/* Tags display */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 bg-primary-100 text-primary-800 text-sm rounded-full"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="ml-1 text-primary-600 hover:text-primary-800"
                        disabled={isLoading}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isValid || isLoading}
              className="btn-primary"
            >
              {isLoading ? 'Saving...' : isEdit ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;