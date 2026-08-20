import { TrendProvider } from './trend-provider';
import { AudioProvider } from './audio-provider';
import { YouTubeTrendProvider } from './youtube-trend-provider';
import { UnavailableTrendProvider, UnavailableAudioProvider } from './unavailable-provider';

export function getTrendProvider(): TrendProvider {
  const yt = new YouTubeTrendProvider();
  if (yt.isConfigured) {
    return yt;
  }
  return new UnavailableTrendProvider();
}

export function getAudioProvider(): AudioProvider {
  return new UnavailableAudioProvider();
}
