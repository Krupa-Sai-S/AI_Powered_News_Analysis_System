import React from 'react';
import { TopicCluster } from '../types';
import { AlertTriangle, TrendingUp, Users, Clock, ExternalLink } from 'lucide-react';

interface TopicClusterCardProps {
  cluster: TopicCluster;
  onViewDetails: (cluster: TopicCluster) => void;
}

export const TopicClusterCard: React.FC<TopicClusterCardProps> = ({ cluster, onViewDetails }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{cluster.title}</h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(cluster.priority)}`}>
              {cluster.priority.toUpperCase()}
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-3">{cluster.summary}</p>
        </div>
        {cluster.priority === 'high' && (
          <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
        )}
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
          <Clock className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">{cluster.relatedArticles.length} related</span>
        </div>
      </div>

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