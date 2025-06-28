import { NewsArticle, TopicCluster, DailyDigest } from '../types';
import { format, subDays } from 'date-fns';

const mockSources = ['The Tribune', 'Daily Herald', 'Metro News', 'City Chronicle', 'Regional Times'];
const mockDistricts = ['Downtown', 'North District', 'South District', 'East District', 'West District'];
const mockCategories = ['Crime', 'Traffic', 'Public Safety', 'Community Events', 'Emergency Response', 'Investigation'];

const generateMockArticle = (id: string, date: Date): NewsArticle => {
  const titles = [
    'Traffic Incident Causes Major Delays on Highway 101',
    'Community Policing Initiative Shows Positive Results',
    'Drug Investigation Leads to Multiple Arrests',
    'Emergency Response Training Exercise Scheduled',
    'Neighborhood Watch Program Expands Coverage',
    'Vehicle Theft Ring Dismantled After Joint Operation',
    'Public Safety Meeting Addresses Community Concerns',
    'New Technology Enhances Crime Scene Investigation',
    'Youth Outreach Program Celebrates Success Stories',
    'Cybersecurity Awareness Campaign Launched'
  ];

  const contents = [
    'Comprehensive analysis reveals significant patterns in recent incidents requiring coordinated response from multiple units.',
    'Community engagement initiatives demonstrate measurable improvement in public safety metrics across affected areas.',
    'Investigation spanning multiple jurisdictions results in coordinated arrests and seizure of illegal substances.',
    'Specialized training programs enhance department capabilities in emergency response and crisis management.',
    'Collaborative community programs strengthen relationships between law enforcement and local residents.',
    'Multi-agency operation successfully targets organized criminal activity affecting regional security.',
    'Public forums provide valuable feedback on safety concerns and department priorities.',
    'Advanced investigative tools improve evidence collection and case resolution rates.',
    'Educational outreach programs create positive interactions with community youth.',
    'Cybersecurity initiatives protect citizens from digital threats and online fraud.'
  ];

  return {
    id,
    title: titles[Math.floor(Math.random() * titles.length)],
    content: contents[Math.floor(Math.random() * contents.length)],
    source: mockSources[Math.floor(Math.random() * mockSources.length)],
    publishedAt: format(date, 'yyyy-MM-dd HH:mm:ss'),
    url: `https://example.com/article/${id}`,
    relevanceScore: Math.floor(Math.random() * 40) + 60,
    district: mockDistricts[Math.floor(Math.random() * mockDistricts.length)],
    category: mockCategories[Math.floor(Math.random() * mockCategories.length)],
    priority: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as 'high' | 'medium' | 'low',
    keywords: ['incident', 'investigation', 'community', 'safety', 'response'].slice(0, Math.floor(Math.random() * 3) + 2),
    sentiment: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)] as 'positive' | 'neutral' | 'negative'
  };
};

const generateTopicCluster = (articles: NewsArticle[]): TopicCluster => {
  const clusterTitles = [
    'Traffic Safety Operations',
    'Community Engagement Initiatives',
    'Criminal Investigation Updates',
    'Emergency Response Activities',
    'Public Safety Measures',
    'Technology Implementation',
    'Inter-agency Cooperation',
    'Training and Development'
  ];

  const summaries = [
    'Coordinated efforts across multiple districts addressing traffic safety concerns with measurable improvements in incident response times.',
    'Community outreach programs demonstrate positive engagement between law enforcement and local residents.',
    'Ongoing investigations reveal patterns requiring enhanced surveillance and coordinated response strategies.',
    'Emergency preparedness exercises and real-world responses showcase department capabilities and areas for improvement.',
    'Proactive measures implemented to enhance public safety infrastructure and community protection protocols.',
    'Technology integration improves operational efficiency and evidence management across departments.',
    'Multi-jurisdiction collaboration enhances resource sharing and coordinated response capabilities.',
    'Professional development initiatives strengthen officer capabilities and community relations.'
  ];

  return {
    id: `cluster-${Date.now()}-${Math.random()}`,
    title: clusterTitles[Math.floor(Math.random() * clusterTitles.length)],
    articles: articles.slice(0, Math.floor(Math.random() * 4) + 2),
    summary: summaries[Math.floor(Math.random() * summaries.length)],
    priority: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as 'high' | 'medium' | 'low',
    affectedDistricts: [...new Set(articles.map(a => a.district))].slice(0, Math.floor(Math.random() * 3) + 1),
    relatedArticles: articles.slice(0, Math.floor(Math.random() * 3) + 1),
    trends: {
      sentiment: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)] as 'positive' | 'neutral' | 'negative',
      coverage: Math.floor(Math.random() * 50) + 25,
      sources: [...new Set(articles.map(a => a.source))].slice(0, 3)
    }
  };
};

export const generateMockDigest = (date: Date): DailyDigest => {
  // Generate articles for the current date and previous 7 days
  const allArticles: NewsArticle[] = [];
  for (let i = 0; i < 8; i++) {
    const currentDate = subDays(date, i);
    const articlesPerDay = Math.floor(Math.random() * 20) + 15;
    
    for (let j = 0; j < articlesPerDay; j++) {
      allArticles.push(generateMockArticle(`${format(currentDate, 'yyyy-MM-dd')}-${j}`, currentDate));
    }
  }

  // Filter relevant articles (relevance score > 70)
  const relevantArticles = allArticles.filter(article => 
    format(new Date(article.publishedAt), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd') && 
    article.relevanceScore > 70
  );

  // Create topic clusters
  const clusters: TopicCluster[] = [];
  const clusterCount = Math.floor(relevantArticles.length / 4) + 1;
  
  for (let i = 0; i < clusterCount && i < 8; i++) {
    const startIndex = i * 4;
    const clusterArticles = relevantArticles.slice(startIndex, startIndex + 4);
    if (clusterArticles.length > 0) {
      const cluster = generateTopicCluster(clusterArticles);
      // Add related articles from previous 7 days
      cluster.relatedArticles = allArticles
        .filter(a => format(new Date(a.publishedAt), 'yyyy-MM-dd') !== format(date, 'yyyy-MM-dd'))
        .filter(a => a.category === clusterArticles[0]?.category)
        .slice(0, 3);
      clusters.push(cluster);
    }
  }

  return {
    date: format(date, 'yyyy-MM-dd'),
    totalArticles: allArticles.filter(a => format(new Date(a.publishedAt), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')).length,
    relevantArticles: relevantArticles.length,
    topicClusters: clusters,
    districts: mockDistricts,
    generatedAt: new Date().toISOString()
  };
};