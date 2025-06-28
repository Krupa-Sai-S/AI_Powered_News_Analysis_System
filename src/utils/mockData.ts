import { NewsArticle, TopicCluster, DailyDigest, Alert, WeatherImpact, AnalyticsData } from '../types';
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
    'Cybersecurity Awareness Campaign Launched',
    'Domestic Violence Cases Rise in Downtown Area',
    'Police Department Receives Federal Grant for Equipment',
    'Community Garden Project Reduces Vandalism',
    'Traffic Safety Campaign Targets School Zones',
    'Gang Activity Suspected in Recent Incidents'
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
    'Cybersecurity initiatives protect citizens from digital threats and online fraud.',
    'Recent incidents show concerning patterns that require immediate attention and resource allocation.',
    'Federal funding enables department to upgrade critical equipment and training programs.',
    'Community-led initiatives demonstrate positive impact on reducing property crime in target areas.',
    'Enhanced safety measures around educational facilities show measurable improvement in incident rates.',
    'Intelligence gathering reveals potential connections between recent criminal activities.'
  ];

  const crimeTags = ['theft', 'assault', 'vandalism', 'fraud', 'burglary', 'traffic violation', 'domestic dispute'];
  const officers = ['Officer Johnson', 'Detective Smith', 'Sergeant Williams', 'Captain Davis', 'Officer Brown'];

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
    sentiment: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)] as 'positive' | 'neutral' | 'negative',
    location: {
      lat: 40.7128 + (Math.random() - 0.5) * 0.1,
      lng: -74.0060 + (Math.random() - 0.5) * 0.1,
      address: `${Math.floor(Math.random() * 9999)} Main St`
    },
    crimeTags: crimeTags.slice(0, Math.floor(Math.random() * 3) + 1),
    officersInvolved: officers.slice(0, Math.floor(Math.random() * 2) + 1)
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
    'Training and Development',
    'Drug-Related Incidents',
    'Domestic Violence Cases',
    'Youth Crime Prevention',
    'Property Crime Patterns'
  ];

  const summaries = [
    'Coordinated efforts across multiple districts addressing traffic safety concerns with measurable improvements in incident response times.',
    'Community outreach programs demonstrate positive engagement between law enforcement and local residents.',
    'Ongoing investigations reveal patterns requiring enhanced surveillance and coordinated response strategies.',
    'Emergency preparedness exercises and real-world responses showcase department capabilities and areas for improvement.',
    'Proactive measures implemented to enhance public safety infrastructure and community protection protocols.',
    'Technology integration improves operational efficiency and evidence management across departments.',
    'Multi-jurisdiction collaboration enhances resource sharing and coordinated response capabilities.',
    'Professional development initiatives strengthen officer capabilities and community relations.',
    'Coordinated response to drug-related incidents shows concerning trends requiring immediate attention.',
    'Domestic violence cases require specialized response protocols and community support resources.',
    'Youth engagement programs aim to prevent criminal activity through education and mentorship.',
    'Property crime analysis reveals patterns that inform patrol strategies and prevention measures.'
  ];

  const actionItems = [
    'Increase patrol frequency in affected areas',
    'Coordinate with community leaders for public meetings',
    'Deploy additional surveillance equipment',
    'Schedule inter-agency briefing sessions',
    'Implement enhanced training protocols',
    'Review and update response procedures',
    'Establish community liaison programs',
    'Conduct follow-up investigations',
    'Allocate additional resources to high-priority areas',
    'Develop prevention strategies with local organizations'
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
      sources: [...new Set(articles.map(a => a.source))].slice(0, 3),
      weeklyTrend: ['increasing', 'decreasing', 'stable'][Math.floor(Math.random() * 3)] as 'increasing' | 'decreasing' | 'stable'
    },
    actionItems: actionItems.slice(0, Math.floor(Math.random() * 4) + 2),
    riskLevel: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as 'low' | 'medium' | 'high' | 'critical'
  };
};

export const generateMockAlerts = (): Alert[] => {
  const alerts: Alert[] = [
    {
      id: 'alert-1',
      type: 'breaking',
      title: 'Multiple Vehicle Accident on Highway 101',
      description: 'Major traffic incident requiring immediate response. Multiple units dispatched.',
      priority: 'high',
      districts: ['North District', 'East District'],
      timestamp: new Date().toISOString(),
      actionRequired: true
    },
    {
      id: 'alert-2',
      type: 'pattern',
      title: 'Increased Burglary Reports in Downtown',
      description: 'Pattern analysis shows 40% increase in burglary reports over the past week.',
      priority: 'medium',
      districts: ['Downtown'],
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      actionRequired: true
    },
    {
      id: 'alert-3',
      type: 'weather',
      title: 'Severe Weather Warning',
      description: 'Heavy rain expected to impact traffic and emergency response times.',
      priority: 'medium',
      districts: ['All Districts'],
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      actionRequired: false
    }
  ];

  return alerts.slice(0, Math.floor(Math.random() * 4));
};

