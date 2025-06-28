import { NewsArticle, TopicCluster, DailyDigest, Alert, WeatherImpact, AnalyticsData } from '../types';
import { format, subDays } from 'date-fns';

const mockSources = ['The Hindu', 'Deccan Chronicle', 'Eenadu', 'Andhra Jyothy', 'Sakshi', 'Andhra Pradesh Today'];
const mockDistricts = ['Visakhapatnam', 'Anakapalli', 'Amalapuram', 'Srikakulam', 'Yellamanchilli', 'Sompeta', 'Kadapa', 'Tirupati', 'Rajamahendravaram', 'Kakinada', 'Bhimavaram', 'Vijayawada'];
const mockCategories = ['Crime Investigation', 'Traffic Management', 'Public Safety', 'Community Policing', 'Emergency Response', 'Cyber Crime', 'Drug Enforcement', 'Women Safety'];

const generateMockArticle = (id: string, date: Date): NewsArticle => {
  const titles = [
    'Traffic Management Initiative Reduces Congestion in Visakhapatnam',
    'Community Policing Program Shows Success in Vijayawada',
    'Drug Enforcement Operation Yields Major Arrests in Tirupati',
    'Emergency Response Training Conducted in Kakinada',
    'Cyber Crime Awareness Campaign Launched in Srikakulam',
    'Women Safety Initiative Expands to Rural Areas of Kadapa',
    'Anti-Smuggling Operation Successful at Bhimavaram Port',
    'Public Safety Meeting Addresses Concerns in Anakapalli',
    'Technology Integration Enhances Investigation Capabilities',
    'Youth Engagement Program Reduces Crime in Rajamahendravaram',
    'Coastal Security Enhanced Along Sompeta Shoreline',
    'Rural Policing Initiative Strengthens Yellamanchilli Coverage',
    'Inter-District Coordination Improves Response Times',
    'Digital Evidence Lab Established in Amalapuram',
    'Community Watch Program Prevents Property Crimes'
  ];

  const contents = [
    'Comprehensive analysis reveals significant improvement in traffic flow and reduced accident rates following implementation of smart traffic management systems.',
    'Community engagement initiatives demonstrate measurable enhancement in public trust and cooperation with law enforcement agencies.',
    'Multi-agency operation targeting drug trafficking networks results in seizure of contraband worth several crores and multiple arrests.',
    'Specialized emergency response training enhances department capabilities in disaster management and crisis intervention.',
    'Educational outreach programs create awareness about cyber threats and digital safety among citizens and businesses.',
    'Women safety initiatives including patrol enhancement and helpline services show positive impact on crime prevention.',
    'Coordinated anti-smuggling operations at coastal areas result in significant seizures and disruption of illegal trade networks.',
    'Public consultation meetings provide valuable feedback on safety concerns and help prioritize resource allocation.',
    'Advanced forensic technology and digital investigation tools improve case resolution rates and evidence quality.',
    'Youth mentorship and skill development programs create positive alternatives and reduce juvenile delinquency rates.',
    'Enhanced coastal surveillance and patrolling strengthen security along vulnerable shoreline areas.',
    'Rural policing initiatives improve law enforcement presence and response capabilities in remote areas.',
    'Inter-district communication systems and joint operations enhance coordination and resource sharing.',
    'State-of-the-art digital forensics laboratory enhances investigation capabilities for cyber and financial crimes.',
    'Community participation in neighborhood watch programs significantly reduces property crime incidents.'
  ];

  const crimeTags = ['investigation', 'prevention', 'enforcement', 'surveillance', 'community safety', 'traffic violation', 'cyber security'];
  const officers = ['SI Ramesh Kumar', 'CI Lakshmi Devi', 'DSP Venkata Rao', 'SP Priya Sharma', 'ASI Suresh Babu'];

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
    keywords: ['operation', 'investigation', 'community', 'safety', 'enforcement'].slice(0, Math.floor(Math.random() * 3) + 2),
    sentiment: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)] as 'positive' | 'neutral' | 'negative',
    location: {
      lat: 17.6868 + (Math.random() - 0.5) * 2,
      lng: 83.2185 + (Math.random() - 0.5) * 2,
      address: `${Math.floor(Math.random() * 999) + 1} Main Road`
    },
    crimeTags: crimeTags.slice(0, Math.floor(Math.random() * 3) + 1),
    officersInvolved: officers.slice(0, Math.floor(Math.random() * 2) + 1)
  };
};

