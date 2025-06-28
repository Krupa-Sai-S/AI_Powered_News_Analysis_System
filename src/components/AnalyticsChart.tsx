import React from 'react';
import { AnalyticsData } from '../types';
import { BarChart3, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface AnalyticsChartProps {
  data: AnalyticsData;
}

export const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ data }) => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-emerald-500" />;
      case 'stable': return <Minus className="h-4 w-4 text-slate-500" />;
      default: return <Minus className="h-4 w-4 text-slate-500" />;
    }
  };

  const maxIncidents = Math.max(...Object.values(data.districtComparison).map(d => d.totalIncidents));

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-indigo-100 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
          <BarChart3 className="h-6 w-6 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800">District Analytics</h3>
      </div>
      
      <div className="space-y-4">
        {Object.entries(data.districtComparison).map(([district, stats]) => (
          <div key={district} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold text-slate-800">{district}</span>
                {getTrendIcon(stats.trend)}
              </div>
              <span className="text-sm text-slate-600 font-medium">{stats.totalIncidents} incidents</span>
            </div>
            
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(stats.totalIncidents / maxIncidents) * 100}%` }}
              ></div>
            </div>
            
            <div className="flex space-x-2">
              {Object.entries(stats.priorityBreakdown).map(([priority, count]) => (
                <div key={priority} className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${
                    priority === 'high' ? 'bg-red-500' :
                    priority === 'medium' ? 'bg-yellow-500' : 'bg-emerald-500'
                  }`}></div>
                  <span className="text-xs text-slate-600 font-medium">{count}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-indigo-100">
        <h4 className="text-sm font-semibold text-slate-800 mb-3">Time Pattern Analysis</h4>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-xs text-slate-600 font-medium">Peak Hour</p>
            <p className="text-sm font-bold text-slate-800">
              {Object.entries(data.crimePatterns.timeOfDay)
                .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'}
            </p>
          </div>
          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-xs text-slate-600 font-medium">Peak Day</p>
            <p className="text-sm font-bold text-slate-800">
              {Object.entries(data.crimePatterns.dayOfWeek)
                .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'}
            </p>
          </div>
          <div className="bg-slate-50 rounded-lg p-3">
            <p className="text-xs text-slate-600 font-medium">Monthly Trend</p>
            <p className="text-sm font-bold text-slate-800">
              {Object.values(data.crimePatterns.monthlyTrend).reduce((a, b) => a + b, 0) > 0 ? '+' : ''}
              {Object.values(data.crimePatterns.monthlyTrend).reduce((a, b) => a + b, 0)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};