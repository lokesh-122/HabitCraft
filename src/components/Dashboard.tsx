import React, { useState } from 'react';
import { 
  Calendar, 
  CheckCircle, 
  Target, 
  Award, 
  TrendingUp, 
  BarChart,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Habit } from '../types';

interface DashboardProps {
  habits: Habit[];
  toggleHabitCompletion: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ habits, toggleHabitCompletion }) => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const dateString = currentDate.toISOString().split('T')[0];
  
  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };
  
  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };
  
  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  };
  
  const isHabitCompletedOnDate = (habit: Habit, date: string) => {
    return habit.progress.some(p => p.date === date && p.completed);
  };
  
  const getDailyHabits = () => {
    return habits.filter(habit => habit.frequency === 'daily');
  };
  
  const getWeeklyHabits = () => {
    const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][currentDate.getDay()];
    return habits.filter(habit => 
      habit.frequency === 'weekly' && 
      (!habit.reminderDays || habit.reminderDays.length === 0 || habit.reminderDays.includes(dayOfWeek))
    );
  };
  
  const getMonthlyHabits = () => {
    const dayOfMonth = currentDate.getDate();
    // For simplicity, we'll show monthly habits on the 1st of each month
    return habits.filter(habit => 
      habit.frequency === 'monthly' && dayOfMonth === 1
    );
  };
  
  const todaysHabits = [...getDailyHabits(), ...getWeeklyHabits(), ...getMonthlyHabits()];
  
  const completedHabits = todaysHabits.filter(habit => 
    isHabitCompletedOnDate(habit, dateString)
  );
  
  const completionRate = todaysHabits.length > 0 
    ? Math.round((completedHabits.length / todaysHabits.length) * 100) 
    : 0;
  
  const totalStreaks = habits.reduce((sum, habit) => sum + habit.streakCount, 0);
  
  const getMotivationalMessage = () => {
    if (habits.length === 0) {
      return "Start by adding your first habit!";
    }
    
    if (completionRate === 100) {
      return "Amazing job! You've completed all your habits today!";
    }
    
    if (completionRate > 50) {
      return "You're making great progress! Keep going!";
    }
    
    return "Every small step counts. You can do this!";
  };
  
  const getRandomMotivationalMessage = (habit: Habit) => {
    if (!habit.motivationalMessages || habit.motivationalMessages.length === 0) {
      return "Keep going!";
    }
    
    const randomIndex = Math.floor(Math.random() * habit.motivationalMessages.length);
    return habit.motivationalMessages[randomIndex];
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Dashboard</h2>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => navigateDate('prev')}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <ChevronLeft className="h-5 w-5 text-gray-500" />
            </button>
            <span className={`text-sm font-medium ${isToday(currentDate) ? 'text-indigo-600' : 'text-gray-500'}`}>
              {isToday(currentDate) ? 'Today' : formatDate(currentDate)}
            </span>
            <button 
              onClick={() => navigateDate('next')}
              className="p-1 rounded-full hover:bg-gray-100"
              disabled={isToday(currentDate)}
            >
              <ChevronRight className={`h-5 w-5 ${isToday(currentDate) ? 'text-gray-300' : 'text-gray-500'}`} />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4">
            <div className="flex items-center">
              <div className="bg-indigo-100 p-3 rounded-full">
                <CheckCircle className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-indigo-600">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{completionRate}%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-purple-600">Active Habits</p>
                <p className="text-2xl font-bold text-gray-900">{habits.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-lg p-4">
            <div className="flex items-center">
              <div className="bg-pink-100 p-3 rounded-full">
                <Award className="h-6 w-6 text-pink-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-pink-600">Total Streaks</p>
                <p className="text-2xl font-bold text-gray-900">{totalStreaks}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 rounded-lg mb-6">
          <div className="flex items-start">
            <div className="mr-4">
              <TrendingUp className="h-8 w-8" />
            </div>
            <div>
              <h3 className="font-medium text-lg">Daily Motivation</h3>
              <p className="mt-1">{getMotivationalMessage()}</p>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium text-gray-900 mb-4">
            {isToday(currentDate) ? "Today's Habits" : `Habits for ${formatDate(currentDate)}`}
          </h3>
          
          {todaysHabits.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No habits scheduled for this day.</p>
              {isToday(currentDate) && (
                <p className="text-gray-500 mt-2">Go to "My Habits" to add some!</p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {todaysHabits.map(habit => (
                <div 
                  key={habit.id} 
                  className={`bg-white border rounded-lg p-4 flex items-center justify-between transition-all ${
                    isHabitCompletedOnDate(habit, dateString)
                      ? `border-green-200 bg-green-50`
                      : 'border-gray-200 hover:border-indigo-200 hover:bg-indigo-50'
                  }`}
                >
                  <div className="flex items-center">
                    <button
                      onClick={() => toggleHabitCompletion(habit.id)}
                      className={`mr-3 flex-shrink-0 ${
                        isHabitCompletedOnDate(habit, dateString)
                          ? 'text-green-500 hover:text-green-600'
                          : 'text-gray-300 hover:text-gray-400'
                      }`}
                    >
                      <CheckCircle className="h-6 w-6" />
                    </button>
                    <div>
                      <h4 className="font-medium text-gray-900">{habit.name}</h4>
                      <p className="text-sm text-gray-500">
                        {isHabitCompletedOnDate(habit, dateString)
                          ? 'Completed'
                          : getRandomMotivationalMessage(habit)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    {habit.streakCount > 0 && (
                      <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs font-medium">
                        {habit.streakCount} day streak
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;