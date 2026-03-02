import { Memory, TAG_OPTIONS, getTagColor } from "../types/memory";
import { TagIcon } from "./TagIcon";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { X, Calendar, MapPin, Pencil, Trash2, ExternalLink } from "lucide-react";
import { openMapApp } from "../utils/mapLinks";

type Props = {
  memory: Memory;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onTagClick?: (tag: string) => void;
};

export function MemoryDetailSheet({ memory, onClose, onEdit, onDelete, onTagClick }: Props) {
  const primaryTag = memory.tags[0];
  const accentColor = primaryTag ? getTagColor(primaryTag, 'dark') : '#9CA3AF';

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={onClose}>
      <div
        className="bg-white w-full rounded-t-3xl shadow-2xl max-h-[80vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
        style={{ borderTop: `4px solid ${accentColor}` }}
      >
        {/* 드래그 핸들 */}
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        <div className="p-4">
          {/* 헤더 */}
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-xl font-bold pr-8">{memory.title}</h2>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 -mt-1"
              onClick={onClose}
            >
              <X className="size-5" />
            </Button>
          </div>

          {/* 내용 */}
          <div className="space-y-4">
            {memory.photo && (
              <div>
                <img
                  src={memory.photo}
                  alt={memory.title}
                  className="w-full h-64 object-cover rounded-xl shadow-md"
                />
              </div>
            )}

            {memory.description && (
              <div>
                <p className="text-gray-600 whitespace-pre-wrap">{memory.description}</p>
              </div>
            )}

            <div className="grid grid-cols-1 gap-3 text-sm">
              {/* 주소 */}
              {(memory.placeName || memory.shortLocation || memory.address) && (
                <button
                  onClick={() => openMapApp(memory.lat, memory.lng, memory.placeName)}
                  className="flex items-start gap-2 text-left p-3 rounded-xl hover:bg-blue-50 transition-colors group/map border border-transparent hover:border-blue-200"
                >
                  <MapPin className="size-5 text-blue-500 mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    {/* 1줄: 장소명 · 간단위치 */}
                    {(memory.placeName || memory.shortLocation) ? (
                      <div className="font-semibold text-gray-800 mb-1 flex items-center gap-2">
                        <span>
                          {memory.placeName && memory.shortLocation 
                            ? `${memory.placeName} · ${memory.shortLocation}`
                            : memory.placeName || memory.shortLocation}
                        </span>
                        <ExternalLink className="size-4 text-blue-500 opacity-0 group-hover/map:opacity-100 transition-opacity" />
                      </div>
                    ) : (
                      /* 장소명/간단위치 없으면 주소를 메인으로 */
                      <div className="font-semibold text-gray-800 mb-1 flex items-center gap-2">
                        <span>{memory.address}</span>
                        <ExternalLink className="size-4 text-blue-500 opacity-0 group-hover/map:opacity-100 transition-opacity" />
                      </div>
                    )}
                    {/* 2줄: 전체 주소 (옅은 회색) - 장소명이 있을 때만 */}
                    {(memory.placeName || memory.shortLocation) && memory.address && (
                      <div className="text-sm text-gray-400 mb-2">
                        {memory.address}
                      </div>
                    )}
                    {/* 좌표 */}
                    <div className="text-xs text-gray-300">
                      {memory.lat.toFixed(6)}, {memory.lng.toFixed(6)}
                    </div>
                  </div>
                </button>
              )}

              {/* 날짜 */}
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-gray-500" />
                <span className="text-gray-700">
                  {new Date(memory.date).toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    weekday: "long",
                  })}
                </span>
              </div>
            </div>

            {memory.tags.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">태그</h4>
                <div className="flex flex-wrap gap-2">
                  {memory.tags.slice(0, 6).map(tag => {
                    const tagOption = TAG_OPTIONS.find(t => t.value === tag);
                    return (
                      <button
                        key={tag}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onTagClick) {
                            onTagClick(tag);
                          }
                        }}
                        className="px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 hover:shadow-md transition-shadow"
                        style={{
                          backgroundColor: getTagColor(tag, 'light'),
                          color: '#374151'
                        }}
                      >
                        {tagOption && <TagIcon iconName={tagOption.icon} className="size-3.5" />}
                        {tagOption?.label || tag}
                      </button>
                    );
                  })}
                  {memory.tags.length > 6 && (
                    <span className="px-3 py-1.5 rounded-full text-sm bg-gray-100 text-gray-600">
                      +{memory.tags.length - 6}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* 액션 버튼 */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1 gap-2"
                onClick={onEdit}
              >
                <Pencil className="size-4" />
                수정하기
              </Button>
              <Button
                variant="outline"
                className="flex-1 gap-2 border-gray-200 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200"
                onClick={() => {
                  if (confirm("이 기억을 삭제하시겠습니까?")) {
                    onDelete();
                  }
                }}
              >
                <Trash2 className="size-4" />
                삭제하기
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}