const generateTopicCluster = (articles: NewsArticle[]): TopicCluster => {
  const clusterTitles = [
    'Traffic Safety & Management Operations',
    'Community Policing & Engagement',
    'Drug Enforcement & Anti-Narcotics',
    'Emergency Response & Disaster Management',
    'Cyber Crime Investigation & Prevention',
    'Women Safety & Protection Initiatives',
    'Coastal Security & Anti-Smuggling',
    'Rural Policing & Remote Area Coverage',
    'Technology Integration & Modernization',
    'Youth Crime Prevention Programs',
    'Inter-District Coordination Activities',
    'Public Safety & Crime Prevention'
  ];

  const summaries = [
    'Coordinated traffic management operations across multiple districts show significant improvement in road safety and congestion reduction.',
    'Community engagement programs strengthen police-public relations and enhance cooperative crime prevention efforts.',
    'Anti-narcotics operations targeting drug trafficking networks demonstrate effective inter-agency coordination and enforcement.',
    'Emergency preparedness and disaster response capabilities enhanced through specialized training and equipment upgrades.',
    'Cyber crime investigation units tackle digital threats with advanced technology and specialized expertise.',
    'Women safety initiatives including enhanced patrolling and support services show positive impact on crime prevention.',
    'Coastal security operations strengthen surveillance and anti-smuggling efforts along Andhra Pradesh shoreline.',
    'Rural policing initiatives improve law enforcement presence and community safety in remote areas.',
    'Technology integration enhances investigation capabilities and operational efficiency across departments.',
    'Youth engagement programs create positive alternatives and reduce juvenile crime through mentorship and skills development.',
    'Inter-district coordination improves resource sharing and joint operation effectiveness.',
    'Comprehensive public safety measures address community concerns and enhance overall security.'
  ];

  const actionItems = [
    'Increase patrol frequency in high-traffic areas',
    'Coordinate with district collectors for community meetings',
    'Deploy additional surveillance equipment at strategic locations',
    'Schedule inter-agency coordination meetings',
    'Implement enhanced training protocols for personnel',
    'Review and update standard operating procedures',
    'Establish community liaison officer programs',
    'Conduct follow-up investigations on pending cases',
    'Allocate additional resources to priority districts',
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
      title: 'Multi-Vehicle Accident on NH-16 Near Visakhapatnam',
      description: 'Major traffic incident on National Highway 16 requiring immediate response. Multiple units dispatched to scene.',
      priority: 'high',
      districts: ['Visakhapatnam', 'Anakapalli'],
      timestamp: new Date().toISOString(),
      actionRequired: true
    },
    {
      id: 'alert-2',
      type: 'pattern',
      title: 'Increased Property Crime Reports in Vijayawada',
      description: 'Pattern analysis indicates 35% increase in property crime reports over the past week in commercial areas.',
      priority: 'medium',
      districts: ['Vijayawada'],
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      actionRequired: true
    },
    {
      id: 'alert-3',
      type: 'weather',
      title: 'Cyclone Warning for Coastal Districts',
      description: 'Meteorological department issues cyclone warning for coastal areas. Enhanced security measures required.',
      priority: 'high',
      districts: ['Srikakulam', 'Sompeta', 'Kakinada'],
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      actionRequired: true
    }
  ];

  return alerts.slice(0, Math.floor(Math.random() * 4));
};

