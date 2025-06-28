import React, { useState, useEffect } from 'react';
import { DailyDigest, ProcessingStatus, TopicCluster } from '../types';
import { generateMockDigest } from '../utils/mockData';
import { LoadingSpinner } from './LoadingSpinner';
import { TopicClusterCard } from './TopicClusterCard';
import { DetailModal } from './DetailModal';
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
  Clock
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

  const processNewsFeed = async (date: string) => {
    setIsProcessing(true);
    setDigest(null);
    
    const steps = [
      { step: 'Fetching news articles from sources...', progress: 20 },
      { step: 'Analyzing relevance to police operations...', progress: 40 },
      { step: 'Clustering articles by topic...', progress: 60 },
      { step: 'Generating comparative analysis...', progress: 80 },
      { step: 'Finalizing daily digest...', progress: 100 }
    ];

    for (const status of steps) {
      setProcessingStatus(status);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    const mockDigest = generateMockDigest(new Date(date));
    setDigest(mockDigest);
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
    yPosition += 15;

    // Topic Clusters
    digest.topicClusters.forEach((cluster, index) => {
      if (yPosition > pageHeight - 50) {
        pdf.addPage();
        yPosition = 20;
      }

      pdf.setFontSize(14);
      pdf.text(`${index + 1}. ${cluster.title}`, 20, yPosition);
      yPosition += 8;
      
      pdf.setFontSize(10);
      pdf.text(`Priority: ${cluster.priority.toUpperCase()}`, 20, yPosition);
      yPosition += 5;
      pdf.text(`Districts: ${cluster.affectedDistricts.join(', ')}`, 20, yPosition);
      yPosition += 5;
      
      const summaryLines = pdf.splitTextToSize(cluster.summary, 170);
      pdf.text(summaryLines, 20, yPosition);
      yPosition += summaryLines.length * 5 + 10;
    });

    pdf.save(`police-digest-${digest.date}.pdf`);
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
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{digest.totalArticles}</p>
                    <p className="text-sm text-gray-600">Total Articles</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{digest.relevantArticles}</p>
                    <p className="text-sm text-gray-600">Relevant Articles</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3">
                  <BarChart3 className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{digest.topicClusters.length}</p>
                    <p className="text-sm text-gray-600">Topic Clusters</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{digest.districts.length}</p>
                    <p className="text-sm text-gray-600">Districts Covered</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredClusters.map((cluster) => (
                    <TopicClusterCard
                      key={cluster.id}
                      cluster={cluster}
                      onViewDetails={setSelectedCluster}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                  <p className="text-gray-500">No clusters match your current filters.</p>
                </div>
              )}
            </div>
          </>
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