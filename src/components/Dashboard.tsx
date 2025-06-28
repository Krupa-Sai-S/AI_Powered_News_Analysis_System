import React, { useState, useEffect } from 'react';
import { DailyDigest, ProcessingStatus, TopicCluster, Alert } from '../types';
import { generateMockDigest, generateMockAlerts, generateMockWeather, generateMockAnalytics } from '../utils/mockData';
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
import { format, subDays } from 'date-fns';
import jsPDF from 'jspdf';

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

    const mockDigest = generateMockDigest(new Date(date));
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

    const pdf = new jsPDF();
    const pageHeight = pdf.internal.pageSize.height;
    let yPosition = 20;

    // Header
    pdf.setFontSize(20);
    pdf.text('Police Daily News Digest', 20, yPosition);
    yPosition += 10;
    
    pdf.setFontSize(12);
    pdf.text(`Date: ${format(new Date(digest.date), 'PPP')}`, 20, yPosition);
    yPosition += 5;
    pdf.text(`Generated: ${format(new Date(digest.generatedAt), 'PPp')}`, 20, yPosition);
    yPosition += 15;

    // Summary
    pdf.setFontSize(14);
    pdf.text('Summary', 20, yPosition);
    yPosition += 10;
    
    pdf.setFontSize(10);
    pdf.text(`Total Articles Processed: ${digest.totalArticles}`, 20, yPosition);
    yPosition += 5;
    pdf.text(`Relevant Articles: ${digest.relevantArticles}`, 20, yPosition);
    yPosition += 5;
    pdf.text(`Topic Clusters: ${digest.topicClusters.length}`, 20, yPosition);
    yPosition += 5;
    pdf.text(`Active Alerts: ${alerts.length}`, 20, yPosition);
    yPosition += 15;

    // Alerts Section
    if (alerts.length > 0) {
      pdf.setFontSize(14);
      pdf.text('Active Alerts', 20, yPosition);
      yPosition += 10;
      
      alerts.forEach((alert, index) => {
        if (yPosition > pageHeight - 30) {
          pdf.addPage();
          yPosition = 20;
        }
        
        pdf.setFontSize(10);
        pdf.text(`${index + 1}. ${alert.title} (${alert.priority.toUpperCase()})`, 20, yPosition);
        yPosition += 5;
        const descLines = pdf.splitTextToSize(alert.description, 170);
        pdf.text(descLines, 25, yPosition);
        yPosition += descLines.length * 5 + 5;
      });
      yPosition += 10;
    }

    // Topic Clusters
    pdf.setFontSize(14);
    pdf.text('Topic Clusters', 20, yPosition);
    yPosition += 10;

    digest.topicClusters.forEach((cluster, index) => {
      if (yPosition > pageHeight - 50) {
        pdf.addPage();
        yPosition = 20;
      }

      pdf.setFontSize(12);
      pdf.text(`${index + 1}. ${cluster.title}`, 20, yPosition);
      yPosition += 8;
      
      pdf.setFontSize(10);
      pdf.text(`Priority: ${cluster.priority.toUpperCase()} | Risk: ${cluster.riskLevel.toUpperCase()}`, 20, yPosition);
      yPosition += 5;
      pdf.text(`Districts: ${cluster.affectedDistricts.join(', ')}`, 20, yPosition);
      yPosition += 5;
      
      const summaryLines = pdf.splitTextToSize(cluster.summary, 170);
      pdf.text(summaryLines, 20, yPosition);
      yPosition += summaryLines.length * 5 + 10;
    });

    pdf.save(`police-digest-${digest.date}.pdf`);
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Police News Analysis</h1>
                <p className="text-sm text-gray-600">AI-Powered Daily Digest System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowAlerts(!showAlerts)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  alerts.length > 0 
                    ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Bell className="h-4 w-4" />
                <span>{alerts.length}</span>
              </button>
              <button
                onClick={refreshData}
                className="flex items-center space-x-2 bg-gray-100 text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </button>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  max={format(new Date(), 'yyyy-MM-dd')}
                  min={format(subDays(new Date(), 30), 'yyyy-MM-dd')}
                />
              </div>
              {digest && (
                <button
                  onClick={exportToPDF}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Export PDF</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isProcessing ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
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
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{digest.totalArticles}</p>
                    <p className="text-sm text-gray-600">Total Articles</p>
                    <p className="text-xs text-green-600">
                      {digest.weeklyComparison.articlesChange > 0 ? '+' : ''}
                      {digest.weeklyComparison.articlesChange}% vs last week
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{digest.relevantArticles}</p>
                    <p className="text-sm text-gray-600">Relevant Articles</p>
                    <p className="text-xs text-gray-600">
                      {Math.round((digest.relevantArticles / digest.totalArticles) * 100)}% relevance rate
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3">
                  <BarChart3 className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{digest.topicClusters.length}</p>
                    <p className="text-sm text-gray-600">Topic Clusters</p>
                    <p className="text-xs text-red-600">
                      {digest.topicClusters.filter(c => c.priority === 'high').length} high priority
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{digest.districts.length}</p>
                    <p className="text-sm text-gray-600">Districts Covered</p>
                    <p className="text-xs text-gray-600">
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
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 items-center">
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as any)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Priorities</option>
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-2 flex-1">
                  <Search className="h-4 w-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search topics or keywords..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex-1"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>Generated: {format(new Date(digest.generatedAt), 'PPp')}</span>
                </div>
              </div>
            </div>

            {/* Topic Clusters */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">
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
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                  <p className="text-gray-500">No clusters match your current filters.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <p className="text-gray-500">Select a date to analyze news feeds.</p>
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