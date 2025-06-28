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
    { icon: Phone, label: 'Emergency Dispatch', color: 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700', urgent: true },
    { icon: Radio, label: 'Radio Command', color: 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700', urgent: true },
    { icon: AlertTriangle, label: 'Alert Units', color: 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700', urgent: true },
  ];

  const routineActions = [
    { icon: Users, label: 'Unit Status', color: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700' },
    { icon: MapPin, label: 'District Map', color: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700' },
    { icon: FileText, label: 'Incident Reports', color: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' },
  ];

  const reportActions = [
    { icon: Download, label: 'Export PDF', action: onExportPDF },
    { icon: Calendar, label: 'Schedule Report', action: onScheduleReport },
    { icon: Share2, label: 'Share Digest', action: onShareDigest },
    { icon: Settings, label: 'Preferences', action: () => {} },
  ];

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-indigo-100 p-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h3>
      
      <div className="space-y-6">
        {/* Emergency Actions */}
        <div>
          <h4 className="text-sm font-semibold text-slate-700 mb-3">Emergency Response</h4>
          <div className="grid grid-cols-1 gap-2">
            {emergencyActions.map((action, index) => (
              <button
                key={index}
                className={`${action.color} text-white p-3 rounded-xl flex items-center space-x-3 transition-all duration-200 w-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`}
              >
                <action.icon className="h-5 w-5" />
                <span className="text-sm font-semibold">{action.label}</span>
                {action.urgent && (
                  <span className="ml-auto bg-white bg-opacity-20 text-xs px-2 py-1 rounded-lg font-bold">
                    URGENT
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Routine Actions */}
        <div>
          <h4 className="text-sm font-semibold text-slate-700 mb-3">Operations</h4>
          <div className="grid grid-cols-1 gap-2">
            {routineActions.map((action, index) => (
              <button
                key={index}
                className={`${action.color} text-white p-3 rounded-xl flex items-center space-x-3 transition-all duration-200 w-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`}
              >
                <action.icon className="h-5 w-5" />
                <span className="text-sm font-semibold">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Report Actions */}
        <div>
          <h4 className="text-sm font-semibold text-slate-700 mb-3">Reports</h4>
          <div className="grid grid-cols-2 gap-2">
            {reportActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 text-slate-700 p-3 rounded-xl flex flex-col items-center space-y-1 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <action.icon className="h-4 w-4" />
                <span className="text-xs font-semibold text-center">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};