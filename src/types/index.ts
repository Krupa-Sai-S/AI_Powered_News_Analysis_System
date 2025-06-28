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
  };
}

export interface DailyDigest {
  date: string;
  totalArticles: number;
  relevantArticles: number;
  topicClusters: TopicCluster[];
  districts: string[];
  generatedAt: string;
}

export interface ProcessingStatus {
  step: string;
  progress: number;
  isComplete: boolean;
  error?: string;
}