export const generateMockWeather = (): WeatherImpact => {
  const conditions = ['Clear', 'Rainy', 'Cloudy', 'Stormy', 'Foggy'];
  const condition = conditions[Math.floor(Math.random() * conditions.length)];
  
  return {
    condition,
    temperature: Math.floor(Math.random() * 30) + 5,
    description: `${condition} weather conditions may impact patrol operations and response times.`,
    crimeCorrelation: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as 'high' | 'medium' | 'low',
    recommendations: [
      'Increase patrol visibility in high-traffic areas',
      'Monitor weather-related incidents closely',
      'Prepare emergency response protocols',
      'Coordinate with traffic management'
    ].slice(0, Math.floor(Math.random() * 3) + 1)
  };
};

export const generateMockAnalytics = (): AnalyticsData => {
  return {
    crimePatterns: {
      timeOfDay: {
        '00-06': Math.floor(Math.random() * 20) + 5,
        '06-12': Math.floor(Math.random() * 30) + 15,
        '12-18': Math.floor(Math.random() * 40) + 20,
        '18-24': Math.floor(Math.random() * 35) + 25
      },
      dayOfWeek: {
        'Monday': Math.floor(Math.random() * 50) + 20,
        'Tuesday': Math.floor(Math.random() * 45) + 18,
        'Wednesday': Math.floor(Math.random() * 40) + 15,
        'Thursday': Math.floor(Math.random() * 45) + 20,
        'Friday': Math.floor(Math.random() * 60) + 30,
        'Saturday': Math.floor(Math.random() * 70) + 35,
        'Sunday': Math.floor(Math.random() * 55) + 25
      },
      monthlyTrend: {
        'Jan': -5, 'Feb': -2, 'Mar': 3, 'Apr': 7, 'May': 12, 'Jun': 8,
        'Jul': 15, 'Aug': 10, 'Sep': 5, 'Oct': 2, 'Nov': -3, 'Dec': -8
      }
    },
    districtComparison: {
      'Downtown': {
        totalIncidents: Math.floor(Math.random() * 100) + 50,
        priorityBreakdown: { high: 15, medium: 25, low: 35 },
        trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'stable'
      },
      'North District': {
        totalIncidents: Math.floor(Math.random() * 80) + 30,
        priorityBreakdown: { high: 8, medium: 20, low: 25 },
        trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'stable'
      },
      'South District': {
        totalIncidents: Math.floor(Math.random() * 90) + 40,
        priorityBreakdown: { high: 12, medium: 22, low: 30 },
        trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'stable'
      },
      'East District': {
        totalIncidents: Math.floor(Math.random() * 70) + 25,
        priorityBreakdown: { high: 6, medium: 18, low: 28 },
        trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'stable'
      },
      'West District': {
        totalIncidents: Math.floor(Math.random() * 85) + 35,
        priorityBreakdown: { high: 10, medium: 24, low: 32 },
        trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'stable'
      }
    },
    sourceReliability: {
      'The Tribune': 0.92,
      'Daily Herald': 0.88,
      'Metro News': 0.85,
      'City Chronicle': 0.90,
      'Regional Times': 0.87
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

  const totalArticlesToday = allArticles.filter(a => 
    format(new Date(a.publishedAt), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
  ).length;

  return {
    date: format(date, 'yyyy-MM-dd'),
    totalArticles: totalArticlesToday,
    relevantArticles: relevantArticles.length,
    topicClusters: clusters,
    districts: mockDistricts,
    generatedAt: new Date().toISOString(),
    weeklyComparison: {
      articlesChange: Math.floor(Math.random() * 40) - 20,
      priorityDistribution: {
        high: clusters.filter(c => c.priority === 'high').length,
        medium: clusters.filter(c => c.priority === 'medium').length,
        low: clusters.filter(c => c.priority === 'low').length
      },
      topDistricts: mockDistricts.slice(0, 3)
    },
    alerts: generateMockAlerts(),
    weatherImpact: generateMockWeather()
  };
};