export const generateMockWeather = (): WeatherImpact => {
  const conditions = ['Clear', 'Monsoon', 'Partly Cloudy', 'Thunderstorms', 'Humid'];
  const condition = conditions[Math.floor(Math.random() * conditions.length)];
  
  return {
    condition,
    temperature: Math.floor(Math.random() * 15) + 25, // 25-40°C typical for AP
    description: `${condition} weather conditions typical for Andhra Pradesh coastal region may impact patrol operations and response times.`,
    crimeCorrelation: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as 'high' | 'medium' | 'low',
    recommendations: [
      'Increase patrol visibility in coastal areas during monsoon',
      'Monitor weather-related incidents and traffic disruptions',
      'Prepare emergency response protocols for severe weather',
      'Coordinate with disaster management authorities',
      'Enhance communication systems during adverse weather'
    ].slice(0, Math.floor(Math.random() * 3) + 2)
  };
};

export const generateMockAnalytics = (): AnalyticsData => {
  return {
    crimePatterns: {
      timeOfDay: {
        '00-06': Math.floor(Math.random() * 15) + 5,
        '06-12': Math.floor(Math.random() * 25) + 15,
        '12-18': Math.floor(Math.random() * 35) + 20,
        '18-24': Math.floor(Math.random() * 30) + 25
      },
      dayOfWeek: {
        'Monday': Math.floor(Math.random() * 40) + 20,
        'Tuesday': Math.floor(Math.random() * 35) + 18,
        'Wednesday': Math.floor(Math.random() * 30) + 15,
        'Thursday': Math.floor(Math.random() * 35) + 20,
        'Friday': Math.floor(Math.random() * 50) + 30,
        'Saturday': Math.floor(Math.random() * 60) + 35,
        'Sunday': Math.floor(Math.random() * 45) + 25
      },
      monthlyTrend: {
        'Jan': -3, 'Feb': -1, 'Mar': 2, 'Apr': 5, 'May': 8, 'Jun': 12,
        'Jul': 15, 'Aug': 18, 'Sep': 10, 'Oct': 5, 'Nov': 2, 'Dec': -2
      }
    },
    districtComparison: {
      'Visakhapatnam': {
        totalIncidents: Math.floor(Math.random() * 80) + 60,
        priorityBreakdown: { high: 18, medium: 28, low: 34 },
        trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'stable'
      },
      'Vijayawada': {
        totalIncidents: Math.floor(Math.random() * 70) + 50,
        priorityBreakdown: { high: 15, medium: 25, low: 30 },
        trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'stable'
      },
      'Tirupati': {
        totalIncidents: Math.floor(Math.random() * 60) + 40,
        priorityBreakdown: { high: 12, medium: 20, low: 28 },
        trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'stable'
      },
      'Kakinada': {
        totalIncidents: Math.floor(Math.random() * 50) + 30,
        priorityBreakdown: { high: 8, medium: 18, low: 24 },
        trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'stable'
      },
      'Srikakulam': {
        totalIncidents: Math.floor(Math.random() * 45) + 25,
        priorityBreakdown: { high: 6, medium: 15, low: 24 },
        trend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'stable'
      }
    },
    sourceReliability: {
      'The Hindu': 0.94,
      'Deccan Chronicle': 0.91,
      'Eenadu': 0.89,
      'Andhra Jyothy': 0.87,
      'Sakshi': 0.88,
      'Andhra Pradesh Today': 0.85
    }
  };
};

export const generateMockDigest = (date: Date): DailyDigest => {
  // Generate articles for the current date and previous 7 days
  const allArticles: NewsArticle[] = [];
  for (let i = 0; i < 8; i++) {
    const currentDate = subDays(date, i);
    const articlesPerDay = Math.floor(Math.random() * 25) + 20; // More articles for a state system
    
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
  
  for (let i = 0; i < clusterCount && i < 10; i++) {
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
      articlesChange: Math.floor(Math.random() * 30) - 15,
      priorityDistribution: {
        high: clusters.filter(c => c.priority === 'high').length,
        medium: clusters.filter(c => c.priority === 'medium').length,
        low: clusters.filter(c => c.priority === 'low').length
      },
      topDistricts: ['Visakhapatnam', 'Vijayawada', 'Tirupati']
    },
    alerts: generateMockAlerts(),
    weatherImpact: generateMockWeather()
  };
};