import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Sparkles, 
  TrendingUp, 
  Calendar, 
  BarChart, 
  PieChart,
  LineChart,
  Lightbulb
} from 'lucide-react';
import { Habit } from '../types';

interface AIInsightsProps {
  habits: Habit[];
}

interface InsightCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  type: 'pattern' | 'suggestion' | 'motivation';
  color: string;
}

const AIInsights: React.FC<AIInsightsProps> = ({ habits }) => {
  const [insights, setInsights] = useState<InsightCard[]>([]);
  
  useEffect(() => {
    // Generate AI insights based on habit data
    if (habits.length === 0) {
      setInsights([
        {
          id: 'no-habits',
          title: 'Get Started',
          description: 'Add your first habit to start receiving personalized AI insights!',
          icon: <Sparkles className="h-6 w-6" />,
          type: 'suggestion',
          color: 'indigo'
        }
      ]);
      return;
    }
    
    const generatedInsights: InsightCard[] = [];
    
    // Completion rate insights
    const completedHabits = habits.filter(habit => habit.progress.length > 0);
    const completionRate = habits.length > 0 
      ? Math.round((completedHabits.length / habits.length) * 100) 
      : 0;
    
    if (completionRate < 50) {
      generatedInsights.push({
        id: 'low-completion',
        title: 'Boost Your Completion Rate',
        description: 'Try focusing on fewer habits at first. Start with 2-3 habits that are most important to you.',
        icon: <TrendingUp className="h-6 w-6" />,
        type: 'suggestion',
        color: 'yellow'
      });
    }
    
    // Streak insights
    const highestStreakHabit = [...habits].sort((a, b) => b.streakCount - a.streakCount)[0];
    if (highestStreakHabit && highestStreakHabit.streakCount > 3) {
      generatedInsights.push({
        id: 'streak-champion',
        title: 'Streak Champion',
        description: `You're on a ${highestStreakHabit.streakCount}-day streak with "${highestStreakHabit.name}"! Keep it up!`,
        icon: <Calendar className="h-6 w-6" />,
        type: 'motivation',
        color: 'green'
      });
    }
    
    // Category insights
    const categories = habits.map(h => h.category).filter(Boolean) as string[];
    const categoryCounts: Record<string, number> = {};
    categories.forEach(cat => {
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });
    
    const topCategory = Object.entries(categoryCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([category]) => category)[0];
    
    if (topCategory) {
      generatedInsights.push({
        id: 'category-focus',
        title: 'Category Focus',
        description: `You're focusing on ${topCategory} habits. Consider adding habits from other areas for a more balanced routine.`,
        icon: <PieChart className="h-6 w-6" />,
        type: 'pattern',
        color: 'purple'
      });
    }
    
    // Time of day insights
    const morningHabits = habits.filter(h => h.reminderTime && parseInt(h.reminderTime.split(':')[0]) < 12).length;
    const eveningHabits = habits.filter(h => h.reminderTime && parseInt(h.reminderTime.split(':')[0]) >= 18).length;
    
    if (morningHabits > eveningHabits && morningHabits > 1) {
      generatedInsights.push({
        id: 'morning-person',
        title: 'Morning Person',
        description: 'You tend to schedule habits in the morning. Morning routines can set a positive tone for your day!',
        icon: <Brain className="h-6 w-6" />,
        type: 'pattern',
        color: 'blue'
      });
    } else if (eveningHabits > morningHabits && eveningHabits > 1) {
      generatedInsights.push({
        id: 'evening-routine',
        title: 'Evening Routine',
        description: 'You prefer evening habits. Consider adding a morning habit to energize your day from the start.',
        icon: <Brain className="h-6 w-6" />,
        type: 'suggestion',
        color: 'pink'
      });
    }
    
    // Consistency insights
    const consistentHabits = habits.filter(h => {
      if (h.progress.length < 3) return false;
      
      // Check if the last 3 entries are on consecutive days
      const lastThreeDates = h.progress.slice(-3).map(p => new Date(p.date).getTime());
      return lastThreeDates.every((date, i) => 
        i === 0 || date - lastThreeDates[i-1] === 86400000 // 24 hours in milliseconds
      );
    });
    
    if (consistentHabits.length > 0) {
      generatedInsights.push({
        id: 'consistency-champion',
        title: 'Consistency Champion',
        description: `You're showing great consistency with ${consistentHabits.length} of your habits. Consistency is key to long-term success!`,
        icon: <LineChart className="h-6 w-6" />,
        type: 'motivation',
        color: 'teal'
      });
    }
    
    // Add some general AI suggestions
    const generalSuggestions = [
      {
        id: 'habit-stacking',
        title: 'Try Habit Stacking',
        description: 'Link new habits to existing ones. For example, "After I brush my teeth, I will meditate for 2 minutes."',
        icon: <Lightbulb className="h-6 w-6" />,
        type: 'suggestion',
        color: 'orange'
      },
      {
        id: 'two-minute-rule',
        title: 'The Two-Minute Rule',
        description: 'Make new habits take less than two minutes to start. This reduces the activation energy needed to begin.',
        icon: <Lightbulb className="h-6 w-6" />,
        type: 'suggestion',
        color: 'indigo'
      },
      {
        id: 'environment-design',
        title: 'Design Your Environment',
        description: 'Make good habits obvious and easy. Remove friction for habits you want to build.',
        icon: <Lightbulb className="h-6 w-6" />,
        type: 'suggestion',
        color: 'green'
      }
    ];
    
    // Add 1-2 general suggestions
    const randomSuggestions = generalSuggestions
      .sort(() => 0.5 - Math.random())
      .slice(0, habits.length > 0 ? 2 : 3);
    
    setInsights([...generatedInsights, ...randomSuggestions]);
  }, [habits]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">AI Insights</h2>
        <div className="flex items-center space-x-2 bg-indigo-50 px-3 py-1 rounded-full">
          <Brain className="h-5 w-5 text-indigo-600" />
          <span className="text-sm font-medium text-indigo-700">Powered by AI</span>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Your Personalized Insights</h3>
          <p className="text-gray-500">
            Based on your habit data, our AI has generated these insights to help you improve your habits and routines.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map(insight => (
            <div 
              key={insight.id} 
              className={`bg-${insight.color}-50 border border-${insight.color}-100 rounded-lg p-4`}
            >
              <div className="flex items-start">
                <div className={`bg-${insight.color}-100 p-2 rounded-full mr-4`}>
                  <div className={`text-${insight.color}-600`}>
                    {insight.icon}
                  </div>
                </div>
                <div>
                  <div className="flex items-center mb-1">
                    <h4 className={`font-medium text-${insight.color}-900`}>{insight.title}</h4>
                    <span className={`ml-2 text-xs font-medium text-${insight.color}-600 bg-${insight.color}-100 px-2 py-0.5 rounded-full capitalize`}>
                      {insight.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{insight.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {habits.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Habit Analytics</h3>
            <p className="text-gray-500">
              Visual representation of your habit data and patterns.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                <BarChart className="h-5 w-5 mr-2 text-indigo-500" />
                Habit Completion by Category
              </h4>
              <div className="h-48 flex items-center justify-center">
                <p className="text-gray-500 text-sm">
                  {habits.length < 3 
                    ? "Add more habits to see category analytics" 
                    : "Interactive charts will appear as you track more habits"}
                </p>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                <LineChart className="h-5 w-5 mr-2 text-green-500" />
                Weekly Streak Progress
              </h4>
              <div className="h-48 flex items-center justify-center">
                <p className="text-gray-500 text-sm">
                  {habits.some(h => h.streakCount > 0)
                    ? "Track more days to see detailed streak analytics"
                    : "Complete habits to start building streaks"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg p-6">
        <div className="flex items-start">
          <div className="mr-4">
            <Sparkles className="h-8 w-8" />
          </div>
          <div>
            <h3 className="font-medium text-lg mb-2">AI Coach Tip</h3>
            <p className="mb-4">
              The most effective habit builders focus on consistency rather than perfection. 
              It's better to do a little bit every day than to do a lot occasionally.
            </p>
            <p className="text-sm text-indigo-100">
              Your AI coach will provide more personalized tips as you track more habits.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;