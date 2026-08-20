import { 
  calculateContentPatterns, 
  calculateAccountHealthScore, 
  calculateProfileScore, 
  calculateBestPostingTimes 
} from './calculations';

export type RecommendationInput = {
  patterns: ReturnType<typeof calculateContentPatterns>;
  healthScore: ReturnType<typeof calculateAccountHealthScore>;
  profileScore: ReturnType<typeof calculateProfileScore>;
  recentPosts: any[];
  followerGrowthRate: number;
  postingFrequency: number;
  bestTime: ReturnType<typeof calculateBestPostingTimes>;
  contentPillars: Array<{ name: string; targetPercentage: number; actualPercentage: number }>;
};

export type RecommendationOutput = {
  category: string;
  title: string;
  description: string;
  evidence: string;
  score: number;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
};

export function generateRecommendations(input: RecommendationInput): RecommendationOutput[] {
  const recs: RecommendationOutput[] = [];

  // Content Patterns
  if (input.patterns.bestFormat && input.patterns.bestFormat.format === 'REELS') {
    const avgOther = Object.keys(input.patterns.saveRateByFormat).filter(f => f !== 'REELS').reduce((acc, curr) => acc + input.patterns.saveRateByFormat[curr], 0);
    // Rough heuristic for >20% better
    if (input.patterns.bestFormat.avgEngagement > 1.2) {
      recs.push({
        category: 'Content Strategy',
        title: 'Double Down on Reels',
        description: 'Reels are significantly outperforming your other content formats. Increase your Reel posting frequency.',
        evidence: `Reels average ${input.patterns.bestFormat.avgEngagement.toFixed(2)}% engagement rate.`,
        score: 90,
        priority: 'HIGH'
      });
    }
  }

  const highSaveFormats = Object.entries(input.patterns.saveRateByFormat).filter(([_, rate]) => rate > 5);
  if (highSaveFormats.length > 0) {
    recs.push({
      category: 'Content Types',
      title: 'Create More Educational Content',
      description: 'Your audience is highly engaged with saveable content. Focus on creating educational or reference material.',
      evidence: `${highSaveFormats.map(f => f[0]).join(', ')} formats have a save rate over 5%.`,
      score: 85,
      priority: 'HIGH'
    });
  }

  const highShareFormats = Object.entries(input.patterns.shareRateByFormat).filter(([_, rate]) => rate > 5);
  if (highShareFormats.length > 0) {
    recs.push({
      category: 'Content Types',
      title: 'Leverage Shareable Content',
      description: 'You are getting high shares on certain formats. Try creating more relatable, highly shareable content.',
      evidence: `High share rates detected on ${highShareFormats.map(f => f[0]).join(', ')}.`,
      score: 80,
      priority: 'HIGH'
    });
  }

  if (input.patterns.bestTopic) {
    recs.push({
      category: 'Topic Strategy',
      title: `Expand on ${input.patterns.bestTopic.topic}`,
      description: 'This topic is resonating well with your audience. Consider creating a mini-series or deeper dives into this subject.',
      evidence: `Averages ${input.patterns.bestTopic.avgEngagement.toFixed(2)}% engagement.`,
      score: 75,
      priority: 'MEDIUM'
    });
  }

  // Profile and Consistency
  if (input.profileScore.categories.profileOptimization < 7) {
    recs.push({
      category: 'Profile',
      title: 'Optimize Your Profile',
      description: 'A complete profile converts visitors to followers better. Ensure your bio is clear and you have a trackable link.',
      evidence: `Profile optimization score is ${input.profileScore.categories.profileOptimization.toFixed(1)}/10.`,
      score: 95,
      priority: 'HIGH'
    });
  }

  if (input.healthScore.categories.consistency < 70) {
    recs.push({
      category: 'Consistency',
      title: 'Stabilize Posting Schedule',
      description: 'Algorithms favor consistency. Aim to post regularly each week rather than in bursts.',
      evidence: `Consistency score is ${input.healthScore.categories.consistency.toFixed(1)}/100.`,
      score: 85,
      priority: 'HIGH'
    });
  }

  // Content Pillars
  input.contentPillars.forEach(pillar => {
    const diff = Math.abs(pillar.actualPercentage - pillar.targetPercentage);
    if (diff > 15) {
      recs.push({
        category: 'Content Strategy',
        title: `Rebalance Pillar: ${pillar.name}`,
        description: `Your content distribution is heavily skewed away from your target for ${pillar.name}.`,
        evidence: `Target: ${pillar.targetPercentage}%, Actual: ${pillar.actualPercentage}%.`,
        score: 70,
        priority: 'MEDIUM'
      });
    }
  });

  // Growth
  if (input.followerGrowthRate < 1) {
    recs.push({
      category: 'Growth',
      title: 'Implement Growth Tactics',
      description: 'Your follower growth is slow. Consider collaborations, giveaways, or trend-jacking to reach new audiences.',
      evidence: `Growth rate is ${input.followerGrowthRate.toFixed(2)}% per month (below 1%).`,
      score: 88,
      priority: 'HIGH'
    });
  }

  // Fallback / Minor Recommendations
  if (input.bestTime && input.postingFrequency > 0) {
    recs.push({
      category: 'Timing',
      title: 'Post at Optimal Times',
      description: `Schedule your most important posts during your audience's peak active times.`,
      evidence: `Best time identified as ${input.bestTime.bestTimeLabel}.`,
      score: 60,
      priority: 'LOW'
    });
  }

  // Sort by score descending and return top 10
  return recs.sort((a, b) => b.score - a.score).slice(0, 10);
}
