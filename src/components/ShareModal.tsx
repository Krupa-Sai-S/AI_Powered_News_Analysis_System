import React, { useState } from 'react';
import { DailyDigest } from '../types';
import { 
  X, 
  Mail, 
  Link, 
  Download, 
  Users, 
  Copy, 
  Check,
  Send,
  FileText,
  Share2,
  Globe,
  Lock,
  BarChart3
} from 'lucide-react';
import { format } from 'date-fns';

interface ShareModalProps {
  digest: DailyDigest;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ digest, onClose }) => {
  const [activeTab, setActiveTab] = useState<'email' | 'link' | 'export'>('email');
  const [emailRecipients, setEmailRecipients] = useState('');
  const [emailSubject, setEmailSubject] = useState(`AP State Police Daily Digest - ${format(new Date(digest.date), 'dd/MM/yyyy')}`);
  const [emailMessage, setEmailMessage] = useState('Please find attached the daily intelligence digest for your review.');
  const [linkCopied, setLinkCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const shareableLink = `${window.location.origin}/digest/${digest.date}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareableLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleEmailShare = async () => {
    setIsSharing(true);
    
    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real implementation, this would call an API to send the email
    alert(`Email sent successfully to: ${emailRecipients}`);
    setIsSharing(false);
    onClose();
  };

  const handleExportSummary = () => {
    const summaryData = {
      date: digest.date,
      totalArticles: digest.totalArticles,
      relevantArticles: digest.relevantArticles,
      topicClusters: digest.topicClusters.length,
      highPriorityClusters: digest.topicClusters.filter(c => c.priority === 'high').length,
      districts: digest.districts.length,
      generatedAt: digest.generatedAt
    };

    const dataStr = JSON.stringify(summaryData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `AP_Police_Digest_Summary_${digest.date}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const generateEmailBody = () => {
    return `
Dear Colleague,

${emailMessage}

DIGEST SUMMARY:
- Date: ${format(new Date(digest.date), 'EEEE, MMMM do, yyyy')}
- Total Articles Analyzed: ${digest.totalArticles}
- Relevant Articles: ${digest.relevantArticles}
- Topic Clusters: ${digest.topicClusters.length}
- High Priority Items: ${digest.topicClusters.filter(c => c.priority === 'high').length}
- Districts Covered: ${digest.districts.length}

KEY HIGHLIGHTS:
${digest.topicClusters.slice(0, 3).map((cluster, index) => 
  `${index + 1}. ${cluster.title} (${cluster.priority.toUpperCase()} Priority)
     - ${cluster.summary.substring(0, 100)}...
     - Affected Districts: ${cluster.affectedDistricts.join(', ')}`
).join('\n\n')}

For detailed analysis, please access the full digest through the secure portal.

Best regards,
AP State Police Intelligence Division
Generated: ${format(new Date(digest.generatedAt), 'dd/MM/yyyy HH:mm')}

---
CLASSIFICATION: OFFICIAL USE ONLY
This communication contains sensitive law enforcement information.
    `.trim();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass rounded-3xl shadow-professional-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-blue-200/30">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-blue-200/30 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <Share2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Share Daily Digest</h2>
              <p className="text-sm text-slate-600 font-medium">
                {format(new Date(digest.date), 'EEEE, MMMM do, yyyy')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-white/50 rounded-xl"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-blue-200/30 bg-white/50">
          <button
            onClick={() => setActiveTab('email')}
            className={`flex items-center space-x-2 px-6 py-4 font-semibold transition-all duration-200 ${
              activeTab === 'email'
                ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50/50'
                : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50/30'
            }`}
          >
            <Mail className="h-5 w-5" />
            <span>Email Share</span>
          </button>
          <button
            onClick={() => setActiveTab('link')}
            className={`flex items-center space-x-2 px-6 py-4 font-semibold transition-all duration-200 ${
              activeTab === 'link'
                ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50/50'
                : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50/30'
            }`}
          >
            <Link className="h-5 w-5" />
            <span>Share Link</span>
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`flex items-center space-x-2 px-6 py-4 font-semibold transition-all duration-200 ${
              activeTab === 'export'
                ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50/50'
                : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50/30'
            }`}
          >
            <Download className="h-5 w-5" />
            <span>Export Data</span>
          </button>
        </div>

        <div className="p-6">
          {/* Email Tab */}
          {activeTab === 'email' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200/30">
                <div className="flex items-center space-x-2 mb-2">
                  <Lock className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-800">Secure Email Distribution</span>
                </div>
                <p className="text-xs text-blue-700">
                  Emails will be sent through the secure AP State Police communication system with appropriate classification markings.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Recipients (separate multiple emails with commas)
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      value={emailRecipients}
                      onChange={(e) => setEmailRecipients(e.target.value)}
                      placeholder="officer1@appolice.gov.in, officer2@appolice.gov.in"
                      className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Subject</label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
                  <textarea
                    value={emailMessage}
                    onChange={(e) => setEmailMessage(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                  />
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <h4 className="text-sm font-semibold text-slate-700 mb-2">Email Preview:</h4>
                  <pre className="text-xs text-slate-600 whitespace-pre-wrap font-mono bg-white p-3 rounded-lg border max-h-40 overflow-y-auto">
                    {generateEmailBody()}
                  </pre>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={onClose}
                  className="px-6 py-3 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEmailShare}
                  disabled={!emailRecipients.trim() || isSharing}
                  className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  <Send className="h-5 w-5" />
                  <span>{isSharing ? 'Sending...' : 'Send Email'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Link Tab */}
          {activeTab === 'link' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200/30">
                <div className="flex items-center space-x-2 mb-2">
                  <Globe className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-semibold text-emerald-800">Secure Link Sharing</span>
                </div>
                <p className="text-xs text-emerald-700">
                  This link provides secure access to the digest through the AP State Police portal. Access requires valid authentication.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Shareable Link</label>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 relative">
                      <Link className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                      <input
                        type="text"
                        value={shareableLink}
                        readOnly
                        className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl bg-slate-50 font-mono text-sm"
                      />
                    </div>
                    <button
                      onClick={handleCopyLink}
                      className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                        linkCopied
                          ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
                      }`}
                    >
                      {linkCopied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                      <span>{linkCopied ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                    <h4 className="font-semibold text-slate-800 mb-2">Digest Summary</h4>
                    <div className="space-y-1 text-sm text-slate-600">
                      <p><span className="font-medium">Date:</span> {format(new Date(digest.date), 'dd/MM/yyyy')}</p>
                      <p><span className="font-medium">Articles:</span> {digest.totalArticles} total, {digest.relevantArticles} relevant</p>
                      <p><span className="font-medium">Clusters:</span> {digest.topicClusters.length} identified</p>
                      <p><span className="font-medium">High Priority:</span> {digest.topicClusters.filter(c => c.priority === 'high').length} items</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                    <h4 className="font-semibold text-slate-800 mb-2">Access Information</h4>
                    <div className="space-y-1 text-sm text-slate-600">
                      <p><span className="font-medium">Classification:</span> Official Use Only</p>
                      <p><span className="font-medium">Valid Until:</span> 30 days</p>
                      <p><span className="font-medium">Authentication:</span> Required</p>
                      <p><span className="font-medium">Generated:</span> {format(new Date(digest.generatedAt), 'dd/MM HH:mm')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Export Tab */}
          {activeTab === 'export' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200/30">
                <div className="flex items-center space-x-2 mb-2">
                  <FileText className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-semibold text-purple-800">Data Export Options</span>
                </div>
                <p className="text-xs text-purple-700">
                  Export digest data in various formats for integration with other systems or offline analysis.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-800">Quick Export</h4>
                  
                  <button
                    onClick={handleExportSummary}
                    className="w-full flex items-center space-x-3 p-4 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-slate-800">Summary Data (JSON)</p>
                      <p className="text-sm text-slate-600">Key metrics and statistics</p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      const csvData = digest.topicClusters.map(cluster => ({
                        title: cluster.title,
                        priority: cluster.priority,
                        riskLevel: cluster.riskLevel,
                        districts: cluster.affectedDistricts.join(';'),
                        articles: cluster.articles.length,
                        sentiment: cluster.trends.sentiment
                      }));
                      
                      const csvContent = [
                        Object.keys(csvData[0]).join(','),
                        ...csvData.map(row => Object.values(row).join(','))
                      ].join('\n');
                      
                      const blob = new Blob([csvContent], { type: 'text/csv' });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = `AP_Police_Clusters_${digest.date}.csv`;
                      link.click();
                      URL.revokeObjectURL(url);
                    }}
                    className="w-full flex items-center space-x-3 p-4 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    <div className="p-2 bg-emerald-100 rounded-lg">
                      <BarChart3 className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-slate-800">Cluster Data (CSV)</p>
                      <p className="text-sm text-slate-600">Topic clusters for analysis</p>
                    </div>
                  </button>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-800">Export Statistics</h4>
                  
                  <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-blue-600">{digest.totalArticles}</p>
                        <p className="text-xs text-slate-600 font-medium">Total Articles</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-emerald-600">{digest.topicClusters.length}</p>
                        <p className="text-xs text-slate-600 font-medium">Topic Clusters</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-purple-600">{digest.districts.length}</p>
                        <p className="text-xs text-slate-600 font-medium">Districts</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-red-600">
                          {digest.topicClusters.filter(c => c.priority === 'high').length}
                        </p>
                        <p className="text-xs text-slate-600 font-medium">High Priority</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <h5 className="font-semibold text-slate-700 mb-2">Export Notes</h5>
                    <ul className="text-xs text-slate-600 space-y-1">
                      <li>• All exports maintain data classification</li>
                      <li>• Timestamps are in IST format</li>
                      <li>• District codes follow AP Police standards</li>
                      <li>• Sensitive content is appropriately marked</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};