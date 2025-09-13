"use client";

import { useState, useEffect } from 'react';
import { Todo, DayOfWeek, WeekData } from '@/lib/types';

const STORAGE_KEY = 'android-week-planner-todos';

const getDefaultWeekData = (): WeekData => ({
  monday: [],
  tuesday: [],
  wednesday: [],
  thursday: [],
  friday: [],
  saturday: [],
  sunday: []
});

export const useTodos = () => {
  const [weekData, setWeekData] = useState<WeekData>(getDefaultWeekData());
  const [isLoading, setIsLoading] = useState(true);

  // Load todos from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        const convertedData: WeekData = {} as WeekData;
        Object.keys(parsed).forEach(day => {
          convertedData[day as DayOfWeek] = parsed[day].map((todo: any) => ({
            ...todo,
            createdAt: new Date(todo.createdAt)
          }));
        });
        setWeekData(convertedData);
      }
    } catch (error) {
      console.error('Error loading todos from localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save todos to localStorage whenever weekData changes
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(weekData));
      } catch (error) {
        console.error('Error saving todos to localStorage:', error);
      }
    }
  }, [weekData, isLoading]);

  const addTodo = (day: DayOfWeek, text: string, priority: Todo['priority'] = 'medium') => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: text.trim(),
      completed: false,
      createdAt: new Date(),
      priority
    };

    setWeekData(prev => ({
      ...prev,
      [day]: [...prev[day], newTodo]
    }));
  };

  const updateTodo = (day: DayOfWeek, todoId: string, updates: Partial<Todo>) => {
    setWeekData(prev => ({
      ...prev,
      [day]: prev[day].map(todo => 
        todo.id === todoId ? { ...todo, ...updates } : todo
      )
    }));
  };

  const deleteTodo = (day: DayOfWeek, todoId: string) => {
    setWeekData(prev => ({
      ...prev,
      [day]: prev[day].filter(todo => todo.id !== todoId)
    }));
  };

  const toggleTodo = (day: DayOfWeek, todoId: string) => {
    updateTodo(day, todoId, { 
      completed: !weekData[day].find(todo => todo.id === todoId)?.completed 
    });
  };

  const getTodosForDay = (day: DayOfWeek): Todo[] => {
    return weekData[day] || [];
  };

  const getTotalTodosForDay = (day: DayOfWeek): number => {
    return weekData[day]?.length || 0;
  };

  const getCompletedTodosForDay = (day: DayOfWeek): number => {
    return weekData[day]?.filter(todo => todo.completed).length || 0;
  };

  const clearDay = (day: DayOfWeek) => {
    setWeekData(prev => ({
      ...prev,
      [day]: []
    }));
  };

  const clearAllCompleted = (day: DayOfWeek) => {
    setWeekData(prev => ({
      ...prev,
      [day]: prev[day].filter(todo => !todo.completed)
    }));
  };

  return {
    weekData,
    isLoading,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    getTodosForDay,
    getTotalTodosForDay,
    getCompletedTodosForDay,
    clearDay,
    clearAllCompleted
  };
};