import { TrendProvider, TrendItem } from './trend-provider';
import { AudioProvider, AudioTrendItem } from './audio-provider';

export class UnavailableTrendProvider implements TrendProvider {
  public readonly name = 'Unavailable';
  public readonly isConfigured = false;

  async fetchTrends(): Promise<TrendItem[] | null> {
    return null;
  }
}

export class UnavailableAudioProvider implements AudioProvider {
  public readonly name = 'Unavailable';
  public readonly isConfigured = false;

  async fetchAudioTrends(): Promise<AudioTrendItem[] | null> {
    return null;
  }
}
