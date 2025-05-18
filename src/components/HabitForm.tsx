import React, { useState, useEffect } from 'react';
import { Clock, Calendar, MessageSquare, Tag } from 'lucide-react';
import { Habit } from '../types';

interface HabitFormProps {
  onSubmit: (habit: Habit) => void;
  initialData: Habit | null;
}

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const CATEGORIES = ['Health', 'Fitness', 'Learning', 'Productivity', 'Mindfulness', 'Social', 'Other'];
const COLORS = ['indigo', 'purple', 'pink', 'red', 'orange', 'yellow', 'green', 'teal', 'blue'];

const HabitForm: React.FC<HabitFormProps> = ({ onSubmit, initialData }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>(initialData?.frequency || 'daily');
  const [reminderTime, setReminderTime] = useState(initialData?.reminderTime || '');
  const [reminderDays, setReminderDays] = useState<string[]>(initialData?.reminderDays || []);
  const [motivationalMessages, setMotivationalMessages] = useState<string[]>(
    initialData?.motivationalMessages || ['You can do it!', 'Keep going!', 'Stay consistent!']
  );
  const [newMessage, setNewMessage] = useState('');
  const [category, setCategory] = useState(initialData?.category || 'Health');
  const [color, setColor] = useState(initialData?.color || 'indigo');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const habitData: Omit<Habit, 'id' | 'progress' | 'streakCount'> = {
      name,
      description,
      frequency,
      reminderTime: reminderTime || undefined,
      reminderDays: reminderDays.length > 0 ? reminderDays : undefined,
      motivationalMessages: motivationalMessages.length > 0 ? motivationalMessages : undefined,
      category,
      color
    };
    
    onSubmit({
      ...habitData,
      id: initialData?.id || '',
      progress: initialData?.progress || [],
      streakCount: initialData?.streakCount || 0
    });
  };

  const handleDayToggle = (day: string) => {
    if (reminderDays.includes(day)) {
      setReminderDays(reminderDays.filter(d => d !== day));
    } else {
      setReminderDays([...reminderDays, day]);
    }
  };

  const addMotivationalMessage = () => {
    if (newMessage.trim()) {
      setMotivationalMessages([...motivationalMessages, newMessage.trim()]);
      setNewMessage('');
    }
  };

  const removeMotivationalMessage = (index: number) => {
    setMotivationalMessages(motivationalMessages.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Habit Name*
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="e.g., Morning Meditation"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Describe your habit and why it's important to you"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Frequency*</label>
        <div className="mt-1 flex space-x-4">
          {['daily', 'weekly', 'monthly'].map((freq) => (
            <label key={freq} className="inline-flex items-center">
              <input
                type="radio"
                name="frequency"
                value={freq}
                checked={frequency === freq}
                onChange={() => setFrequency(freq as 'daily' | 'weekly' | 'monthly')}
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700 capitalize">{freq}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Color</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {COLORS.map((colorOption) => (
            <button
              key={colorOption}
              type="button"
              onClick={() => setColor(colorOption)}
              className={`w-8 h-8 rounded-full ${color === colorOption ? 'ring-2 ring-offset-2 ring-gray-500' : ''}`}
              style={{ backgroundColor: `var(--color-${colorOption}-500)` }}
            />
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center">
          <Clock className="h-5 w-5 text-gray-400 mr-2" />
          <label htmlFor="reminderTime" className="block text-sm font-medium text-gray-700">
            Daily Reminder Time
          </label>
        </div>
        <input
          type="time"
          id="reminderTime"
          value={reminderTime}
          onChange={(e) => setReminderTime(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      {frequency === 'weekly' && (
        <div>
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-gray-400 mr-2" />
            <label className="block text-sm font-medium text-gray-700">
              Reminder Days
            </label>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {DAYS_OF_WEEK.map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => handleDayToggle(day)}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  reminderDays.includes(day)
                    ? 'bg-indigo-100 text-indigo-800'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {day.substring(0, 3)}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center">
          <MessageSquare className="h-5 w-5 text-gray-400 mr-2" />
          <label className="block text-sm font-medium text-gray-700">
            Motivational Messages
          </label>
        </div>
        <div className="mt-2 space-y-2">
          {motivationalMessages.map((message, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
              <span className="text-sm text-gray-700">{message}</span>
              <button
                type="button"
                onClick={() => removeMotivationalMessage(index)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Remove</span>
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          <div className="flex mt-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Add a motivational message"
              className="flex-grow rounded-l-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <button
              type="button"
              onClick={addMotivationalMessage}
              className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-700 hover:bg-gray-100"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {initialData ? 'Update Habit' : 'Create Habit'}
        </button>
      </div>
    </form>
  );
};

export default HabitForm;