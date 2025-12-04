import { YOUTUBE_API_KEY } from "../constants";
import { VideoData, FilterState, PerformanceLevel } from "../types";

// Helper to calculate date string for "publishedAfter"
const getPublishedAfterDate = (range: string): string | undefined => {
  if (range === "all") return undefined;

  const now = new Date();
  const target = new Date(now);

  if (range.endsWith("d")) {
    const days = parseInt(range.replace("d", ""), 10);
    target.setDate(now.getDate() - days);
  } else if (range.endsWith("m")) {
    const months = parseInt(range.replace("m", ""), 10);
    target.setMonth(now.getMonth() - months);
  } else if (range.endsWith("y")) {
    const years = parseInt(range.replace("y", ""), 10);
    target.setFullYear(now.getFullYear() - years);
  }

  return target.toISOString();
};

// Helper to convert ISO 8601 duration to seconds
const parseDuration = (duration: string): number => {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return 0;

  const hours = parseInt(match[1] || "0") || 0;
  const minutes = parseInt(match[2] || "0") || 0;
  const seconds = parseInt(match[3] || "0") || 0;

  return hours * 3600 + minutes * 60 + seconds;
};

// Calculate Level based on Views / Subscribers
const calculatePerformance = (
  viewCount: number,
  subCount: number
): { ratio: number; level: number } => {
  if (subCount === 0) return { ratio: 0, level: 1 };

  const ratio = viewCount / subCount;
  let level = 1;

  if (ratio >= 5.0) level = 5; // Viral
  else if (ratio >= 1.5) level = 4; // High
  else if (ratio >= 0.8) level = 3; // Good (~1:1)
  else if (ratio >= 0.2) level = 2; // Normal
  else level = 1; // Low

  return { ratio, level };
};

export const fetchVideos = async (
  filters: FilterState
): Promise<VideoData[]> => {
  try {
    const publishedAfter = getPublishedAfterDate(filters.dateRange);

    // 1. Search for Videos
    const searchUrl = new URL("https://www.googleapis.com/youtube/v3/search");
    searchUrl.searchParams.append("part", "snippet");
    searchUrl.searchParams.append("maxResults", "50");
    searchUrl.searchParams.append("q", filters.keyword);
    searchUrl.searchParams.append("type", "video");
    searchUrl.searchParams.append("key", YOUTUBE_API_KEY);

    if (filters.country) {
      searchUrl.searchParams.append("regionCode", filters.country);
      // NOTE: relevanceLanguage helps but doesn't strictly translate.
      // Ideally we would translate the keyword using another API before sending it.
    }

    if (publishedAfter) {
      searchUrl.searchParams.append("publishedAfter", publishedAfter);
    }

    // Video duration filter in search API is rough (short < 4m, long > 20m)
    // We will refine exact 60s limit client side
    if (filters.duration === "short") {
      searchUrl.searchParams.append("videoDuration", "short");
    } else if (filters.duration === "long") {
      searchUrl.searchParams.append("videoDuration", "long");
    }

    const searchRes = await fetch(searchUrl.toString());
    const searchData = await searchRes.json();

    if (!searchData.items || searchData.items.length === 0) {
      return [];
    }

    const videoIds = searchData.items
      .map((item: any) => item.id.videoId)
      .join(",");

    // 2. Get Video Statistics (Views, Duration, Channel ID)
    const videosUrl = new URL("https://www.googleapis.com/youtube/v3/videos");
    videosUrl.searchParams.append("part", "snippet,contentDetails,statistics");
    videosUrl.searchParams.append("id", videoIds);
    videosUrl.searchParams.append("key", YOUTUBE_API_KEY);

    const videosRes = await fetch(videosUrl.toString());
    const videosData = await videosRes.json();

    if (!videosData.items) return [];

    // Collect Channel IDs
    const channelIds = [
      ...new Set(videosData.items.map((item: any) => item.snippet.channelId)),
    ].join(",");

    // 3. Get Channel Statistics (Subscribers)
    const channelsUrl = new URL(
      "https://www.googleapis.com/youtube/v3/channels"
    );
    channelsUrl.searchParams.append("part", "statistics");
    // @ts-ignore
    channelsUrl.searchParams.append("id", channelIds);
    channelsUrl.searchParams.append("key", YOUTUBE_API_KEY);

    const channelsRes = await fetch(channelsUrl.toString());
    const channelsData = await channelsRes.json();

    const channelMap = new Map<string, number>();
    if (channelsData.items) {
      channelsData.items.forEach((item: any) => {
        const subCount = parseInt(item.statistics.subscriberCount || "0", 10);
        channelMap.set(item.id, subCount);
      });
    }

    // 4. Merge Data and Apply Strict Filters (Duration seconds, Min Subs, Min Views, Ratio)
    const results: VideoData[] = [];

    videosData.items.forEach((item: any) => {
      const durationSec = parseDuration(item.contentDetails.duration);
      const viewCount = parseInt(item.statistics.viewCount || "0", 10);
      const channelId = item.snippet.channelId;
      const subCount = channelMap.get(channelId) || 0;

      const { ratio, level } = calculatePerformance(viewCount, subCount);

      // --- Client Side Filtering ---

      // Duration Check
      if (filters.duration === "short" && durationSec > 60) return; // Strict 60s limit
      // Long is > 20m, API handles > 20m well, but we can double check
      if (filters.duration === "long" && durationSec < 1200) return;

      // Min Views Check
      if (filters.minViews > 0 && viewCount < filters.minViews) return;

      // Min Subs Check
      if (filters.minSubscribers > 0 && subCount < filters.minSubscribers)
        return;

      // Performance Level Filter
      // If user selected level 3, we show level 3, 4, 5 (or just 3? Usually "at least").
      // Let's assume user wants to see videos matching that specific level bucket or higher.
      // Or based on prompt "5단계로 구분해서 필터를 만들어줘", let's match exact or higher.
      // If filter is 0 (all), pass.
      if (filters.performanceLevel > 0 && level < filters.performanceLevel)
        return;

      results.push({
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail:
          item.snippet.thumbnails.medium?.url ||
          item.snippet.thumbnails.default?.url,
        publishedAt: item.snippet.publishedAt,
        channelId: channelId,
        channelTitle: item.snippet.channelTitle,
        duration: item.contentDetails.duration,
        viewCount: viewCount,
        subscriberCount: subCount,
        videoUrl: `https://www.youtube.com/watch?v=${item.id}`,
        channelUrl: `https://www.youtube.com/channel/${channelId}`,
        performanceRatio: ratio,
        level: level,
      });
    });

    return results;
  } catch (error) {
    console.error("Error fetching YouTube data:", error);
    throw error;
  }
};
