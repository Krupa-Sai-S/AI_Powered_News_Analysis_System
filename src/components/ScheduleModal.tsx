import React, { useState } from 'react';
import { X, Calendar, Clock, Mail, Users, Settings, Send } from 'lucide-react';

interface ScheduleData {
  frequency: 'daily' | 'weekly' | 'monthly';
  time: string;
  recipients: string[];
  format: 'pdf' | 'email' | 'both';
  includeAlerts: boolean;
  includeAnalytics: boolean;
}

interface ScheduleModalProps {
  onClose: () => void;
  onSchedule: (schedule: ScheduleData) => void;
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({ onClose, onSchedule }) => {
  const [schedule, setSchedule] = useState<ScheduleData>({
    frequency: 'daily',
    time: '08:00',
    recipients: [],
    format: 'both',
    includeAlerts: true,
    includeAnalytics: true
  });
  
  const [recipientInput, setRecipientInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addRecipient = () => {
    if (recipientInput.trim() && !schedule.recipients.includes(recipientInput.trim())) {
      setSchedule(prev => ({
        ...prev,
        recipients: [...prev.recipients, recipientInput.trim()]
      }));
      setRecipientInput('');
    }
  };

  const removeRecipient = (email: string) => {
    setSchedule(prev => ({
      ...prev,
      recipients: prev.recipients.filter(r => r !== email)
    }));
  };

  const handleSubmit = async () => {
    if (schedule.recipients.length === 0) {
      alert('Please add at least one recipient');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    onSchedule(schedule);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass rounded-3xl shadow-professional-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-blue-200/30">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-blue-200/30 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Schedule Reports</h2>
              <p className="text-sm text-slate-600 font-medium">
                Automate daily digest delivery
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-white/50 rounded-xl"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Frequency Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Delivery Frequency
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'daily', label: 'Daily', desc: 'Every day' },
                { value: 'weekly', label: 'Weekly', desc: 'Every Monday' },
                { value: 'monthly', label: 'Monthly', desc: '1st of month' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSchedule(prev => ({ ...prev, frequency: option.value as any }))}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    schedule.frequency === option.value
                      ? 'border-blue-500 bg-blue-50 text-blue-800'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="font-semibold">{option.label}</div>
                  <div className="text-sm opacity-75">{option.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Time Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Delivery Time
            </label>
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-slate-400" />
              <input
                type="time"
                value={schedule.time}
                onChange={(e) => setSchedule(prev => ({ ...prev, time: e.target.value }))}
                className="border border-slate-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
              />
              <span className="text-sm text-slate-600 font-medium">IST (Indian Standard Time)</span>
            </div>
          </div>

          {/* Recipients */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Recipients
            </label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="flex-1 relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <input
                    type="email"
                    value={recipientInput}
                    onChange={(e) => setRecipientInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addRecipient()}
                    placeholder="officer@appolice.gov.in"
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                  />
                </div>
                <button
                  onClick={addRecipient}
                  className="px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-semibold"
                >
                  Add
                </button>
              </div>
              
              {schedule.recipients.length > 0 && (
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="h-4 w-4 text-slate-600" />
                    <span className="text-sm font-semibold text-slate-700">
                      {schedule.recipients.length} Recipients
                    </span>
                  </div>
                  <div className="space-y-2">
                    {schedule.recipients.map((email, index) => (
                      <div key={index} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-slate-200">
                        <span className="text-sm font-medium text-slate-700">{email}</span>
                        <button
                          onClick={() => removeRecipient(email)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Format Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Delivery Format
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'email', label: 'Email Only', desc: 'HTML email' },
                { value: 'pdf', label: 'PDF Only', desc: 'Attachment' },
                { value: 'both', label: 'Email + PDF', desc: 'Both formats' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSchedule(prev => ({ ...prev, format: option.value as any }))}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    schedule.format === option.value
                      ? 'border-blue-500 bg-blue-50 text-blue-800'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="font-semibold">{option.label}</div>
                  <div className="text-sm opacity-75">{option.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Content Options */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Include in Reports
            </label>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                <input
                  type="checkbox"
                  checked={schedule.includeAlerts}
                  onChange={(e) => setSchedule(prev => ({ ...prev, includeAlerts: e.target.checked }))}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <div>
                  <div className="font-semibold text-slate-800">Active Alerts</div>
                  <div className="text-sm text-slate-600">Include current alerts and warnings</div>
                </div>
              </label>
              
              <label className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
                <input
                  type="checkbox"
                  checked={schedule.includeAnalytics}
                  onChange={(e) => setSchedule(prev => ({ ...prev, includeAnalytics: e.target.checked }))}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <div>
                  <div className="font-semibold text-slate-800">Analytics & Charts</div>
                  <div className="text-sm text-slate-600">Include district analytics and trends</div>
                </div>
              </label>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <Settings className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-800">Schedule Preview</span>
            </div>
            <div className="text-sm text-blue-700 space-y-1">
              <p><strong>Frequency:</strong> {schedule.frequency.charAt(0).toUpperCase() + schedule.frequency.slice(1)} at {schedule.time} IST</p>
              <p><strong>Recipients:</strong> {schedule.recipients.length} officers</p>
              <p><strong>Format:</strong> {schedule.format === 'both' ? 'Email + PDF' : schedule.format.toUpperCase()}</p>
              <p><strong>Content:</strong> {[
                schedule.includeAlerts && 'Alerts',
                schedule.includeAnalytics && 'Analytics',
                'Topic Clusters'
              ].filter(Boolean).join(', ')}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-blue-200/30 p-6 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-6 py-3 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={schedule.recipients.length === 0 || isSubmitting}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              <Send className="h-5 w-5" />
              <span>{isSubmitting ? 'Scheduling...' : 'Schedule Reports'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};