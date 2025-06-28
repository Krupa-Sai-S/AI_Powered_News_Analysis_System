import React from 'react';
import { TopicCluster } from '../types';
import { AlertTriangle, TrendingUp, Users, Clock, ExternalLink, Shield, Activity } from 'lucide-react';

interface TopicClusterCardProps {
  cluster: TopicCluster;
  onViewDetails: (cluster: TopicCluster) => void;
  viewMode?: 'grid' | 'list';
}

export const TopicClusterCard: React.FC<TopicClusterCardProps> = ({ 
  cluster, 
  onViewDetails, 
  viewMode = 'grid' 
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-red-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      case 'neutral': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return '📈';
      case 'decreasing': return '📉';
      case 'stable': return '➡️';
      default: return '➡️';
    }
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold text-gray-900">{cluster.title}</h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(cluster.priority)}`}>
                {cluster.priority.toUpperCase()}
              </span>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRiskColor(cluster.riskLevel)}`}>
                {cluster.riskLevel.toUpperCase()}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <ExternalLink className="h-4 w-4" />
              <span>{cluster.articles.length}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{cluster.affectedDistricts.length}</span>
            </div>
            <div className="flex items-center space-x-1">
              <TrendingUp className={`h-4 w-4 ${getSentimentColor(cluster.trends.sentiment)}`} />
              <span>{getTrendIcon(cluster.trends.weeklyTrend)}</span>
            </div>
            <button
              onClick={() => onViewDetails(cluster)}
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              View Details →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{cluster.title}</h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(cluster.priority)}`}>
              {cluster.priority.toUpperCase()}
            </span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRiskColor(cluster.riskLevel)}`}>
              {cluster.riskLevel.toUpperCase()}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-3">{cluster.summary}</p>
        </div>
        <div className="flex flex-col items-center space-y-2">
          {cluster.priority === 'high' && (
            <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
          )}
          {cluster.riskLevel === 'critical' && (
            <Shield className="h-5 w-5 text-red-600 flex-shrink-0" />
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="flex items-center space-x-2">
          <ExternalLink className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">{cluster.articles.length} articles</span>
        </div>
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">{cluster.affectedDistricts.length} districts</span>
        </div>
        <div className="flex items-center space-x-2">
          <TrendingUp className={`h-4 w-4 ${getSentimentColor(cluster.trends.sentiment)}`} />
          <span className={`text-sm ${getSentimentColor(cluster.trends.sentiment)}`}>
            {cluster.trends.sentiment}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Activity className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">{getTrendIcon(cluster.trends.weeklyTrend)} {cluster.trends.weeklyTrend}</span>
        </div>
      </div>

      {cluster.actionItems && cluster.actionItems.length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Recommended Actions:</h4>
          <ul className="text-xs text-blue-800 space-y-1">
            {cluster.actionItems.slice(0, 2).map((action, index) => (
              <li key={index} className="flex items-start space-x-1">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>{action}</span>
              </li>
            ))}
            {cluster.actionItems.length > 2 && (
              <li className="text-blue-600 font-medium">+{cluster.actionItems.length - 2} more actions</li>
            )}
          </ul>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {cluster.affectedDistricts.slice(0, 3).map((district, index) => (
            <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
              {district}
            </span>
          ))}
          {cluster.affectedDistricts.length > 3 && (
            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
              +{cluster.affectedDistricts.length - 3} more
            </span>
          )}
        </div>
        <button
          onClick={() => onViewDetails(cluster)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
        >
          View Details →
        </button>
      </div>
    </div>
  );
};