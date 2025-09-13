"use client";

import { useState } from 'react';
import { DayOfWeek, Todo } from '@/lib/types';
import { useTodos } from '@/hooks/use-todos';
import TodoItem from './TodoItem';

interface TodoListProps {
  day: DayOfWeek;
  todos: ReturnType<typeof useTodos>;
}

export default function TodoList({ day, todos }: TodoListProps) {
  const [newTodoText, setNewTodoText] = useState('');
  const [newTodoPriority, setNewTodoPriority] = useState<Todo['priority']>('medium');
  const [isAdding, setIsAdding] = useState(false);

  const dayTodos = todos.getTodosForDay(day);
  const sortedTodos = [...dayTodos].sort((a, b) => {
    // Sort by completed status first (incomplete first), then by priority, then by creation date
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    if (a.priority !== b.priority) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoText.trim()) {
      todos.addTodo(day, newTodoText, newTodoPriority);
      setNewTodoText('');
      setNewTodoPriority('medium');
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Add Todo Form */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        {!isAdding ? (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full flex items-center justify-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors py-2 rounded-lg hover:bg-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="font-medium">Add new task</span>
          </button>
        ) : (
          <form onSubmit={handleAddTodo} className="space-y-3">
            <div>
              <input
                type="text"
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                placeholder="What needs to be done?"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                autoFocus
              />
            </div>
            
            <div className="flex items-center justify-between">
              <select
                value={newTodoPriority}
                onChange={(e) => setNewTodoPriority(e.target.value as Todo['priority'])}
                className="px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
              >
                <option value="high">🔴 High Priority</option>
                <option value="medium">🟡 Medium Priority</option>
                <option value="low">🟢 Low Priority</option>
              </select>
              
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setNewTodoText('');
                    setNewTodoPriority('medium');
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newTodoText.trim()}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Add Task
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Todo Items */}
      <div className="space-y-2">
        {sortedTodos.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p>No tasks for this day</p>
          </div>
        ) : (
          sortedTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              day={day}
              onToggle={() => todos.toggleTodo(day, todo.id)}
              onUpdate={(updates) => todos.updateTodo(day, todo.id, updates)}
              onDelete={() => todos.deleteTodo(day, todo.id)}
            />
          ))
        )}
      </div>

      {/* Quick Actions */}
      {sortedTodos.length > 0 && (
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            {todos.getCompletedTodosForDay(day)} of {todos.getTotalTodosForDay(day)} tasks completed
          </div>
          
          <div className="flex space-x-2">
            {todos.getCompletedTodosForDay(day) > 0 && (
              <button
                onClick={() => todos.clearAllCompleted(day)}
                className="text-sm text-red-600 hover:text-red-800 transition-colors"
              >
                Clear Completed
              </button>
            )}
            <button
              onClick={() => {
                if (confirm('Are you sure you want to clear all tasks for this day?')) {
                  todos.clearDay(day);
                }
              }}
              className="text-sm text-red-600 hover:text-red-800 transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
}