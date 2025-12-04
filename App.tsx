import React, { useState } from 'react';
import { FilterState, VideoData } from './types';
import { fetchVideos } from './services/youtubeService';
import FilterSection from './components/FilterSection';
import VideoCard from './components/VideoCard';
import VideoTable from './components/VideoTable';
import { LayoutGrid, List, FileSpreadsheet, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [hasSearched, setHasSearched] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    keyword: '',
    country: 'KR',
    duration: 'any',
    dateRange: 'all',
    minSubscribers: 0,
    minViews: 0,
    performanceLevel: 0,
  });

  const handleSearch = async () => {
    if (!filters.keyword.trim()) {
        alert("키워드를 입력해주세요.");
        return;
    }

    setLoading(true);
    setHasSearched(true);
    try {
      const results = await fetchVideos(filters);
      setVideos(results);
    } catch (error) {
      console.error(error);
      alert("데이터를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (videos.length === 0) return;

    // BOM for Excel Korean support
    const BOM = "\uFEFF";
    const header = ["제목", "채널명", "구독자수", "조회수", "비율(%)", "레벨", "영상길이", "업로드일", "URL"];
    
    const rows = videos.map(v => [
        `"${v.title.replace(/"/g, '""')}"`, // Escape quotes
        `"${v.channelTitle.replace(/"/g, '""')}"`,
        v.subscriberCount,
        v.viewCount,
        (v.performanceRatio * 100).toFixed(2),
        v.level,
        v.duration,
        new Date(v.publishedAt).toLocaleDateString(),
        v.videoUrl
    ]);

    const csvContent = [header.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `youtube_analysis_${filters.keyword}_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
               <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.498-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">YouTube Trend Analyzer</h1>
          </div>
          
          <div className="flex items-center gap-2">
             {/* View Toggle */}
             <div className="bg-gray-100 p-1 rounded-lg flex items-center">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow text-red-600' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-md transition-all ${viewMode === 'table' ? 'bg-white shadow text-red-600' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  <List className="w-4 h-4" />
                </button>
             </div>
             
             <button 
                onClick={handleExport}
                disabled={videos.length === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors
                   ${videos.length === 0 
                     ? 'bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed' 
                     : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:border-green-300'}`}
             >
                <FileSpreadsheet className="w-4 h-4" />
                <span>엑셀 저장</span>
             </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <FilterSection 
          filters={filters} 
          setFilters={setFilters} 
          onSearch={handleSearch}
          loading={loading}
        />

        {/* Results Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-gray-600 font-medium">
             {hasSearched && (
               <>
                  <span className="text-gray-900 font-bold">{videos.length}</span>개의 영상이 검색되었습니다.
               </>
             )}
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
           <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-red-600 animate-spin mb-4" />
              <p className="text-gray-500">YouTube 데이터를 분석하고 있습니다...</p>
           </div>
        ) : (
          <>
            {videos.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {videos.map(video => (
                    <VideoCard key={video.id} video={video} />
                  ))}
                </div>
              ) : (
                <VideoTable videos={videos} />
              )
            ) : (
              hasSearched && (
                <div className="text-center py-20 bg-white rounded-lg border border-dashed border-gray-300">
                   <p className="text-gray-500">검색 결과가 없습니다. 필터 조건을 변경해보세요.</p>
                </div>
              )
            )}

            {!hasSearched && !loading && (
               <div className="text-center py-20 bg-white rounded-lg border border-dashed border-gray-300">
                  <p className="text-gray-500">검색 키워드와 국가를 선택하여 분석을 시작하세요.</p>
               </div>
            )}
          </>
        )}

      </main>
    </div>
  );
};

export default App;