import { calculateContentPatterns } from './calculations';

export function findContentGaps(params: {
  posts: Array<{ mediaType: string; topic: string | null; caption: string | null }>;
  contentPillars: Array<{ name: string; targetPercentage: number }>;
  patterns: ReturnType<typeof calculateContentPatterns>;
}): {
  gaps: Array<{
    topic: string;
    reason: string;
    evidence: string;
    recommendation: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
  }>;
  currentDistribution: Record<string, number>;
  missingFormats: string[];
  underperformingPillars: Array<{ name: string; targetPercentage: number; actualPercentage: number; gap: number }>;
} {
  const currentDistribution: Record<string, number> = {};
  const totalPosts = params.posts.length;

  // Calculate current distribution
  params.posts.forEach(post => {
    if (post.topic) {
      currentDistribution[post.topic] = (currentDistribution[post.topic] || 0) + 1;
    }
  });

  // Convert to percentages
  for (const topic in currentDistribution) {
    currentDistribution[topic] = Number(((currentDistribution[topic] / totalPosts) * 100).toFixed(2));
  }

  const underperformingPillars: Array<{ name: string; targetPercentage: number; actualPercentage: number; gap: number }> = [];
  const gaps: Array<{
    topic: string;
    reason: string;
    evidence: string;
    recommendation: string;
    priority: 'HIGH' | 'MEDIUM' | 'LOW';
  }> = [];

  params.contentPillars.forEach(pillar => {
    const actualPercentage = currentDistribution[pillar.name] || 0;
    const gap = pillar.targetPercentage - actualPercentage;

    if (gap > 5) { // Meaning we are under-posting this pillar
      underperformingPillars.push({
        name: pillar.name,
        targetPercentage: pillar.targetPercentage,
        actualPercentage,
        gap: Number(gap.toFixed(2))
      });

      gaps.push({
        topic: pillar.name,
        reason: `Falling behind target distribution for ${pillar.name}`,
        evidence: `Target: ${pillar.targetPercentage}%, Actual: ${actualPercentage.toFixed(2)}%`,
        recommendation: `Schedule ${Math.ceil((gap / 100) * totalPosts) || 1} more posts about ${pillar.name} in your next planning cycle.`,
        priority: gap > 15 ? 'HIGH' : gap > 10 ? 'MEDIUM' : 'LOW'
      });
    }
  });

  // Check missing formats
  const expectedFormats = ['IMAGE', 'CAROUSEL_ALBUM', 'REELS', 'VIDEO'];
  const usedFormats = new Set(params.posts.map(p => p.mediaType));
  const missingFormats = expectedFormats.filter(f => !usedFormats.has(f));

  if (missingFormats.length > 0) {
    gaps.push({
      topic: 'Content Formats',
      reason: 'Lack of format diversity',
      evidence: `You haven't posted any: ${missingFormats.join(', ')}`,
      recommendation: `Try incorporating ${missingFormats[0]} into your content mix to reach different audience segments.`,
      priority: 'MEDIUM'
    });
  }

  // Look for topics that perform well but aren't posted often
  if (params.patterns.bestTopic) {
    const bestTopicPerf = params.patterns.bestTopic;
    const bestTopicFreq = currentDistribution[bestTopicPerf.topic] || 0;
    if (bestTopicFreq < 15 && bestTopicPerf.count > 0) {
      gaps.push({
        topic: bestTopicPerf.topic,
        reason: 'Under-utilized high-performing topic',
        evidence: `Provides the highest engagement but only makes up ${bestTopicFreq}% of your content.`,
        recommendation: `Increase the frequency of ${bestTopicPerf.topic} content to boost overall engagement.`,
        priority: 'HIGH'
      });
    }
  }

  return {
    gaps: gaps.sort((a, b) => (a.priority === 'HIGH' ? -1 : a.priority === 'LOW' && b.priority !== 'LOW' ? 1 : 0)),
    currentDistribution,
    missingFormats,
    underperformingPillars
  };
}
