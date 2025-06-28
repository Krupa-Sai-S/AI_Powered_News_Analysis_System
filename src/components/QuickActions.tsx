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
    { 
      icon: Phone, 
      label: 'Emergency Dispatch', 
      color: 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700', 
      urgent: true,
      action: () => alert('Emergency dispatch system would be activated')
    },
    { 
      icon: Radio, 
      label: 'Radio Command', 
      color: 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700', 
      urgent: true,
      action: () => alert('Radio command center would be contacted')
    },
    { 
      icon: AlertTriangle, 
      label: 'Alert Units', 
      color: 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700', 
      urgent: true,
      action: () => alert('Field units would be alerted')
    },
  ];

  const routineActions = [
    { 
      icon: Users, 
      label: 'Unit Status', 
      color: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700',
      action: () => alert('Unit status dashboard would be displayed')
    },
    { 
      icon: MapPin, 
      label: 'District Map', 
      color: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700',
      action: () => alert('Interactive district map would be opened')
    },
    { 
      icon: FileText, 
      label: 'Incident Reports', 
      color: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700',
      action: () => alert('Incident reporting system would be accessed')
    },
  ];

  const reportActions = [
    { icon: Download, label: 'Export PDF', action: onExportPDF },
    { icon: Calendar, label: 'Schedule Report', action: onScheduleReport },
    { icon: Share2, label: 'Share Digest', action: onShareDigest },
    { icon: Settings, label: 'Preferences', action: () => alert('User preferences would be configured') },
  ];

  return (
    <div className="glass rounded-2xl shadow-professional border border-blue-200/30 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
          <AlertTriangle className="h-6 w-6 text-white" />
        </div>
        <h3 className="text-lg font-bold text-slate-800">Quick Actions</h3>
      </div>
      
      <div className="space-y-6">
        {/* Emergency Actions */}
        <div>
          <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span>Emergency Response</span>
          </h4>
          <div className="grid grid-cols-1 gap-2">
            {emergencyActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className={`${action.color} text-white p-3 rounded-xl flex items-center space-x-3 transition-all duration-200 w-full shadow-professional hover:shadow-professional-lg transform hover:-translate-y-0.5`}
              >
                <action.icon className="h-5 w-5" />
                <span className="text-sm font-bold">{action.label}</span>
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
          <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Operations</span>
          </h4>
          <div className="grid grid-cols-1 gap-2">
            {routineActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className={`${action.color} text-white p-3 rounded-xl flex items-center space-x-3 transition-all duration-200 w-full shadow-professional hover:shadow-professional-lg transform hover:-translate-y-0.5`}
              >
                <action.icon className="h-5 w-5" />
                <span className="text-sm font-bold">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Report Actions */}
        <div>
          <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center space-x-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <span>Reports & Sharing</span>
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {reportActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className="glass hover:bg-white/60 text-slate-700 p-3 rounded-xl flex flex-col items-center space-y-1 transition-all duration-200 shadow-professional hover:shadow-professional-lg hover-lift"
              >
                <action.icon className="h-4 w-4" />
                <span className="text-xs font-bold text-center">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};