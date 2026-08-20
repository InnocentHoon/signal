export function calculateEngagementRate(params: {
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  reach: number;
}): number {
  if (params.reach === 0) return 0;
  const totalEngagement = params.likes + params.comments + params.shares + params.saves;
  const rate = (totalEngagement / params.reach) * 100;
  return Number(rate.toFixed(2));
}

export function calculateFollowerGrowth(params: {
  currentFollowers: number;
  previousFollowers: number;
}): { absolute: number; percentage: number } {
  if (params.previousFollowers === 0) {
    return { absolute: 0, percentage: 0 };
  }
  const absolute = params.currentFollowers - params.previousFollowers;
  const percentage = Number(((absolute / params.previousFollowers) * 100).toFixed(2));
  return { absolute, percentage };
}

export function calculatePostPerformanceScore(params: {
  post: {
    likesCount: number;
    commentsCount: number;
    sharesCount: number;
    savesCount: number;
    viewsCount: number;
    reachCount: number;
    engagementRate: number;
  };
  baseline: {
    avgLikes: number;
    avgComments: number;
    avgShares: number;
    avgSaves: number;
    avgViews: number;
    avgReach: number;
    avgEngagementRate: number;
  };
}): { score: number; explanation: string; multiplier: number } {
  const getRatio = (val: number, baselineVal: number) => {
    if (baselineVal === 0) return val > 0 ? 3 : 1;
    return Math.min(val / baselineVal, 3);
  };

  const ratios = {
    engagementRate: getRatio(params.post.engagementRate, params.baseline.avgEngagementRate),
    saves: getRatio(params.post.savesCount, params.baseline.avgSaves),
    shares: getRatio(params.post.sharesCount, params.baseline.avgShares),
    reach: getRatio(params.post.reachCount, params.baseline.avgReach),
    views: getRatio(params.post.viewsCount, params.baseline.avgViews),
  };

  const score = 
    (ratios.engagementRate / 3) * 30 +
    (ratios.saves / 3) * 25 +
    (ratios.shares / 3) * 20 +
    (ratios.reach / 3) * 15 +
    (ratios.views / 3) * 10;

  const totalMultiplier = 
    ratios.engagementRate * 0.3 + 
    ratios.saves * 0.25 + 
    ratios.shares * 0.2 + 
    ratios.reach * 0.15 + 
    ratios.views * 0.1;

  let explanation = '';
  if (totalMultiplier >= 1.5) {
    explanation = `Performed ${totalMultiplier.toFixed(1)}× above your normal baseline. Excellent engagement.`;
  } else if (totalMultiplier >= 1) {
    explanation = `Performed slightly above your normal baseline.`;
  } else {
    explanation = `Performed below your normal baseline (${totalMultiplier.toFixed(1)}×).`;
  }

  return { 
    score: Number(score.toFixed(2)), 
    explanation, 
    multiplier: Number(totalMultiplier.toFixed(2)) 
  };
}

export function calculateAccountHealthScore(params: {
  engagementRate: number;
  avgEngagementRate: number;
  followerGrowthRate: number;
  postsPerWeek: number;
  targetPostsPerWeek: number;
  reachGrowthRate: number;
  audienceQualityScore: number;
  contentDiversityScore: number;
}): {
  overall: number;
  categories: {
    reach: number;
    engagement: number;
    content: number;
    consistency: number;
    audience: number;
    growth: number;
  };
  status: 'Excellent' | 'Healthy' | 'Stable' | 'Needs Attention' | 'Declining' | 'Improving';
} {
  const normalize = (val: number, max: number) => Math.min(Math.max((val / max) * 100, 0), 100);

  const engagement = normalize(params.engagementRate, params.avgEngagementRate || 1);
  const consistency = normalize(params.postsPerWeek, params.targetPostsPerWeek || 1);
  const reach = normalize(params.reachGrowthRate + 50, 100); // Assuming -50 to 50 scale initially
  const growth = normalize(params.followerGrowthRate + 10, 20); // -10 to 10 scale
  const content = params.contentDiversityScore;
  const audience = params.audienceQualityScore;

  const overall = 
    reach * 0.15 + 
    engagement * 0.25 + 
    content * 0.20 + 
    consistency * 0.20 + 
    audience * 0.10 + 
    growth * 0.10;

  let status: 'Excellent' | 'Healthy' | 'Stable' | 'Needs Attention' | 'Declining' | 'Improving';
  if (overall >= 85) status = 'Excellent';
  else if (overall >= 70) status = 'Healthy';
  else if (overall >= 55) status = 'Stable';
  else status = 'Needs Attention';

  if (params.followerGrowthRate < -1 || params.reachGrowthRate < -10) status = 'Declining';
  else if (status === 'Needs Attention' && params.followerGrowthRate > 2) status = 'Improving';

  return {
    overall: Number(overall.toFixed(2)),
    categories: { reach, engagement, content, consistency, audience, growth },
    status
  };
}

