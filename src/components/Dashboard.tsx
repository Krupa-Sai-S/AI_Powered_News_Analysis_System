import React, { useState, useEffect } from 'react';
import { DailyDigest, ProcessingStatus, TopicCluster, Alert } from '../types';
import { generateMockDigest, generateMockAlerts, generateMockWeather, generateMockAnalytics } from '../utils/mockData';
import { generateProfessionalReport } from '../utils/pdfGenerator';
import { LoadingSpinner } from './LoadingSpinner';
import { TopicClusterCard } from './TopicClusterCard';
import { DetailModal } from './DetailModal';
import { ShareModal } from './ShareModal';
import { AlertsPanel } from './AlertsPanel';
import { WeatherWidget } from './WeatherWidget';
import { AnalyticsChart } from './AnalyticsChart';
import { QuickActions } from './QuickActions';
import { NotificationCenter } from './NotificationCenter';
import { ScheduleModal } from './ScheduleModal';
import { 
  Shield, 
  Calendar, 
  FileText, 
  TrendingUp, 
  MapPin, 
  Download,
  Filter,
  Search,
  BarChart3,
  Clock,
  Bell,
  Grid,
  List,
  RefreshCw,
  Star,
  Activity,
  Users,
  Eye,
  Bookmark,
  Archive,
  Zap,
  Target,
  AlertCircle
} from 'lucide-react';
import { format, subDays, parseISO } from 'date-fns';

