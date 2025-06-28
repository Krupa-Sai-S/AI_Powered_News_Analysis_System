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
  RefreshCw
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
      { step: 'Fetching news articles from sources...', progress: 15 },
      { step: 'Analyzing relevance to police operations...', progress: 30 },
      { step: 'Processing weather impact data...', progress: 45 },
      { step: 'Clustering articles by topic...', progress: 60 },
      { step: 'Generating comparative analysis...', progress: 75 },
      { step: 'Creating analytics and alerts...', progress: 90 },
      { step: 'Finalizing daily digest...', progress: 100 }
    ];

    for (const status of steps) {
      setProcessingStatus(status);
      await new Promise(resolve => setTimeout(resolve, 800));
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Police News Analysis
                </h1>
                <p className="text-sm text-slate-600 font-medium">AI-Powered Daily Digest System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowAlerts(!showAlerts)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  alerts.length > 0 
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Bell className="h-4 w-4" />
                <span>{alerts.length}</span>
              </button>
              <button
                onClick={refreshData}
                className="flex items-center space-x-2 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 px-4 py-2 rounded-xl hover:from-slate-200 hover:to-slate-300 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </button>
              <div className="flex items-center space-x-2 bg-white/70 backdrop-blur-sm rounded-xl px-4 py-2 shadow-sm border border-indigo-100">
                <Calendar className="h-4 w-4 text-indigo-600" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="border-0 bg-transparent text-sm font-medium text-slate-700 focus:ring-0 focus:outline-none"
                  max={format(new Date(), 'yyyy-MM-dd')}
                  min={format(subDays(new Date(), 30), 'yyyy-MM-dd')}
                />
              </div>
              {digest && (
                <button
                  onClick={exportToPDF}
                  className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Download className="h-4 w-4" />
                  <span>Professional Report</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isProcessing ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-indigo-100 p-8">
            <LoadingSpinner 
              message={processingStatus?.step} 
              progress={processingStatus?.progress}
            />
          </div>
        ) : digest ? (
          <div className="space-y-8">
            {/* Alerts Section */}
            {showAlerts && alerts.length > 0 && (
              <AlertsPanel alerts={alerts} onDismissAlert={dismissAlert} />
            )}

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-indigo-100 p-6 hover:shadow-xl transition-all duration-200">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-800">{digest.totalArticles}</p>
                    <p className="text-sm text-slate-600 font-medium">Total Articles</p>
                    <p className="text-xs text-emerald-600 font-semibold">
                      {digest.weeklyComparison.articlesChange > 0 ? '+' : ''}
                      {digest.weeklyComparison.articlesChange}% vs last week
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-indigo-100 p-6 hover:shadow-xl transition-all duration-200">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-800">{digest.relevantArticles}</p>
                    <p className="text-sm text-slate-600 font-medium">Relevant Articles</p>
                    <p className="text-xs text-slate-600 font-semibold">
                      {Math.round((digest.relevantArticles / digest.totalArticles) * 100)}% relevance rate
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-indigo-100 p-6 hover:shadow-xl transition-all duration-200">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-800">{digest.topicClusters.length}</p>
                    <p className="text-sm text-slate-600 font-medium">Topic Clusters</p>
                    <p className="text-xs text-red-600 font-semibold">
                      {digest.topicClusters.filter(c => c.priority === 'high').length} high priority
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-indigo-100 p-6 hover:shadow-xl transition-all duration-200">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-800">{digest.districts.length}</p>
                    <p className="text-sm text-slate-600 font-medium">Districts Covered</p>
                    <p className="text-xs text-slate-600 font-semibold">
                      Top: {digest.weeklyComparison.topDistricts[0]}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary Widgets Row */}
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

            {/* Filters and Search */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-indigo-100 p-6">
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 items-center">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg">
                    <Filter className="h-4 w-4 text-indigo-600" />
                  </div>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as any)}
                    className="border border-indigo-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white/70 backdrop-blur-sm font-medium"
                  >
                    <option value="all">All Priorities</option>
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-3 flex-1">
                  <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg">
                    <Search className="h-4 w-4 text-indigo-600" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search topics or keywords..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-indigo-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 flex-1 bg-white/70 backdrop-blur-sm font-medium"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-3 rounded-xl transition-all duration-200 ${
                      viewMode === 'grid' 
                        ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-3 rounded-xl transition-all duration-200 ${
                      viewMode === 'list' 
                        ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-slate-600 bg-white/50 rounded-xl px-4 py-2">
                  <Clock className="h-4 w-4 text-indigo-600" />
                  <span className="font-medium">Generated: {format(new Date(digest.generatedAt), 'PPp')}</span>
                </div>
              </div>
            </div>

            {/* Topic Clusters */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-800">
                Topic Clusters ({filteredClusters.length})
              </h2>
              
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
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-indigo-100 p-8 text-center">
                  <p className="text-slate-500 font-medium">No clusters match your current filters.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-indigo-100 p-8 text-center">
            <p className="text-slate-500 font-medium">Select a date to analyze news feeds.</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedCluster && (
        <DetailModal
          cluster={selectedCluster}
          onClose={() => setSelectedCluster(null)}
        />
      )}
    </div>
  );
};