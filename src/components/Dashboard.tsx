import React, { useState, useEffect } from 'react';
import { DailyDigest, ProcessingStatus, TopicCluster, Alert } from '../types';
import { generateMockDigest, generateMockAlerts, generateMockWeather, generateMockAnalytics } from '../utils/mockData';
import { generateProfessionalReport } from '../utils/pdfGenerator';
import { LoadingSpinner } from './LoadingSpinner';
import { TopicClusterCard } from './TopicClusterCard';
import { DetailModal } from './DetailModal';
import { AlertsPanel } from './AlertsPanel';
import { WeatherWidget } from './WeatherWidget';
import { AnalyticsChart } from './AnalyticsChart';
import { QuickActions } from './QuickActions';
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
  Eye
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
    setIsProcessing(false);
    setProcessingStatus(null);
  };

  useEffect(() => {
    processNewsFeed(selectedDate);
  }, [selectedDate]);

  const filteredClusters = digest?.topicClusters.filter(cluster => {
    const matchesPriority = filter === 'all' || cluster.priority === filter;
    const matchesSearch = searchTerm === '' || 
      cluster.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cluster.summary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesPriority && matchesSearch;
  }) || [];

  const exportToPDF = () => {
    if (!digest) return;
    generateProfessionalReport(digest, alerts);
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
  };

  const scheduleReport = () => {
    alert('Report scheduling feature would be implemented here');
  };

  const shareDigest = () => {
    alert('Digest sharing feature would be implemented here');
  };

  const refreshData = () => {
    processNewsFeed(selectedDate);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Professional Header */}
      <div className="glass shadow-professional-lg border-b border-blue-200/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              {/* Official Logo Area */}
              <div className="relative">
                <div className="p-4 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800 rounded-2xl shadow-professional-lg">
                  <Shield className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white status-indicator status-active"></div>
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
                    <span>Real-time Monitoring</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Users className="h-3 w-3" />
                    <span>12 Districts</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Eye className="h-3 w-3" />
                    <span>24/7 Operations</span>
                  </span>
                </div>
              </div>
            </div>
            
            {/* Action Controls */}
            <div className="flex items-center space-x-4">
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
              
              {/* Refresh Control */}
              <button
                onClick={refreshData}
                className="flex items-center space-x-2 glass hover:bg-white/60 text-slate-700 px-4 py-3 rounded-xl transition-all duration-300 font-semibold shadow-professional hover-lift"
              >
                <RefreshCw className="h-5 w-5" />
                <span>Refresh</span>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <div className="flex items-center space-x-2 text-sm text-slate-600 glass rounded-xl px-4 py-2">
                  <Activity className="h-4 w-4 text-green-500" />
                  <span className="font-semibold">Live Analysis</span>
                </div>
              </div>
              
              {filteredClusters.length > 0 ? (
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 gap-6' : 'space-y-4'}>
                  {filteredClusters.map((cluster) => (
                    <TopicClusterCard
                      key={cluster.id}
                      cluster={cluster}
                      onViewDetails={setSelectedCluster}
                      viewMode={viewMode}
                    />
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
        />
      )}
    </div>
  );
};