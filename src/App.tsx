import React, { useState, useEffect } from 'react';
import { 
  Target, 
  Bell, 
  MessageSquare, 
  Brain, 
  Calendar, 
  CheckCircle, 
  PlusCircle, 
  X, 
  Edit, 
  Trash2, 
  ChevronRight,
  BarChart,
  Sparkles
} from 'lucide-react';
import HabitForm from './components/HabitForm';
import HabitList from './components/HabitList';
import Dashboard from './components/Dashboard';
import AIInsights from './components/AIInsights';
import { Habit, Reminder } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'habits' | 'insights'>('dashboard');
  const [habits, setHabits] = useState<Habit[]>(() => {
    const savedHabits = localStorage.getItem('habits');
    return savedHabits ? JSON.parse(savedHabits) : [];
  });
  const [showHabitForm, setShowHabitForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  const addHabit = (habit: Habit) => {
    setHabits([...habits, { ...habit, id: Date.now().toString(), progress: [], streakCount: 0 }]);
    setShowHabitForm(false);
  };

  const updateHabit = (updatedHabit: Habit) => {
    setHabits(habits.map(habit => 
      habit.id === updatedHabit.id ? updatedHabit : habit
    ));
    setEditingHabit(null);
    setShowHabitForm(false);
  };

  const deleteHabit = (id: string) => {
    setHabits(habits.filter(habit => habit.id !== id));
  };

  const toggleHabitCompletion = (habitId: string) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const today = new Date().toISOString().split('T')[0];
        const alreadyCompleted = habit.progress.some(p => p.date === today);
        
        let newProgress;
        let newStreakCount = habit.streakCount;
        
        if (alreadyCompleted) {
          newProgress = habit.progress.filter(p => p.date !== today);
          newStreakCount = Math.max(0, newStreakCount - 1);
        } else {
          newProgress = [...habit.progress, { date: today, completed: true }];
          
          // Check if yesterday was completed to maintain streak
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];
          
          const yesterdayCompleted = habit.progress.some(p => p.date === yesterdayStr);
          if (yesterdayCompleted || newStreakCount === 0) {
            newStreakCount += 1;
          }
        }
        
        return { ...habit, progress: newProgress, streakCount: newStreakCount };
      }
      return habit;
    }));
  };

  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
    setShowHabitForm(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-2">
              <Target className="h-8 w-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-900">HabitCraft</h1>
            </div>
            <div className="flex space-x-4">
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-md ${activeTab === 'dashboard' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:text-gray-900'}`}
              >
                Dashboard
              </button>
              <button 
                onClick={() => setActiveTab('habits')}
                className={`px-4 py-2 rounded-md ${activeTab === 'habits' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:text-gray-900'}`}
              >
                My Habits
              </button>
              <button 
                onClick={() => setActiveTab('insights')}
                className={`px-4 py-2 rounded-md ${activeTab === 'insights' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:text-gray-900'}`}
              >
                AI Insights
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <Dashboard 
            habits={habits} 
            toggleHabitCompletion={toggleHabitCompletion} 
          />
        )}

        {activeTab === 'habits' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">My Habits</h2>
              <button
                onClick={() => {
                  setEditingHabit(null);
                  setShowHabitForm(true);
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                <PlusCircle className="h-5 w-5" />
                <span>Add Habit</span>
              </button>
            </div>

            <HabitList 
              habits={habits} 
              onToggleCompletion={toggleHabitCompletion}
              onEdit={handleEditHabit}
              onDelete={deleteHabit}
            />
          </div>
        )}

        {activeTab === 'insights' && (
          <AIInsights habits={habits} />
        )}

        {showHabitForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingHabit ? 'Edit Habit' : 'Add New Habit'}
                </h2>
                <button 
                  onClick={() => {
                    setShowHabitForm(false);
                    setEditingHabit(null);
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <HabitForm 
                onSubmit={editingHabit ? updateHabit : addHabit} 
                initialData={editingHabit}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;