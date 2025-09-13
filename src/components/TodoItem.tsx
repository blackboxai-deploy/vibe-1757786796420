"use client";

import { useState } from 'react';
import { Todo, DayOfWeek, PRIORITY_COLORS } from '@/lib/types';

interface TodoItemProps {
  todo: Todo;
  day: DayOfWeek;
  onToggle: () => void;
  onUpdate: (updates: Partial<Todo>) => void;
  onDelete: () => void;
}

export default function TodoItem({ todo, onToggle, onUpdate, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editPriority, setEditPriority] = useState(todo.priority);

  const handleSaveEdit = () => {
    if (editText.trim()) {
      onUpdate({
        text: editText.trim(),
        priority: editPriority
      });
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditText(todo.text);
    setEditPriority(todo.priority);
    setIsEditing(false);
  };

  const getPriorityEmoji = (priority: Todo['priority']) => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '🟡';
    }
  };

  const formatCreatedAt = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        ...(date.getFullYear() !== now.getFullYear() && { year: 'numeric' })
      });
    }
  };

  return (
    <div className={`
      group bg-white border rounded-lg p-4 transition-all duration-200
      ${todo.completed 
        ? 'border-green-200 bg-green-50/50' 
        : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
      }
    `}>
      {!isEditing ? (
        // Display Mode
        <div className="flex items-start space-x-3">
          {/* Checkbox */}
          <button
            onClick={onToggle}
            className={`
              flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center
              transition-all duration-200 mt-0.5
              ${todo.completed
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-gray-300 hover:border-blue-500'
              }
            `}
          >
            {todo.completed && (
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            )}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className={`
                  text-sm font-medium leading-relaxed
                  ${todo.completed 
                    ? 'text-gray-500 line-through' 
                    : 'text-gray-900'
                  }
                `}>
                  {todo.text}
                </p>
                
                <div className="flex items-center space-x-2 mt-2">
                  <span 
                    className={`
                      inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border
                      ${PRIORITY_COLORS[todo.priority]}
                    `}
                  >
                    <span className="mr-1">{getPriorityEmoji(todo.priority)}</span>
                    {todo.priority} priority
                  </span>
                  
                  <span className="text-xs text-gray-400">
                    {formatCreatedAt(todo.createdAt)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                  title="Edit task"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                
                <button
                  onClick={onDelete}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  title="Delete task"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Edit Mode
        <div className="space-y-3">
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSaveEdit();
              } else if (e.key === 'Escape') {
                handleCancelEdit();
              }
            }}
          />
          
          <div className="flex items-center justify-between">
            <select
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value as Todo['priority'])}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
            >
              <option value="high">🔴 High Priority</option>
              <option value="medium">🟡 Medium Priority</option>
              <option value="low">🟢 Low Priority</option>
            </select>
            
            <div className="flex space-x-2">
              <button
                onClick={handleCancelEdit}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={!editText.trim()}
                className="px-4 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}