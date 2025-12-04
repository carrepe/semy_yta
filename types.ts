export interface VideoStats {
  viewCount: string;
  likeCount: string;
  commentCount: string;
}

export interface ChannelStats {
  subscriberCount: string;
  videoCount: string;
  hiddenSubscriberCount: boolean;
}

export interface VideoData {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  channelId: string;
  channelTitle: string;
  duration: string; // ISO 8601
  viewCount: number;
  subscriberCount: number;
  videoUrl: string;
  channelUrl: string;
  performanceRatio: number; // views / subscribers
  level: number; // 1-5
}

export interface FilterState {
  keyword: string;
  country: string;
  duration: 'any' | 'short' | 'long'; // short < 60s, long > 20m
  dateRange: string;
  minSubscribers: number;
  minViews: number;
  performanceLevel: number; // 1-5
}

export interface CountryOption {
  code: string;
  name: string;
  lang: string;
}

export enum PerformanceLevel {
  Viral = 5,
  High = 4,
  Good = 3,
  Normal = 2,
  Low = 1
}