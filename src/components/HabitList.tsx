import React from 'react';
import { CheckCircle, Edit, Trash2, Calendar, Clock, Tag } from 'lucide-react';
import { Habit } from '../types';

interface HabitListProps {
  habits: Habit[];
  onToggleCompletion: (id: string) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (id: string) => void;
}

const HabitList: React.FC<HabitListProps> = ({ 
  habits, 
  onToggleCompletion, 
  onEdit, 
  onDelete 
}) => {
  const today = new Date().toISOString().split('T')[0];
  
  const isCompletedToday = (habit: Habit) => {
    return habit.progress.some(p => p.date === today && p.completed);
  };

  if (habits.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">You haven't created any habits yet.</p>
        <p className="text-gray-500">Click "Add Habit" to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {habits.map(habit => (
        <div 
          key={habit.id} 
          className={`bg-white rounded-lg shadow-sm p-4 border-l-4 border-${habit.color || 'indigo'}-500`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center">
                <button
                  onClick={() => onToggleCompletion(habit.id)}
                  className={`mr-3 flex-shrink-0 ${
                    isCompletedToday(habit)
                      ? 'text-green-500 hover:text-green-600'
                      : 'text-gray-300 hover:text-gray-400'
                  }`}
                >
                  <CheckCircle className="h-6 w-6" />
                </button>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{habit.name}</h3>
                  {habit.description && (
                    <p className="mt-1 text-sm text-gray-500">{habit.description}</p>
                  )}
                </div>
              </div>
              
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span className="capitalize">{habit.frequency}</span>
                </div>
                
                {habit.reminderTime && (
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{habit.reminderTime}</span>
                  </div>
                )}
                
                {habit.category && (
                  <div className="flex items-center">
                    <Tag className="h-4 w-4 mr-1" />
                    <span>{habit.category}</span>
                  </div>
                )}
                
                <div className="flex items-center">
                  <span className="font-medium text-indigo-600">{habit.streakCount} day streak</span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2 ml-4">
              <button
                onClick={() => onEdit(habit)}
                className="text-gray-400 hover:text-gray-500"
              >
                <Edit className="h-5 w-5" />
              </button>
              <button
                onClick={() => onDelete(habit.id)}
                className="text-gray-400 hover:text-red-500"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HabitList;