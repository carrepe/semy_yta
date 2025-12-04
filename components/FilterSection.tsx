import React from "react";
import { FilterState } from "../types";
import {
  COUNTRIES,
  DATE_RANGES,
  SUBSCRIBER_OPTIONS,
  VIEW_OPTIONS,
} from "../constants";
import { Search, Filter } from "lucide-react";

interface Props {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onSearch: () => void;
  loading: boolean;
}

const FilterSection: React.FC<Props> = ({
  filters,
  setFilters,
  onSearch,
  loading,
}) => {
  const handleChange = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-100">
      <div className="flex flex-col gap-4">
        {/* Top Row: Search & Main Actions */}
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              키워드 (Keyword)
            </label>
            <div className="relative">
              <input
                type="text"
                value={filters.keyword}
                onChange={(e) => handleChange("keyword", e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSearch()}
                placeholder="검색어를 입력하세요 (예: 건강정보)"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              * 국가 선택 시 해당 국가 언어로 자동 검색 (API 지역 설정)
            </p>
          </div>

          <div className="w-full md:w-64">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              국가 (Country)
            </label>
            <select
              value={filters.country}
              onChange={(e) => handleChange("country", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none bg-white"
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-auto">
            <button
              onClick={onSearch}
              disabled={loading}
              className={`w-full md:w-auto px-6 py-2 rounded-lg font-bold text-white shadow-md transition-colors flex items-center justify-center gap-2
                ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                }`}
            >
              {loading ? "검색 중..." : "검색 실행"}
            </button>
          </div>
        </div>

        <div className="border-t border-gray-200 my-2"></div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Duration */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">
              영상 길이
            </label>
            <select
              value={filters.duration}
              onChange={(e) => handleChange("duration", e.target.value)}
              className="w-full p-2 text-sm border border-gray-200 rounded-md bg-gray-50 focus:bg-white focus:border-red-500 outline-none"
            >
              <option value="any">전체</option>
              <option value="short">숏폼 (60초 이내)</option>
              <option value="long">롱폼 (20분 이상)</option>
            </select>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">
              기간 (업로드일)
            </label>
            <select
              value={filters.dateRange}
              onChange={(e) => handleChange("dateRange", e.target.value)}
              className="w-full p-2 text-sm border border-gray-200 rounded-md bg-gray-50 focus:bg-white focus:border-red-500 outline-none"
            >
              {DATE_RANGES.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>

          {/* Subscribers */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">
              최소 구독자 수
            </label>
            <select
              value={filters.minSubscribers}
              onChange={(e) =>
                handleChange("minSubscribers", Number(e.target.value))
              }
              className="w-full p-2 text-sm border border-gray-200 rounded-md bg-gray-50 focus:bg-white focus:border-red-500 outline-none"
            >
              {SUBSCRIBER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Views */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">
              최소 조회수
            </label>
            <select
              value={filters.minViews}
              onChange={(e) => handleChange("minViews", Number(e.target.value))}
              className="w-full p-2 text-sm border border-gray-200 rounded-md bg-gray-50 focus:bg-white focus:border-red-500 outline-none"
            >
              {VIEW_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Performance Level */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-4">
            <label className="block text-xs font-semibold text-gray-500 mb-2">
              성과 등급 (구독자 대비 조회수 비율)
            </label>
            <div className="flex flex-wrap gap-2">
              {[0, 1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  onClick={() => handleChange("performanceLevel", level)}
                  className={`px-4 py-2 text-sm rounded-full border transition-all
                ${
                  filters.performanceLevel === level
                    ? "bg-purple-100 border-purple-500 text-purple-700 font-bold shadow-sm"
                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
                >
                  {level === 0 ? "전체 보기" : `Level ${level}`}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-2 ml-1">
              * Level 3 (비율 ~1:1), Level 5 (비율 &gt; 5:1, 매우 높음)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
