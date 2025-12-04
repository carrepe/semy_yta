import React from 'react';
import { VideoData } from '../types';
import { PlayCircle, Users, BarChart2 } from 'lucide-react';

interface Props {
  video: VideoData;
}

const VideoCard: React.FC<Props> = ({ video }) => {
  const getLevelColor = (level: number) => {
    switch(level) {
      case 5: return 'bg-purple-100 text-purple-700 border-purple-200';
      case 4: return 'bg-blue-100 text-blue-700 border-blue-200';
      case 3: return 'bg-green-100 text-green-700 border-green-200';
      case 2: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow border border-gray-100 overflow-hidden flex flex-col h-full">
      {/* Thumbnail */}
      <div className="relative aspect-video group cursor-pointer" onClick={() => window.open(video.videoUrl, '_blank')}>
        <img 
          src={video.thumbnail} 
          alt={video.title} 
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
          <PlayCircle className="text-white opacity-0 group-hover:opacity-100 w-12 h-12 drop-shadow-lg transform scale-90 group-hover:scale-100 transition-all" />
        </div>
        <span className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-0.5 rounded">
          {video.duration.replace('PT','').replace('H',':').replace('M',':').replace('S','')}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 
          className="font-bold text-gray-800 text-sm line-clamp-2 mb-2 cursor-pointer hover:text-red-600"
          onClick={() => window.open(video.videoUrl, '_blank')}
          title={video.title}
        >
          {video.title}
        </h3>

        <div className="flex items-center gap-2 mb-3 cursor-pointer" onClick={() => window.open(video.channelUrl, '_blank')}>
           <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500 font-bold">
             {video.channelTitle.charAt(0)}
           </div>
           <span className="text-xs text-gray-600 hover:underline truncate flex-1">{video.channelTitle}</span>
        </div>

        <div className="mt-auto grid grid-cols-2 gap-2 text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
          <div className="flex items-center gap-1">
             <BarChart2 className="w-3 h-3" />
             <span>{video.viewCount.toLocaleString()} views</span>
          </div>
          <div className="flex items-center gap-1">
             <Users className="w-3 h-3" />
             <span>{video.subscriberCount > 0 ? video.subscriberCount.toLocaleString() : '비공개'}</span>
          </div>
        </div>

        {/* Level Badge */}
        <div className={`mt-3 flex items-center justify-between px-3 py-2 rounded-md border ${getLevelColor(video.level)}`}>
          <div className="flex items-center gap-1 font-bold text-xs uppercase">
            <BarChart2 className="w-4 h-4" />
            <span>Level {video.level}</span>
          </div>
          <span className="text-xs font-semibold">
            {(video.performanceRatio * 100).toFixed(0)}% Ratio
          </span>
        </div>
        
        <div className="text-[10px] text-gray-400 mt-2 text-right">
          {new Date(video.publishedAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default VideoCard;