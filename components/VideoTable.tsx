import React from 'react';
import { VideoData } from '../types';
import { ExternalLink } from 'lucide-react';

interface Props {
  videos: VideoData[];
}

const VideoTable: React.FC<Props> = ({ videos }) => {
  const getLevelBadge = (level: number, ratio: number) => {
    let colorClass = 'bg-gray-100 text-gray-600';
    if(level === 5) colorClass = 'bg-purple-100 text-purple-700';
    else if(level === 4) colorClass = 'bg-blue-100 text-blue-700';
    else if(level === 3) colorClass = 'bg-green-100 text-green-700';
    else if(level === 2) colorClass = 'bg-yellow-100 text-yellow-700';

    return (
      <div className="flex flex-col items-start">
        <span className={`px-2 py-0.5 rounded text-xs font-bold ${colorClass}`}>Level {level}</span>
        <span className="text-xs text-gray-500 mt-1">{(ratio * 100).toFixed(1)}% Ratio</span>
      </div>
    );
  };

  return (
    <div className="w-full overflow-x-auto shadow-md rounded-lg border border-gray-200">
      <table className="w-full bg-white text-sm text-left text-gray-500 min-w-[1000px]">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
          <tr>
            <th scope="col" className="px-6 py-3 w-[120px]">Image</th>
            <th scope="col" className="px-6 py-3 min-w-[300px]">Title</th>
            <th scope="col" className="px-6 py-3">Channel</th>
            <th scope="col" className="px-6 py-3">Stats (Views/Subs)</th>
            <th scope="col" className="px-6 py-3">Performance</th>
            <th scope="col" className="px-6 py-3">Date</th>
          </tr>
        </thead>
        <tbody>
          {videos.map((video) => (
            <tr key={video.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
                <div className="w-24 h-16 rounded overflow-hidden relative">
                   <img src={video.thumbnail} alt="thumb" className="w-full h-full object-cover" />
                </div>
              </td>
              <td className="px-6 py-4">
                <a href={video.videoUrl} target="_blank" rel="noreferrer" className="font-medium text-gray-900 hover:text-red-600 line-clamp-2 flex items-center gap-1 group">
                  {video.title}
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </td>
              <td className="px-6 py-4">
                 <a href={video.channelUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:underline">
                    {/* Channel Avatar Placeholder */}
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold">
                        {video.channelTitle.charAt(0)}
                    </div>
                    {video.channelTitle}
                 </a>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="font-bold text-gray-900">{video.viewCount.toLocaleString()} views</span>
                  <span className="text-xs text-gray-400">{video.subscriberCount > 0 ? `${video.subscriberCount.toLocaleString()} subs` : 'Hidden subs'}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                {getLevelBadge(video.level, video.performanceRatio)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {new Date(video.publishedAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VideoTable;