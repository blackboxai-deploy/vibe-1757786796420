"use client";

import { useState, useEffect } from 'react';
import { DayOfWeek, DAYS_OF_WEEK } from '@/lib/types';
import { useTodos } from '@/hooks/use-todos';
import TodoList from './TodoList';

interface DayCardProps {
  day: DayOfWeek;
  todos: ReturnType<typeof useTodos>;
}

export default function DayCard({ day, todos }: DayCardProps) {
  const [isFlipping, setIsFlipping] = useState(false);
  const [displayDay, setDisplayDay] = useState(day);

  const dayInfo = DAYS_OF_WEEK.find(d => d.key === displayDay);
  const totalTodos = todos.getTotalTodosForDay(displayDay);
  const completedTodos = todos.getCompletedTodosForDay(displayDay);

  // Handle day change with flip animation
  useEffect(() => {
    if (day !== displayDay) {
      setIsFlipping(true);
      
      const timer = setTimeout(() => {
        setDisplayDay(day);
        setIsFlipping(false);
      }, 150);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [day, displayDay]);

  const progressPercentage = totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0;

  return (
    <div className="relative">
      {/* Main Day Card */}
      <div 
        className={`
          bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden
          transform transition-all duration-300
          ${isFlipping ? 'scale-95 rotate-1' : 'scale-100 rotate-0'}
        `}
      >
        {/* Card Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">{dayInfo?.label}</h2>
              <p className="text-blue-100 text-sm">
                {new Date().toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>
            
            <div className="text-right">
              <div className="text-3xl font-bold">{totalTodos}</div>
              <div className="text-blue-100 text-sm">
                {totalTodos === 1 ? 'task' : 'tasks'}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-blue-100">Progress</span>
              <span className="text-white font-medium">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <div className="w-full bg-blue-400/30 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Card Body - Todo List */}
        <div className="p-6">
          <TodoList day={displayDay} todos={todos} />
        </div>

        {/* Floating Action Hints */}
        {totalTodos === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm">
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No tasks yet!</h3>
              <p className="text-gray-500 text-sm">
                Add your first task to get started with {dayInfo?.label}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{completedTodos}</div>
              <div className="text-sm text-gray-500">Completed</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{totalTodos - completedTodos}</div>
              <div className="text-sm text-gray-500">Remaining</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}