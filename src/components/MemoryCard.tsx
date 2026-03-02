import { Memory, TAG_OPTIONS, getTagColor } from "../types/memory";
import { TagIcon } from "./TagIcon";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Calendar, MapPin, Pencil, Trash2, MoreVertical, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { openMapApp } from "../utils/mapLinks";

type Props = {
  memory: Memory;
  isSelected?: boolean;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onTagClick?: (tag: string) => void;
};

const getTagLabel = (tag: string) => {
  const tagOption = TAG_OPTIONS.find(t => t.value === tag);
  return { label: tagOption?.label || tag, icon: tagOption?.icon };
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export function MemoryCard({ memory, isSelected = false, onClick, onEdit, onDelete, onTagClick }: Props) {
  const [showActions, setShowActions] = useState(false);

  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = () => setShowActions(false);
    if (showActions) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [showActions]);

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${
        isSelected ? "ring-2 ring-purple-400 shadow-md" : ""
      }`}
      onClick={onClick}
      style={{
        borderLeft: memory.tags[0] ? `4px solid ${getTagColor(memory.tags[0], 'dark')}` : undefined
      }}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-base line-clamp-1">{memory.title}</h3>
          {(onEdit || onDelete) && (
            <div className="relative shrink-0">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-gray-400 hover:text-gray-600"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowActions(!showActions);
                }}
              >
                <MoreVertical className="size-4" />
              </Button>

              {/* 액션 메뉴 */}
              {showActions && (
                <div className="absolute right-0 top-8 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-10 min-w-[100px]">
                  {onEdit && (
                    <button
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowActions(false);
                        onEdit();
                      }}
                    >
                      <Pencil className="size-3.5" />
                      <span>수정</span>
                    </button>
                  )}
                  {onDelete && (
                    <button
                      className="w-full px-3 py-2 text-left text-sm hover:bg-red-50 flex items-center gap-2 text-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowActions(false);
                        if (confirm("이 기억을 삭제하시겠습니까?")) {
                          onDelete();
                        }
                      }}
                    >
                      <Trash2 className="size-3.5" />
                      <span>삭제</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {memory.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{memory.description}</p>
        )}

        {/* 주소 */}
        {(memory.placeName || memory.shortLocation || memory.address) && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              openMapApp(memory.lat, memory.lng, memory.placeName);
            }}
            className="w-full text-left mb-2 group/map hover:bg-blue-50 rounded-lg p-2 -mx-2 transition-colors"
          >
            <div className="flex items-start gap-1.5 text-sm">
              <MapPin className="size-3.5 mt-0.5 shrink-0 text-blue-500" />
              <div className="flex-1 min-w-0">
                {/* 1줄: 장소명 · 간단위치 */}
                {(memory.placeName || memory.shortLocation) ? (
                  <div className="text-gray-800 font-medium line-clamp-1 flex items-center gap-1">
                    <span>
                      {memory.placeName && memory.shortLocation 
                        ? `${memory.placeName} · ${memory.shortLocation}`
                        : memory.placeName || memory.shortLocation}
                    </span>
                    <ExternalLink className="size-3 text-blue-500 opacity-0 group-hover/map:opacity-100 transition-opacity shrink-0" />
                  </div>
                ) : (
                  /* 장소명/간단위치 없으면 주소를 메인으로 */
                  <div className="text-gray-800 font-medium line-clamp-1 flex items-center gap-1">
                    <span>{memory.address}</span>
                    <ExternalLink className="size-3 text-blue-500 opacity-0 group-hover/map:opacity-100 transition-opacity shrink-0" />
                  </div>
                )}
                {/* 2줄: 전체 주소 (옅은 회색) - 장소명이 있을 때만 */}
                {(memory.placeName || memory.shortLocation) && memory.address && (
                  <div className="text-xs text-gray-400 line-clamp-1 mt-0.5">
                    {memory.address}
                  </div>
                )}
              </div>
            </div>
          </button>
        )}

        {/* 날짜와 태그 */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          <div className="flex items-center gap-1">
            <Calendar className="size-3" />
            <span>{formatDate(memory.date)}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 line-clamp-2">
          {memory.tags.slice(0, 5).map(tag => {
            const tagInfo = getTagLabel(tag);
            return (
              <button
                key={tag}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onTagClick) {
                    onTagClick(tag);
                  }
                }}
                className="text-xs gap-1 px-2 py-1 rounded-full flex items-center hover:shadow-sm transition-shadow"
                style={{ 
                  backgroundColor: getTagColor(tag, 'light'),
                  color: '#374151'
                }}
              >
                {tagInfo.icon && <TagIcon iconName={tagInfo.icon} className="size-3" />}
                {tagInfo.label}
              </button>
            );
          })}
          {memory.tags.length > 5 && (
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
              +{memory.tags.length - 5}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}