"use client";

import { useState } from 'react';
import { DayOfWeek, DAYS_OF_WEEK } from '@/lib/types';
import { useTodos } from '@/hooks/use-todos';
import DayCard from './DayCard';

export default function WeekPlanner() {
  const [activeDay, setActiveDay] = useState<DayOfWeek>('monday');
  const todos = useTodos();

  if (todos.isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading your week...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Week Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-lg p-2 border border-gray-100">
        <div className="flex overflow-x-auto scrollbar-hide space-x-2">
          {DAYS_OF_WEEK.map((day) => {
            const totalTodos = todos.getTotalTodosForDay(day.key);
            const completedTodos = todos.getCompletedTodosForDay(day.key);
            const isActive = activeDay === day.key;
            const isToday = day.key === getCurrentDay();

            return (
              <button
                key={day.key}
                onClick={() => setActiveDay(day.key)}
                className={`
                  relative flex-shrink-0 px-4 py-3 rounded-lg transition-all duration-300 
                  min-w-[120px] text-center group
                  ${isActive 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg scale-105' 
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <div className="space-y-1">
                  <div className="font-medium text-sm">
                    {day.short}
                    {isToday && (
                      <span className="ml-1 w-2 h-2 bg-green-400 rounded-full inline-block"></span>
                    )}
                  </div>
                  
                  {totalTodos > 0 && (
                    <div className={`
                      text-xs space-x-1
                      ${isActive ? 'text-blue-100' : 'text-gray-500'}
                    `}>
                      <span>{completedTodos}/{totalTodos}</span>
                      <span className={`
                        inline-block w-2 h-2 rounded-full
                        ${completedTodos === totalTodos ? 'bg-green-400' : 'bg-orange-400'}
                      `}></span>
                    </div>
                  )}
                </div>

                {/* Active day indicator */}
                {isActive && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Day Card */}
      <div className="relative">
        <DayCard 
          day={activeDay}
          todos={todos}
        />
      </div>

      {/* Week Overview Cards - Hidden on Mobile */}
      <div className="hidden lg:block">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Week Overview</h3>
        <div className="grid grid-cols-7 gap-4">
          {DAYS_OF_WEEK.map((day) => (
            <div
              key={`overview-${day.key}`}
              className={`
                bg-white rounded-lg p-3 border-2 transition-all duration-200
                cursor-pointer hover:shadow-lg
                ${activeDay === day.key 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
              onClick={() => setActiveDay(day.key)}
            >
              <div className="text-center">
                <div className="font-medium text-sm text-gray-900 mb-1">{day.short}</div>
                <div className="text-xs text-gray-500">
                  {todos.getTotalTodosForDay(day.key)} tasks
                </div>
                <div className="mt-2">
                  <div className={`
                    w-full h-1 rounded-full overflow-hidden
                    ${todos.getTotalTodosForDay(day.key) > 0 ? 'bg-gray-200' : 'bg-gray-100'}
                  `}>
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300"
                      style={{
                        width: todos.getTotalTodosForDay(day.key) > 0 
                          ? `${(todos.getCompletedTodosForDay(day.key) / todos.getTotalTodosForDay(day.key)) * 100}%`
                          : '0%'
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function getCurrentDay(): DayOfWeek {
  const dayIndex = new Date().getDay();
  const daysMap = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return daysMap[dayIndex] as DayOfWeek;
}