export function calculateProfileScore(params: {
  hasProfilePicture: boolean;
  hasBio: boolean;
  hasWebsite: boolean;
  hasUsername: boolean;
  hasNiche: boolean;
  hasSubNiche: boolean;
  hasContentPillars: boolean;
  avgEngagementRate: number;
  postsPerWeek: number;
  followerGrowthRate: number;
  savedPostsRatio: number;
  carouselRatio: number;
  reelRatio: number;
}): {
  overall: number;
  categories: {
    profileOptimization: number;
    nicheClarity: number;
    contentQuality: number;
    engagement: number;
    consistency: number;
    visualIdentity: number;
    audienceResponse: number;
    growthPotential: number;
  };
  strengths: string[];
  weaknesses: string[];
  fastestImprovements: string[];
} {
  const getBoolScore = (bools: boolean[]) => (bools.filter(b => b).length / bools.length) * 10;
  
  const profileOptimization = getBoolScore([params.hasProfilePicture, params.hasBio, params.hasWebsite, params.hasUsername]);
  const nicheClarity = getBoolScore([params.hasNiche, params.hasSubNiche, params.hasContentPillars]);
  const contentQuality = Math.min(((params.carouselRatio + params.reelRatio) / 0.8) * 10, 10);
  const engagement = Math.min((params.avgEngagementRate / 5) * 10, 10);
  const consistency = Math.min((params.postsPerWeek / 4) * 10, 10);
  const visualIdentity = params.hasProfilePicture ? 10 : 0;
  const audienceResponse = Math.min((params.savedPostsRatio / 0.1) * 10, 10);
  const growthPotential = Math.min(Math.max((params.followerGrowthRate + 2) / 0.5, 0), 10);

  const overall = 
    profileOptimization * 0.10 +
    nicheClarity * 0.15 +
    contentQuality * 0.20 +
    engagement * 0.20 +
    consistency * 0.15 +
    visualIdentity * 0.05 +
    audienceResponse * 0.10 +
    growthPotential * 0.05;

  const strengths = [];
  const weaknesses = [];
  const fastestImprovements = [];

  if (profileOptimization >= 8) strengths.push('Well-optimized profile');
  else { weaknesses.push('Incomplete profile setup'); fastestImprovements.push('Complete bio, add profile picture, and link website'); }

  if (consistency >= 8) strengths.push('Consistent posting schedule');
  else { weaknesses.push('Inconsistent posting'); fastestImprovements.push('Increase posting frequency to at least 3-4 times a week'); }

  if (engagement >= 7) strengths.push('Strong engagement rate');
  else weaknesses.push('Low engagement rate');

  if (nicheClarity < 5) fastestImprovements.push('Define specific niche and content pillars');

  return {
    overall: Number(overall.toFixed(2)),
    categories: {
      profileOptimization, nicheClarity, contentQuality, engagement, consistency, visualIdentity, audienceResponse, growthPotential
    },
    strengths, weaknesses, fastestImprovements
  };
}

export function calculateContentOpportunityScore(params: {
  trendRelevance: number;
  nicheRelevance: number;
  historicalFit: number;
  audienceFit: number;
  contentGap: number;
  competition: number;
}): number {
  const score = 
    (params.trendRelevance * 0.2) +
    (params.nicheRelevance * 0.2) +
    (params.historicalFit * 0.2) +
    (params.audienceFit * 0.15) +
    (params.contentGap * 0.15) +
    ((100 - params.competition) * 0.1);
    
  return Number(score.toFixed(2));
}

export function calculateGrowthProjection(params: {
  currentFollowers: number;
  growthRatePerMonth: number;
  periods: Array<{ days: number; label: string }>;
}): Array<{ label: string; projected: number; low: number; high: number }> {
  const rate = params.growthRatePerMonth / 100;
  return params.periods.map(period => {
    const months = period.days / 30;
    const projected = params.currentFollowers * Math.pow(1 + rate, months);
    return {
      label: period.label,
      projected: Math.round(projected),
      low: Math.round(projected * 0.8),
      high: Math.round(projected * 1.2),
    };
  });
}

export function calculateBestPostingTimes(posts: Array<{
  publishedAt: Date;
  engagementRate: number;
  likesCount: number;
  commentsCount: number;
}>): {
  bestDay: string;
  bestHour: number;
  bestTimeLabel: string;
  confidence: 'High' | 'Medium' | 'Low';
  sampleSize: number;
  reasoning: string;
} | null {
  if (posts.length < 10) return null;

  const timeMap = new Map<string, { totalEng: number; count: number }>();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  posts.forEach(post => {
    const day = days[post.publishedAt.getDay()];
    const hour = post.publishedAt.getHours();
    const key = `${day}-${hour}`;
    
    const existing = timeMap.get(key) || { totalEng: 0, count: 0 };
    existing.totalEng += post.engagementRate;
    existing.count += 1;
    timeMap.set(key, existing);
  });

  let bestKey = '';
  let highestAvg = -1;

  timeMap.forEach((data, key) => {
    const avg = data.totalEng / data.count;
    if (avg > highestAvg) {
      highestAvg = avg;
      bestKey = key;
    }
  });

  const [bestDay, bestHourStr] = bestKey.split('-');
  const bestHour = parseInt(bestHourStr, 10);
  const confidence = posts.length >= 20 ? 'High' : 'Medium';
  const ampm = bestHour >= 12 ? 'PM' : 'AM';
  const displayHour = bestHour % 12 || 12;

  return {
    bestDay,
    bestHour,
    bestTimeLabel: `${bestDay} at ${displayHour}:00 ${ampm}`,
    confidence,
    sampleSize: posts.length,
    reasoning: `Based on your highest average engagement rate (${highestAvg.toFixed(2)}%) across ${posts.length} posts.`
  };
}

