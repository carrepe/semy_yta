import { CountryOption } from "./types";

// YouTube API Key from environment variables
export const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

if (!YOUTUBE_API_KEY) {
  throw new Error(
    'YouTube API 키가 설정되지 않았습니다. .env 파일에 VITE_YOUTUBE_API_KEY를 설정해주세요.'
  );
}

export const COUNTRIES: CountryOption[] = [
  { code: 'KR', name: '한국 (South Korea)', lang: 'ko' },
  { code: 'US', name: '미국 (USA)', lang: 'en' },
  { code: 'JP', name: '일본 (Japan)', lang: 'ja' },
  { code: 'VN', name: '베트남 (Vietnam)', lang: 'vi' },
  { code: 'TH', name: '태국 (Thailand)', lang: 'th' },
  { code: 'ID', name: '인도네시아 (Indonesia)', lang: 'id' },
  { code: 'IN', name: '인도 (India)', lang: 'hi' },
];

export const DATE_RANGES = [
  { label: '무제한 (All Time)', value: 'all' },
  { label: '1주 이내 (1 Week)', value: '7d' },
  { label: '2주 이내 (2 Weeks)', value: '14d' },
  { label: '1개월 이내 (1 Month)', value: '1m' },
  { label: '2개월 이내 (2 Months)', value: '2m' },
  { label: '3개월 이내 (3 Months)', value: '3m' },
  { label: '6개월 이내 (6 Months)', value: '6m' },
  { label: '9개월 이내 (9 Months)', value: '9m' },
  { label: '1년 이내 (1 Year)', value: '1y' },
];

export const SUBSCRIBER_OPTIONS = [
  { label: '미적용', value: 0 },
  { label: '5,000명 이상', value: 5000 },
  { label: '10,000명 이상', value: 10000 },
  { label: '30,000명 이상', value: 30000 },
  { label: '50,000명 이상', value: 50000 },
  { label: '100,000명 이상', value: 100000 },
];

export const VIEW_OPTIONS = [
  { label: '무제한', value: 0 },
  { label: '5,000회 이상', value: 5000 },
  { label: '10,000회 이상', value: 10000 },
  { label: '30,000회 이상', value: 30000 },
  { label: '50,000회 이상', value: 50000 },
  { label: '100,000회 이상', value: 100000 },
];

export const LEVEL_DESCRIPTIONS = {
  1: '낮음',
  2: '보통',
  3: '좋음 (1:1 비율)',
  4: '높음',
  5: '초대박 (바이럴)',
};