export const Dashboard: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [digest, setDigest] = useState<DailyDigest | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<ProcessingStatus | null>(null);
  const [selectedCluster, setSelectedCluster] = useState<TopicCluster | null>(null);
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [showAlerts, setShowAlerts] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [bookmarkedClusters, setBookmarkedClusters] = useState<string[]>([]);
  const [archivedClusters, setArchivedClusters] = useState<string[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const processNewsFeed = async (date: string) => {
    setIsProcessing(true);
    setDigest(null);
    
    const steps = [
      { step: 'Connecting to Andhra Pradesh news sources...', progress: 10 },
      { step: 'Fetching articles from regional and national media...', progress: 20 },
      { step: 'Analyzing relevance to AP State Police operations...', progress: 35 },
      { step: 'Processing weather and coastal security data...', progress: 50 },
      { step: 'Clustering articles by operational categories...', progress: 65 },
      { step: 'Generating district-wise comparative analysis...', progress: 80 },
      { step: 'Creating intelligence alerts and recommendations...', progress: 90 },
      { step: 'Finalizing AP State Police daily digest...', progress: 100 }
    ];

    for (const status of steps) {
      setProcessingStatus(status);
      await new Promise(resolve => setTimeout(resolve, 900));
    }

    const mockDigest = generateMockDigest(parseISO(date));
    const mockAlerts = generateMockAlerts();
    
    setDigest(mockDigest);
    setAlerts(mockAlerts);
    setLastRefresh(new Date());
    
    // Add notification for new digest
    const newNotification = {
      id: Date.now().toString(),
      title: 'Daily Digest Updated',
      message: `New digest generated with ${mockDigest.topicClusters.length} clusters`,
      type: 'info',
      timestamp: new Date(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
    
    setIsProcessing(false);
    setProcessingStatus(null);
  };

  useEffect(() => {
    processNewsFeed(selectedDate);
  }, [selectedDate]);

  // Auto-refresh functionality
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        processNewsFeed(selectedDate);
      }, 300000); // 5 minutes
      setRefreshInterval(interval);
    } else {
      if (refreshInterval) {
        clearInterval(refreshInterval);
        setRefreshInterval(null);
      }
    }

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [autoRefresh, selectedDate]);

  const filteredClusters = digest?.topicClusters.filter(cluster => {
    if (archivedClusters.includes(cluster.id)) return false;
    
    const matchesPriority = filter === 'all' || cluster.priority === filter;
    const matchesSearch = searchTerm === '' || 
      cluster.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cluster.summary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesPriority && matchesSearch;
  }) || [];

  const exportToPDF = () => {
    if (!digest) return;
    generateProfessionalReport(digest, alerts);
    
    // Add notification
    const notification = {
      id: Date.now().toString(),
      title: 'Report Generated',
      message: 'PDF report has been downloaded successfully',
      type: 'success',
      timestamp: new Date(),
      read: false
    };
    setNotifications(prev => [notification, ...prev.slice(0, 9)]);
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
    
    // Add notification
    const notification = {
      id: Date.now().toString(),
      title: 'Alert Dismissed',
      message: 'Alert has been successfully dismissed',
      type: 'info',
      timestamp: new Date(),
      read: false
    };
    setNotifications(prev => [notification, ...prev.slice(0, 9)]);
  };

  const scheduleReport = () => {
    setShowScheduleModal(true);
  };

  const shareDigest = () => {
    if (!digest) return;
    setShowShareModal(true);
  };

  const toggleBookmark = (clusterId: string) => {
    setBookmarkedClusters(prev => 
      prev.includes(clusterId) 
        ? prev.filter(id => id !== clusterId)
        : [...prev, clusterId]
    );
  };

  const archiveCluster = (clusterId: string) => {
    setArchivedClusters(prev => [...prev, clusterId]);
    
    // Add notification
    const notification = {
      id: Date.now().toString(),
      title: 'Cluster Archived',
      message: 'Topic cluster has been archived',
      type: 'info',
      timestamp: new Date(),
      read: false
    };
    setNotifications(prev => [notification, ...prev.slice(0, 9)]);
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Enhanced Professional Header */}
      <div className="glass shadow-professional-lg border-b border-blue-200/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              {/* Official Logo Area */}
              <div className="relative">
                <div className="p-4 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800 rounded-2xl shadow-professional-lg">
                  <Shield className="h-10 w-10 text-white" />
                </div>
                <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white status-indicator ${
                  autoRefresh ? 'status-active' : 'status-warning'
                }`}></div>
              </div>
              
              {/* Department Identity */}
              <div className="space-y-1">
                <h1 className="text-3xl font-bold gradient-text tracking-tight">
                  Andhra Pradesh State Police
                </h1>
                <p className="text-sm font-semibold text-slate-600 tracking-wide">
                  Intelligence Analysis & News Monitoring System
                </p>
                <div className="flex items-center space-x-4 text-xs text-slate-500">
                  <span className="flex items-center space-x-1">
                    <Activity className="h-3 w-3" />
                    <span>{autoRefresh ? 'Auto-Refresh ON' : 'Manual Mode'}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Users className="h-3 w-3" />
                    <span>12 Districts</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Eye className="h-3 w-3" />
                    <span>Last: {format(lastRefresh, 'HH:mm')}</span>
                  </span>
                </div>
              </div>
            </div>
            
            {/* Enhanced Action Controls */}
            <div className="flex items-center space-x-4">
              {/* Notification Center */}
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative flex items-center space-x-2 px-4 py-3 rounded-xl font-semibold transition-all duration-300 hover-lift ${
                  unreadNotifications > 0 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-professional-lg' 
                    : 'glass text-slate-600 hover:bg-white/60'
                }`}
              >
                <Bell className="h-5 w-5" />
                <span className="font-bold">{unreadNotifications}</span>
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-pulse"></span>
                )}
              </button>

              {/* Auto-refresh Toggle */}
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-semibold transition-all duration-300 hover-lift ${
                  autoRefresh
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-professional-lg'
                    : 'glass text-slate-600 hover:bg-white/60'
                }`}
              >
                <Zap className="h-5 w-5" />
                <span>{autoRefresh ? 'Auto' : 'Manual'}</span>
              </button>
              
              {/* Alert Indicator */}
              <button
                onClick={() => setShowAlerts(!showAlerts)}
                className={`relative flex items-center space-x-2 px-4 py-3 rounded-xl font-semibold transition-all duration-300 hover-lift ${
                  alerts.length > 0 
                    ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-professional-lg' 
                    : 'glass text-slate-600 hover:bg-white/60'
                }`}
              >
                <Bell className="h-5 w-5" />
                <span className="font-bold">{alerts.length}</span>
                {alerts.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></span>
                )}
              </button>
              
              {/* Date Selector */}
              <div className="flex items-center space-x-3 glass rounded-xl px-4 py-3 shadow-professional">
                <Calendar className="h-5 w-5 text-blue-600" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="border-0 bg-transparent text-sm font-semibold text-slate-700 focus:ring-0 focus:outline-none"
                  max={format(new Date(), 'yyyy-MM-dd')}
                  min={format(subDays(new Date(), 30), 'yyyy-MM-dd')}
                />
              </div>
              
              {/* Export Button */}
              {digest && (
                <button
                  onClick={exportToPDF}
                  className="btn-primary flex items-center space-x-2 hover-lift"
                >
                  <Download className="h-5 w-5" />
                  <span>Official Report</span>
                  <Star className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {isProcessing ? (
          <div className="glass rounded-3xl shadow-professional-lg border border-blue-200/30 p-12">
            <LoadingSpinner 
              message={processingStatus?.step} 
              progress={processingStatus?.progress}
            />
          </div>
        ) : digest ? (
          <div className="space-y-8">
            {/* Critical Alerts Section */}
            {showAlerts && alerts.length > 0 && (
              <div className="animate-pulse-professional">
                <AlertsPanel alerts={alerts} onDismissAlert={dismissAlert} />
              </div>
            )}

            {/* Executive Dashboard Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="glass rounded-2xl shadow-professional p-6 hover-lift border border-blue-200/30">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg">
                    <FileText className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-slate-800">{digest.totalArticles}</p>
                    <p className="text-sm text-slate-600 font-semibold">News Articles</p>
                    <p className="text-xs font-bold text-emerald-600">
                      {digest.weeklyComparison.articlesChange > 0 ? '+' : ''}
                      {digest.weeklyComparison.articlesChange}% vs last week
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="glass rounded-2xl shadow-professional p-6 hover-lift border border-emerald-200/30">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg">
                    <TrendingUp className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-slate-800">{digest.relevantArticles}</p>
                    <p className="text-sm text-slate-600 font-semibold">Relevant Articles</p>
                    <p className="text-xs font-bold text-slate-600">
                      {Math.round((digest.relevantArticles / digest.totalArticles) * 100)}% relevance rate
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="glass rounded-2xl shadow-professional p-6 hover-lift border border-purple-200/30">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
                    <BarChart3 className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-slate-800">{digest.topicClusters.length}</p>
                    <p className="text-sm text-slate-600 font-semibold">Topic Clusters</p>
                    <p className="text-xs font-bold text-red-600">
                      {digest.topicClusters.filter(c => c.priority === 'high').length} high priority
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="glass rounded-2xl shadow-professional p-6 hover-lift border border-orange-200/30">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg">
                    <MapPin className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-slate-800">{digest.districts.length}</p>
                    <p className="text-sm text-slate-600 font-semibold">AP Districts</p>
                    <p className="text-xs font-bold text-slate-600">
                      Focus: {digest.weeklyComparison.topDistricts[0]}
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass rounded-2xl shadow-professional p-6 hover-lift border border-indigo-200/30">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                    <Bookmark className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-slate-800">{bookmarkedClusters.length}</p>
                    <p className="text-sm text-slate-600 font-semibold">Bookmarked</p>
                    <p className="text-xs font-bold text-slate-600">
                      {archivedClusters.length} archived
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Intelligence Widgets */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {digest.weatherImpact && (
                <WeatherWidget weather={digest.weatherImpact} />
              )}
              <AnalyticsChart data={generateMockAnalytics()} />
              <QuickActions 
                onExportPDF={exportToPDF}
                onScheduleReport={scheduleReport}
                onShareDigest={shareDigest}
              />
            </div>

            {/* Advanced Filters & Search */}
            <div className="glass rounded-2xl shadow-professional border border-blue-200/30 p-6">
              <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-6 items-center">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg">
                    <Filter className="h-5 w-5 text-blue-600" />
                  </div>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as any)}
                    className="border border-blue-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 glass font-semibold shadow-sm"
                  >
                    <option value="all">All Priority Levels</option>
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-4 flex-1">
                  <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg">
                    <Search className="h-5 w-5 text-blue-600" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search operations, districts, or keywords..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-blue-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex-1 glass font-semibold shadow-sm"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-3 rounded-xl transition-all duration-300 ${
                      viewMode === 'grid' 
                        ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-professional-lg' 
                        : 'glass text-slate-600 hover:bg-white/60'
                    }`}
                  >
                    <Grid className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-3 rounded-xl transition-all duration-300 ${
                      viewMode === 'list' 
                        ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-professional-lg' 
                        : 'glass text-slate-600 hover:bg-white/60'
                    }`}
                  >
                    <List className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="flex items-center space-x-3 text-sm text-slate-600 glass rounded-xl px-4 py-3 shadow-sm">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="font-semibold">Generated: {format(new Date(digest.generatedAt), 'PPp')}</span>
                </div>
              </div>
            </div>

            {/* Intelligence Topic Clusters */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold gradient-text">
                  Intelligence Analysis ({filteredClusters.length})
                </h2>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-sm text-slate-600 glass rounded-xl px-4 py-2">
                    <Activity className="h-4 w-4 text-green-500" />
                    <span className="font-semibold">Live Analysis</span>
                  </div>
                  {bookmarkedClusters.length > 0 && (
                    <div className="flex items-center space-x-2 text-sm text-slate-600 glass rounded-xl px-4 py-2">
                      <Bookmark className="h-4 w-4 text-yellow-500" />
                      <span className="font-semibold">{bookmarkedClusters.length} Bookmarked</span>
                    </div>
                  )}
                </div>
              </div>
              
              {filteredClusters.length > 0 ? (
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' : 'space-y-4'}>
                  {filteredClusters.map((cluster) => (
                    <div key={cluster.id} className="relative">
                      <TopicClusterCard
                        cluster={cluster}
                        onViewDetails={setSelectedCluster}
                        viewMode={viewMode}
                        isBookmarked={bookmarkedClusters.includes(cluster.id)}
                        onToggleBookmark={() => toggleBookmark(cluster.id)}
                        onArchive={() => archiveCluster(cluster.id)}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="glass rounded-2xl shadow-professional border border-slate-200/30 p-12 text-center">
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-100 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                      <Search className="h-8 w-8 text-slate-400" />
                    </div>
                    <p className="text-slate-500 font-semibold text-lg">No clusters match your current filters</p>
                    <p className="text-slate-400 text-sm">Try adjusting your search criteria or priority filters</p>
                  </div>
                </div>
              )}
            </div>

            {/* Archived Clusters Section */}
            {archivedClusters.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-700">
                    Archived Clusters ({archivedClusters.length})
                  </h2>
                  <button
                    onClick={() => setArchivedClusters([])}
                    className="text-sm text-slate-500 hover:text-slate-700 font-semibold"
                  >
                    Clear All Archives
                  </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {digest.topicClusters
                    .filter(cluster => archivedClusters.includes(cluster.id))
                    .map((cluster) => (
                      <div key={cluster.id} className="glass rounded-xl p-4 opacity-60 hover:opacity-80 transition-opacity">
                        <div className="flex items-center space-x-2 mb-2">
                          <Archive className="h-4 w-4 text-slate-500" />
                          <h4 className="font-semibold text-slate-700 text-sm">{cluster.title}</h4>
                        </div>
                        <p className="text-xs text-slate-600">{cluster.summary.substring(0, 100)}...</p>
                        <button
                          onClick={() => setArchivedClusters(prev => prev.filter(id => id !== cluster.id))}
                          className="text-xs text-blue-600 hover:text-blue-800 mt-2 font-semibold"
                        >
                          Restore
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="glass rounded-2xl shadow-professional border border-slate-200/30 p-12 text-center">
            <div className="space-y-4">
              <div className="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-slate-500 font-semibold text-lg">Select a date to analyze AP State Police news feeds</p>
              <p className="text-slate-400 text-sm">Choose a date from the calendar above to begin intelligence analysis</p>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Detail Modal */}
      {selectedCluster && (
        <DetailModal
          cluster={selectedCluster}
          onClose={() => setSelectedCluster(null)}
          isBookmarked={bookmarkedClusters.includes(selectedCluster.id)}
          onToggleBookmark={() => toggleBookmark(selectedCluster.id)}
        />
      )}

      {/* Share Modal */}
      {showShareModal && digest && (
        <ShareModal
          digest={digest}
          onClose={() => setShowShareModal(false)}
        />
      )}

      {/* Schedule Modal */}
      {showScheduleModal && (
        <ScheduleModal
          onClose={() => setShowScheduleModal(false)}
          onSchedule={(schedule) => {
            console.log('Scheduled:', schedule);
            setShowScheduleModal(false);
            
            // Add notification
            const notification = {
              id: Date.now().toString(),
              title: 'Report Scheduled',
              message: `Report scheduled for ${schedule.frequency} delivery`,
              type: 'success',
              timestamp: new Date(),
              read: false
            };
            setNotifications(prev => [notification, ...prev.slice(0, 9)]);
          }}
        />
      )}

      {/* Notification Center */}
      {showNotifications && (
        <NotificationCenter
          notifications={notifications}
          onClose={() => setShowNotifications(false)}
          onMarkAsRead={markNotificationAsRead}
          onClearAll={clearAllNotifications}
        />
      )}
    </div>
  );
};