export function calculateContentPatterns(posts: Array<{
  mediaType: string;
  topic: string | null;
  publishedAt: Date;
  engagementRate: number;
  savesCount: number;
  sharesCount: number;
  likesCount: number;
  commentsCount: number;
}>): {
  bestFormat: { format: string; avgEngagement: number; count: number };
  bestTopic: { topic: string; avgEngagement: number; count: number } | null;
  bestDay: { day: string; avgEngagement: number } | null;
  bestHour: { hour: number; label: string; avgEngagement: number } | null;
  saveRateByFormat: Record<string, number>;
  shareRateByFormat: Record<string, number>;
  insights: string[];
} {
  const formatStats: Record<string, { eng: number; saves: number; shares: number; count: number }> = {};
  const topicStats: Record<string, { eng: number; count: number }> = {};
  const dayStats: Record<string, { eng: number; count: number }> = {};
  const hourStats: Record<string, { eng: number; count: number }> = {};
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  posts.forEach(p => {
    if (!formatStats[p.mediaType]) formatStats[p.mediaType] = { eng: 0, saves: 0, shares: 0, count: 0 };
    formatStats[p.mediaType].eng += p.engagementRate;
    formatStats[p.mediaType].saves += p.savesCount;
    formatStats[p.mediaType].shares += p.sharesCount;
    formatStats[p.mediaType].count++;

    if (p.topic) {
      if (!topicStats[p.topic]) topicStats[p.topic] = { eng: 0, count: 0 };
      topicStats[p.topic].eng += p.engagementRate;
      topicStats[p.topic].count++;
    }

    const dayName = days[p.publishedAt.getDay()];
    if (!dayStats[dayName]) dayStats[dayName] = { eng: 0, count: 0 };
    dayStats[dayName].eng += p.engagementRate;
    dayStats[dayName].count++;

    const hour = p.publishedAt.getHours();
    if (!hourStats[hour]) hourStats[hour] = { eng: 0, count: 0 };
    hourStats[hour].eng += p.engagementRate;
    hourStats[hour].count++;
  });

  const getBest = (stats: Record<string, { eng: number; count: number }>) => {
    let best = null;
    let maxAvg = -1;
    for (const [key, val] of Object.entries(stats)) {
      if (val.count > 0 && val.eng / val.count > maxAvg) {
        maxAvg = val.eng / val.count;
        best = { key, avgEngagement: maxAvg, count: val.count };
      }
    }
    return best;
  };

  const bFormat = getBest(formatStats);
  const bTopic = getBest(topicStats);
  const bDay = getBest(dayStats);
  const bHour = getBest(hourStats);

  const saveRateByFormat: Record<string, number> = {};
  const shareRateByFormat: Record<string, number> = {};

  for (const [format, val] of Object.entries(formatStats)) {
    saveRateByFormat[format] = val.count ? Number((val.saves / val.count).toFixed(2)) : 0;
    shareRateByFormat[format] = val.count ? Number((val.shares / val.count).toFixed(2)) : 0;
  }

  const insights: string[] = [];
  if (bFormat) insights.push(`Your best performing format is ${bFormat.key} with ${bFormat.avgEngagement.toFixed(2)}% engagement.`);
  if (bTopic) insights.push(`Content about ${bTopic.key} resonates most with your audience.`);

  return {
    bestFormat: bFormat ? { format: bFormat.key, avgEngagement: bFormat.avgEngagement, count: bFormat.count } : { format: 'Unknown', avgEngagement: 0, count: 0 },
    bestTopic: bTopic ? { topic: bTopic.key, avgEngagement: bTopic.avgEngagement, count: bTopic.count } : null,
    bestDay: bDay ? { day: bDay.key, avgEngagement: bDay.avgEngagement } : null,
    bestHour: bHour ? { hour: parseInt(bHour.key, 10), label: `${parseInt(bHour.key, 10) % 12 || 12}:00 ${parseInt(bHour.key, 10) >= 12 ? 'PM' : 'AM'}`, avgEngagement: bHour.avgEngagement } : null,
    saveRateByFormat,
    shareRateByFormat,
    insights
  };
}
