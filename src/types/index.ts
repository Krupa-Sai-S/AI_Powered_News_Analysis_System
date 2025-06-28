export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  source: string;
  publishedAt: string;
  url: string;
  relevanceScore: number;
  district: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  keywords: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  crimeTags?: string[];
  officersInvolved?: string[];
}

export interface TopicCluster {
  id: string;
  title: string;
  articles: NewsArticle[];
  summary: string;
  priority: 'high' | 'medium' | 'low';
  affectedDistricts: string[];
  relatedArticles: NewsArticle[];
  trends: {
    sentiment: 'positive' | 'neutral' | 'negative';
    coverage: number;
    sources: string[];
    weeklyTrend: 'increasing' | 'decreasing' | 'stable';
  };
  actionItems?: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface DailyDigest {
  date: string;
  totalArticles: number;
  relevantArticles: number;
  topicClusters: TopicCluster[];
  districts: string[];
  generatedAt: string;
  weeklyComparison: {
    articlesChange: number;
    priorityDistribution: Record<string, number>;
    topDistricts: string[];
  };
  alerts: Alert[];
  weatherImpact?: WeatherImpact;
}

export interface ProcessingStatus {
  step: string;
  progress: number;
  isComplete: boolean;
  error?: string;
}

export interface Alert {
  id: string;
  type: 'breaking' | 'pattern' | 'escalation' | 'weather';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  districts: string[];
  timestamp: string;
  actionRequired: boolean;
}

export interface WeatherImpact {
  condition: string;
  temperature: number;
  description: string;
  crimeCorrelation: 'high' | 'medium' | 'low';
  recommendations: string[];
}

export interface UserPreferences {
  favoriteDistricts: string[];
  alertTypes: string[];
  emailNotifications: boolean;
  priorityFilter: string[];
  dashboardLayout: 'compact' | 'detailed';
}

export interface AnalyticsData {
  crimePatterns: {
    timeOfDay: Record<string, number>;
    dayOfWeek: Record<string, number>;
    monthlyTrend: Record<string, number>;
  };
  districtComparison: Record<string, {
    totalIncidents: number;
    priorityBreakdown: Record<string, number>;
    trend: 'up' | 'down' | 'stable';
  }>;
  sourceReliability: Record<string, number>;
}