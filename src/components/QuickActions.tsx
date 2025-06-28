import React from 'react';
import { 
  Phone, 
  Radio, 
  FileText, 
  Users, 
  MapPin, 
  AlertTriangle,
  Calendar,
  Settings,
  Download,
  Share2
} from 'lucide-react';

interface QuickActionsProps {
  onExportPDF: () => void;
  onScheduleReport: () => void;
  onShareDigest: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ 
  onExportPDF, 
  onScheduleReport, 
  onShareDigest 
}) => {
  const emergencyActions = [
    { icon: Phone, label: 'Emergency Dispatch', color: 'bg-red-600 hover:bg-red-700', urgent: true },
    { icon: Radio, label: 'Radio Command', color: 'bg-orange-600 hover:bg-orange-700', urgent: true },
    { icon: AlertTriangle, label: 'Alert Units', color: 'bg-yellow-600 hover:bg-yellow-700', urgent: true },
  ];

  const routineActions = [
    { icon: Users, label: 'Unit Status', color: 'bg-blue-600 hover:bg-blue-700' },
    { icon: MapPin, label: 'District Map', color: 'bg-green-600 hover:bg-green-700' },
    { icon: FileText, label: 'Incident Reports', color: 'bg-purple-600 hover:bg-purple-700' },
  ];

  const reportActions = [
    { icon: Download, label: 'Export PDF', action: onExportPDF },
    { icon: Calendar, label: 'Schedule Report', action: onScheduleReport },
    { icon: Share2, label: 'Share Digest', action: onShareDigest },
    { icon: Settings, label: 'Preferences', action: () => {} },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      
      <div className="space-y-6">
        {/* Emergency Actions */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Emergency Response</h4>
          <div className="grid grid-cols-1 gap-2">
            {emergencyActions.map((action, index) => (
              <button
                key={index}
                className={`${action.color} text-white p-3 rounded-lg flex items-center space-x-3 transition-colors w-full`}
              >
                <action.icon className="h-5 w-5" />
                <span className="text-sm font-medium">{action.label}</span>
                {action.urgent && (
                  <span className="ml-auto bg-white bg-opacity-20 text-xs px-2 py-1 rounded">
                    URGENT
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Routine Actions */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Operations</h4>
          <div className="grid grid-cols-1 gap-2">
            {routineActions.map((action, index) => (
              <button
                key={index}
                className={`${action.color} text-white p-3 rounded-lg flex items-center space-x-3 transition-colors w-full`}
              >
                <action.icon className="h-5 w-5" />
                <span className="text-sm font-medium">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Report Actions */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Reports</h4>
          <div className="grid grid-cols-2 gap-2">
            {reportActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-3 rounded-lg flex flex-col items-center space-y-1 transition-colors"
              >
                <action.icon className="h-4 w-4" />
                <span className="text-xs font-medium text-center">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};