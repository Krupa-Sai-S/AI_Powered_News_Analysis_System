import React from 'react';
import { WeatherImpact } from '../types';
import { Cloud, Thermometer, AlertCircle, CheckCircle } from 'lucide-react';

interface WeatherWidgetProps {
  weather: WeatherImpact;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ weather }) => {
  const getCorrelationColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-gradient-to-r from-red-100 to-pink-100';
      case 'medium': return 'text-yellow-600 bg-gradient-to-r from-yellow-100 to-orange-100';
      case 'low': return 'text-emerald-600 bg-gradient-to-r from-emerald-100 to-teal-100';
      default: return 'text-slate-600 bg-gradient-to-r from-slate-100 to-gray-100';
    }
  };

  const getCorrelationIcon = (level: string) => {
    switch (level) {
      case 'high': return <AlertCircle className="h-4 w-4" />;
      case 'medium': return <AlertCircle className="h-4 w-4" />;
      case 'low': return <CheckCircle className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-indigo-100 p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
          <Cloud className="h-6 w-6 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800">Weather Impact</h3>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between bg-slate-50 rounded-xl p-3">
          <div className="flex items-center space-x-2">
            <Thermometer className="h-4 w-4 text-indigo-500" />
            <span className="text-sm text-slate-700 font-medium">{weather.condition}</span>
          </div>
          <span className="text-lg font-bold text-slate-800">{weather.temperature}°C</span>
        </div>
        
        <p className="text-sm text-slate-600 font-medium leading-relaxed">{weather.description}</p>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-700 font-medium">Crime Correlation:</span>
          <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${getCorrelationColor(weather.crimeCorrelation)}`}>
            {getCorrelationIcon(weather.crimeCorrelation)}
            <span className="capitalize">{weather.crimeCorrelation}</span>
          </div>
        </div>
        
        {weather.recommendations.length > 0 && (
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
            <h4 className="text-sm font-semibold text-slate-800 mb-2">Recommendations:</h4>
            <ul className="space-y-1">
              {weather.recommendations.map((rec, index) => (
                <li key={index} className="text-xs text-slate-700 flex items-start space-x-1 font-medium">
                  <span className="text-indigo-600 mt-1 font-bold">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};