import React from 'react';
import { X, Bell, Check, Trash2, Clock, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
}

interface NotificationCenterProps {
  notifications: Notification[];
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onClose,
  onMarkAsRead,
  onClearAll
}) => {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default: return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50';
      case 'warning': return 'border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50';
      case 'error': return 'border-red-200 bg-gradient-to-r from-red-50 to-pink-50';
      default: return 'border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass rounded-3xl shadow-professional-xl max-w-2xl w-full max-h-[80vh] overflow-hidden border border-blue-200/30">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-blue-200/30 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <Bell className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Notification Center</h2>
              <p className="text-sm text-slate-600 font-medium">
                {unreadCount} unread of {notifications.length} total
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {notifications.length > 0 && (
              <button
                onClick={onClearAll}
                className="flex items-center space-x-2 text-slate-600 hover:text-red-600 transition-colors px-3 py-2 rounded-xl hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                <span className="text-sm font-semibold">Clear All</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-white/50 rounded-xl"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="overflow-y-auto max-h-[60vh]">
          {notifications.length === 0 ? (
            <div className="p-12 text-center">
              <div className="p-4 bg-slate-100 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
                <Bell className="h-8 w-8 text-slate-400" />
              </div>
              <p className="text-slate-500 font-semibold text-lg">No notifications</p>
              <p className="text-slate-400 text-sm">You're all caught up!</p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`border rounded-xl p-4 transition-all duration-200 hover:shadow-md ${
                    getNotificationColor(notification.type)
                  } ${!notification.read ? 'ring-2 ring-blue-200' : ''}`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-800 mb-1">
                            {notification.title}
                            {!notification.read && (
                              <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full inline-block"></span>
                            )}
                          </h4>
                          <p className="text-sm text-slate-700 font-medium mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center space-x-2 text-xs text-slate-500">
                            <Clock className="h-3 w-3" />
                            <span className="font-medium">
                              {format(notification.timestamp, 'MMM dd, HH:mm')}
                            </span>
                          </div>
                        </div>
                        {!notification.read && (
                          <button
                            onClick={() => onMarkAsRead(notification.id)}
                            className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors px-2 py-1 rounded-lg hover:bg-blue-100"
                          >
                            <Check className="h-4 w-4" />
                            <span className="text-xs font-semibold">Mark Read</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="border-t border-blue-200/30 p-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600 font-medium">
                Last updated: {format(new Date(), 'HH:mm')}
              </span>
              <div className="flex items-center space-x-4">
                <span className="text-slate-600 font-medium">
                  {unreadCount} unread
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={() => notifications.forEach(n => !n.read && onMarkAsRead(n.id))}
                    className="text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};