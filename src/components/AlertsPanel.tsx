import React from 'react';
import { Alert } from '../types';
import { AlertTriangle, TrendingUp, Cloud, Activity, Clock, MapPin } from 'lucide-react';
import { format } from 'date-fns';

interface AlertsPanelProps {
  alerts: Alert[];
  onDismissAlert?: (alertId: string) => void;
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts, onDismissAlert }) => {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'breaking': return <AlertTriangle className="h-5 w-5" />;
      case 'pattern': return <TrendingUp className="h-5 w-5" />;
      case 'escalation': return <Activity className="h-5 w-5" />;
      case 'weather': return <Cloud className="h-5 w-5" />;
      default: return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const getAlertColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50 text-red-800';
      case 'medium': return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      case 'low': return 'border-blue-200 bg-blue-50 text-blue-800';
      default: return 'border-gray-200 bg-gray-50 text-gray-800';
    }
  };

  if (alerts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Alerts</h3>
        <p className="text-gray-500 text-center py-8">No active alerts at this time</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Active Alerts</h3>
        <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
          {alerts.length} active
        </span>
      </div>
      
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`border rounded-lg p-4 ${getAlertColor(alert.priority)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{alert.title}</h4>
                  <p className="text-sm mt-1 opacity-90">{alert.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-xs opacity-75">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{format(new Date(alert.timestamp), 'HH:mm')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{alert.districts.join(', ')}</span>
                    </div>
                  </div>
                </div>
              </div>
              {onDismissAlert && (
                <button
                  onClick={() => onDismissAlert(alert.id)}
                  className="text-gray-400 hover:text-gray-600 ml-2"
                >
                  ×
                </button>
              )}
            </div>
            {alert.actionRequired && (
              <div className="mt-3 pt-3 border-t border-current border-opacity-20">
                <span className="text-xs font-medium">⚠️ Action Required</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};