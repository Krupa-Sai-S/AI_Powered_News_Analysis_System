import React from 'react';
import { TopicCluster } from '../types';
import { X, Calendar, MapPin, TrendingUp, ExternalLink, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface DetailModalProps {
  cluster: TopicCluster;
  onClose: () => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({ cluster, onClose }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-semibold text-gray-900">{cluster.title}</h2>
            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(cluster.priority)}`}>
              {cluster.priority.toUpperCase()}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Summary</h3>
            <p className="text-gray-700 leading-relaxed">{cluster.summary}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <MapPin className="h-4 w-4 text-gray-600" />
                <h4 className="font-medium text-gray-900">Affected Districts</h4>
              </div>
              <div className="flex flex-wrap gap-1">
                {cluster.affectedDistricts.map((district, index) => (
                  <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                    {district}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-4 w-4 text-gray-600" />
                <h4 className="font-medium text-gray-900">Sentiment Analysis</h4>
              </div>
              <p className="text-sm text-gray-700 capitalize">{cluster.trends.sentiment}</p>
              <p className="text-xs text-gray-500 mt-1">{cluster.trends.coverage}% coverage</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <ExternalLink className="h-4 w-4 text-gray-600" />
                <h4 className="font-medium text-gray-900">Sources</h4>
              </div>
              <div className="space-y-1">
                {cluster.trends.sources.map((source, index) => (
                  <p key={index} className="text-xs text-gray-600">{source}</p>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Current Articles ({cluster.articles.length})</h3>
            <div className="space-y-3">
              {cluster.articles.map((article, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900 flex-1">{article.title}</h4>
                    <div className="flex items-center space-x-2 ml-4">
                      <span className="text-xs text-gray-500">{article.source}</span>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {article.relevanceScore}% relevant
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{article.content}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span>{format(new Date(article.publishedAt), 'PPp')}</span>
                      <span>{article.district}</span>
                      <span className="capitalize">{article.category}</span>
                    </div>
                    <div className="flex space-x-1">
                      {article.keywords.map((keyword, kidx) => (
                        <span key={kidx} className="px-1 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {cluster.relatedArticles.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Clock className="h-4 w-4 text-gray-600" />
                <h3 className="text-lg font-medium text-gray-900">Related Articles (Last 7 Days)</h3>
              </div>
              <div className="space-y-3">
                {cluster.relatedArticles.map((article, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-800 flex-1">{article.title}</h4>
                      <div className="flex items-center space-x-2 ml-4">
                        <span className="text-xs text-gray-500">{article.source}</span>
                        <span className="text-xs text-gray-500">
                          {format(new Date(article.publishedAt), 'MMM dd')}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{article.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};