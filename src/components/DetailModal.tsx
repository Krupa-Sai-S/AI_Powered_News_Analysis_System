import React from 'react';
import { TopicCluster } from '../types';
import { X, Calendar, MapPin, TrendingUp, ExternalLink, Clock, Bookmark, Share2, Download } from 'lucide-react';
import { format } from 'date-fns';

interface DetailModalProps {
  cluster: TopicCluster;
  onClose: () => void;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({ 
  cluster, 
  onClose, 
  isBookmarked = false, 
  onToggleBookmark 
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-200';
      case 'medium': return 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 border-emerald-200';
      default: return 'bg-gradient-to-r from-slate-100 to-gray-100 text-slate-800 border-slate-200';
    }
  };

  const exportClusterData = () => {
    const data = {
      cluster: cluster.title,
      priority: cluster.priority,
      riskLevel: cluster.riskLevel,
      summary: cluster.summary,
      affectedDistricts: cluster.affectedDistricts,
      articles: cluster.articles.map(article => ({
        title: article.title,
        source: article.source,
        publishedAt: article.publishedAt,
        relevanceScore: article.relevanceScore,
        district: article.district
      })),
      actionItems: cluster.actionItems,
      trends: cluster.trends
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cluster_${cluster.id}_${format(new Date(), 'yyyy-MM-dd')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const shareCluster = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: cluster.title,
          text: cluster.summary,
          url: window.location.href
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback to clipboard
      const shareText = `${cluster.title}\n\n${cluster.summary}\n\nAffected Districts: ${cluster.affectedDistricts.join(', ')}`;
      await navigator.clipboard.writeText(shareText);
      alert('Cluster details copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-indigo-100">
        <div className="flex items-center justify-between p-6 border-b border-indigo-100 bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-bold text-slate-800">{cluster.title}</h2>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full border shadow-sm ${getPriorityColor(cluster.priority)}`}>
              {cluster.priority.toUpperCase()}
            </span>
            {isBookmarked && (
              <Bookmark className="h-5 w-5 text-yellow-500 fill-current" />
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onToggleBookmark}
              className={`p-2 rounded-xl transition-colors ${
                isBookmarked 
                  ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              title={isBookmarked ? 'Remove Bookmark' : 'Bookmark'}
            >
              <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={shareCluster}
              className="p-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
              title="Share Cluster"
            >
              <Share2 className="h-5 w-5" />
            </button>
            <button
              onClick={exportClusterData}
              className="p-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
              title="Export Data"
            >
              <Download className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-white/50 rounded-xl"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Summary</h3>
            <p className="text-slate-700 leading-relaxed font-medium">{cluster.summary}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200">
              <div className="flex items-center space-x-2 mb-2">
                <MapPin className="h-4 w-4 text-indigo-600" />
                <h4 className="font-semibold text-slate-800">Affected Districts</h4>
              </div>
              <div className="flex flex-wrap gap-1">
                {cluster.affectedDistricts.map((district, index) => (
                  <span key={index} className="px-2 py-1 text-xs bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-lg font-medium">
                    {district}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-4 w-4 text-indigo-600" />
                <h4 className="font-semibold text-slate-800">Sentiment Analysis</h4>
              </div>
              <p className="text-sm text-slate-700 capitalize font-medium">{cluster.trends.sentiment}</p>
              <p className="text-xs text-slate-500 mt-1 font-medium">{cluster.trends.coverage}% coverage</p>
            </div>

            <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200">
              <div className="flex items-center space-x-2 mb-2">
                <ExternalLink className="h-4 w-4 text-indigo-600" />
                <h4 className="font-semibold text-slate-800">Sources</h4>
              </div>
              <div className="space-y-1">
                {cluster.trends.sources.map((source, index) => (
                  <p key={index} className="text-xs text-slate-600 font-medium">{source}</p>
                ))}
              </div>
            </div>
          </div>

          {cluster.actionItems && cluster.actionItems.length > 0 && (
            <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
              <h4 className="text-sm font-semibold text-indigo-900 mb-3">Recommended Actions:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {cluster.actionItems.map((action, index) => (
                  <div key={index} className="flex items-start space-x-2 bg-white/50 rounded-lg p-3">
                    <span className="text-indigo-600 mt-1 font-bold text-sm">{index + 1}.</span>
                    <span className="text-sm font-medium text-indigo-800">{action}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Current Articles ({cluster.articles.length})</h3>
            <div className="space-y-3">
              {cluster.articles.map((article, index) => (
                <div key={index} className="border border-indigo-200 rounded-xl p-4 bg-gradient-to-r from-white to-indigo-50">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-slate-800 flex-1">{article.title}</h4>
                    <div className="flex items-center space-x-2 ml-4">
                      <span className="text-xs text-slate-500 font-medium">{article.source}</span>
                      <span className="text-xs bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-2 py-1 rounded-lg font-semibold">
                        {article.relevanceScore}% relevant
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mb-2 font-medium">{article.content}</p>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center space-x-4">
                      <span className="font-medium">{format(new Date(article.publishedAt), 'PPp')}</span>
                      <span className="font-medium">{article.district}</span>
                      <span className="capitalize font-medium">{article.category}</span>
                    </div>
                    <div className="flex space-x-1">
                      {article.keywords.map((keyword, kidx) => (
                        <span key={kidx} className="px-1 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-medium">
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
                <Clock className="h-4 w-4 text-indigo-600" />
                <h3 className="text-lg font-semibold text-slate-800">Related Articles (Last 7 Days)</h3>
              </div>
              <div className="space-y-3">
                {cluster.relatedArticles.map((article, index) => (
                  <div key={index} className="border border-slate-200 rounded-xl p-4 bg-gradient-to-r from-slate-50 to-slate-100">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-slate-700 flex-1">{article.title}</h4>
                      <div className="flex items-center space-x-2 ml-4">
                        <span className="text-xs text-slate-500 font-medium">{article.source}</span>
                        <span className="text-xs text-slate-500 font-medium">
                          {format(new Date(article.publishedAt), 'MMM dd')}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 font-medium">{article.content}</p>
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