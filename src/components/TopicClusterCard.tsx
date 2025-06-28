import React from 'react';
import { TopicCluster } from '../types';
import { AlertTriangle, TrendingUp, Users, Clock, ExternalLink, Shield, Activity, Bookmark, Archive, MoreVertical } from 'lucide-react';
import { useState } from 'react';

interface TopicClusterCardProps {
  cluster: TopicCluster;
  onViewDetails: (cluster: TopicCluster) => void;
  viewMode?: 'grid' | 'list';
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
  onArchive?: () => void;
}

export const TopicClusterCard: React.FC<TopicClusterCardProps> = ({ 
  cluster, 
  onViewDetails, 
  viewMode = 'grid',
  isBookmarked = false,
  onToggleBookmark,
  onArchive
}) => {
  const [showActions, setShowActions] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-200';
      case 'medium': return 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 border-emerald-200';
      default: return 'bg-gradient-to-r from-slate-100 to-gray-100 text-slate-800 border-slate-200';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'critical': return 'bg-gradient-to-r from-red-600 to-pink-600 text-white';
      case 'high': return 'bg-gradient-to-r from-red-500 to-pink-500 text-white';
      case 'medium': return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white';
      case 'low': return 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white';
      default: return 'bg-gradient-to-r from-slate-500 to-gray-500 text-white';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-emerald-600';
      case 'negative': return 'text-red-600';
      case 'neutral': return 'text-slate-600';
      default: return 'text-slate-600';
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
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-indigo-100 p-4 hover:shadow-xl transition-all duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className="flex items-center space-x-2">
              {isBookmarked && <Bookmark className="h-4 w-4 text-yellow-500 fill-current" />}
              <h3 className="text-lg font-semibold text-slate-800">{cluster.title}</h3>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full border shadow-sm ${getPriorityColor(cluster.priority)}`}>
                {cluster.priority.toUpperCase()}
              </span>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${getRiskColor(cluster.riskLevel)}`}>
                {cluster.riskLevel.toUpperCase()}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-slate-600">
            <div className="flex items-center space-x-1">
              <ExternalLink className="h-4 w-4" />
              <span className="font-medium">{cluster.articles.length}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span className="font-medium">{cluster.affectedDistricts.length}</span>
            </div>
            <div className="flex items-center space-x-1">
              <TrendingUp className={`h-4 w-4 ${getSentimentColor(cluster.trends.sentiment)}`} />
              <span>{getTrendIcon(cluster.trends.weeklyTrend)}</span>
            </div>
            
            {/* Action Menu */}
            <div className="relative">
              <button
                onClick={() => setShowActions(!showActions)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
              
              {showActions && (
                <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-10 min-w-[150px]">
                  <button
                    onClick={() => {
                      onToggleBookmark?.();
                      setShowActions(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 flex items-center space-x-2"
                  >
                    <Bookmark className={`h-4 w-4 ${isBookmarked ? 'text-yellow-500 fill-current' : 'text-slate-400'}`} />
                    <span>{isBookmarked ? 'Remove Bookmark' : 'Bookmark'}</span>
                  </button>
                  <button
                    onClick={() => {
                      onArchive?.();
                      setShowActions(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 flex items-center space-x-2"
                  >
                    <Archive className="h-4 w-4 text-slate-400" />
                    <span>Archive</span>
                  </button>
                </div>
              )}
            </div>
            
            <button
              onClick={() => onViewDetails(cluster)}
              className="text-indigo-600 hover:text-purple-600 font-semibold transition-colors bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-lg"
            >
              View Details →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-indigo-100 p-6 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 relative">
      {/* Bookmark indicator */}
      {isBookmarked && (
        <div className="absolute top-4 right-4">
          <Bookmark className="h-5 w-5 text-yellow-500 fill-current" />
        </div>
      )}
      
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 pr-8">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-slate-800">{cluster.title}</h3>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full border shadow-sm ${getPriorityColor(cluster.priority)}`}>
              {cluster.priority.toUpperCase()}
            </span>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${getRiskColor(cluster.riskLevel)}`}>
              {cluster.riskLevel.toUpperCase()}
            </span>
          </div>
          <p className="text-sm text-slate-600 mb-3 font-medium leading-relaxed">{cluster.summary}</p>
        </div>
        <div className="flex flex-col items-center space-y-2">
          {cluster.priority === 'high' && (
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
            </div>
          )}
          {cluster.riskLevel === 'critical' && (
            <div className="p-2 bg-red-100 rounded-lg">
              <Shield className="h-5 w-5 text-red-600 flex-shrink-0" />
            </div>
          )}
          
          {/* Action Menu */}
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <MoreVertical className="h-4 w-4 text-slate-400" />
            </button>
            
            {showActions && (
              <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-10 min-w-[150px]">
                <button
                  onClick={() => {
                    onToggleBookmark?.();
                    setShowActions(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 flex items-center space-x-2"
                >
                  <Bookmark className={`h-4 w-4 ${isBookmarked ? 'text-yellow-500 fill-current' : 'text-slate-400'}`} />
                  <span>{isBookmarked ? 'Remove Bookmark' : 'Bookmark'}</span>
                </button>
                <button
                  onClick={() => {
                    onArchive?.();
                    setShowActions(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 flex items-center space-x-2"
                >
                  <Archive className="h-4 w-4 text-slate-400" />
                  <span>Archive</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="flex items-center space-x-2 bg-slate-50 rounded-lg p-2">
          <ExternalLink className="h-4 w-4 text-indigo-500" />
          <span className="text-sm text-slate-700 font-medium">{cluster.articles.length} articles</span>
        </div>
        <div className="flex items-center space-x-2 bg-slate-50 rounded-lg p-2">
          <Users className="h-4 w-4 text-indigo-500" />
          <span className="text-sm text-slate-700 font-medium">{cluster.affectedDistricts.length} districts</span>
        </div>
        <div className="flex items-center space-x-2 bg-slate-50 rounded-lg p-2">
          <TrendingUp className={`h-4 w-4 ${getSentimentColor(cluster.trends.sentiment)}`} />
          <span className={`text-sm font-medium ${getSentimentColor(cluster.trends.sentiment)}`}>
            {cluster.trends.sentiment}
          </span>
        </div>
        <div className="flex items-center space-x-2 bg-slate-50 rounded-lg p-2">
          <Activity className="h-4 w-4 text-indigo-500" />
          <span className="text-sm text-slate-700 font-medium">{getTrendIcon(cluster.trends.weeklyTrend)} {cluster.trends.weeklyTrend}</span>
        </div>
      </div>

      {cluster.actionItems && cluster.actionItems.length > 0 && (
        <div className="mb-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
          <h4 className="text-sm font-semibold text-indigo-900 mb-2">Recommended Actions:</h4>
          <ul className="text-xs text-indigo-800 space-y-1">
            {cluster.actionItems.slice(0, 2).map((action, index) => (
              <li key={index} className="flex items-start space-x-1">
                <span className="text-indigo-600 mt-0.5 font-bold">•</span>
                <span className="font-medium">{action}</span>
              </li>
            ))}
            {cluster.actionItems.length > 2 && (
              <li className="text-indigo-600 font-semibold">+{cluster.actionItems.length - 2} more actions</li>
            )}
          </ul>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {cluster.affectedDistricts.slice(0, 3).map((district, index) => (
            <span key={index} className="px-3 py-1 text-xs bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-lg font-medium shadow-sm">
              {district}
            </span>
          ))}
          {cluster.affectedDistricts.length > 3 && (
            <span className="px-3 py-1 text-xs bg-slate-100 text-slate-600 rounded-lg font-medium">
              +{cluster.affectedDistricts.length - 3} more
            </span>
          )}
        </div>
        <button
          onClick={() => onViewDetails(cluster)}
          className="text-indigo-600 hover:text-purple-600 text-sm font-semibold transition-colors bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 px-4 py-2 rounded-xl shadow-sm"
        >
          View Details →
        </button>
      </div>
    </div>
  );
};