import React from 'react';
import { WeatherImpact } from '../types';
import { Cloud, Thermometer, AlertCircle, CheckCircle } from 'lucide-react';

interface WeatherWidgetProps {
  weather: WeatherImpact;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ weather }) => {
  const getCorrelationColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-4">
        <Cloud className="h-6 w-6 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Weather Impact</h3>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Thermometer className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">{weather.condition}</span>
          </div>
          <span className="text-lg font-semibold text-gray-900">{weather.temperature}°C</span>
        </div>
        
        <p className="text-sm text-gray-600">{weather.description}</p>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Crime Correlation:</span>
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getCorrelationColor(weather.crimeCorrelation)}`}>
            {getCorrelationIcon(weather.crimeCorrelation)}
            <span className="capitalize">{weather.crimeCorrelation}</span>
          </div>
        </div>
        
        {weather.recommendations.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Recommendations:</h4>
            <ul className="space-y-1">
              {weather.recommendations.map((rec, index) => (
                <li key={index} className="text-xs text-gray-600 flex items-start space-x-1">
                  <span className="text-blue-600 mt-1">•</span>
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