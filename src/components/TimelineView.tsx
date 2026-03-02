import { Memory, TAG_OPTIONS, getTagColor } from "../types/memory";
import { TagIcon } from "./TagIcon";
import { ScrollArea } from "./ui/scroll-area";
import { Card, CardContent } from "./ui/card";
import { Calendar, MapPin, Image as ImageIcon, MoreVertical, Pencil, Trash2, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

type Props = {
  memories: Memory[];
  onSelectMemory: (memory: Memory) => void;
  onEditMemory: (memory: Memory) => void;
  onDeleteMemory: (id: string) => void;
  onTagClick?: (tag: string) => void;
  onCreateMemory?: () => void;
  isFirstTimeUser?: boolean;
};

export function TimelineView({ memories, onSelectMemory, onEditMemory, onDeleteMemory, onTagClick, onCreateMemory, isFirstTimeUser = false }: Props) {
  // 날짜별로 그룹화 (년도 > 월)
  const groupedMemories = memories.reduce((acc, memory) => {
    const date = new Date(memory.date);
    const year = date.getFullYear();
    const month = date.getMonth();
    
    if (!acc[year]) acc[year] = {};
    if (!acc[year][month]) acc[year][month] = [];
    
    acc[year][month].push(memory);
    return acc;
  }, {} as Record<number, Record<number, Memory[]>>);

  const years = Object.keys(groupedMemories).map(Number).sort((a, b) => b - a);

  const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ko-KR", {
      month: "long",
      day: "numeric",
      weekday: "short",
    });
  };

  const [expandedYears, setExpandedYears] = useState(new Set<number>());

  const toggleYear = (year: number) => {
    const newExpandedYears = new Set(expandedYears);
    if (newExpandedYears.has(year)) {
      newExpandedYears.delete(year);
    } else {
      newExpandedYears.add(year);
    }
    setExpandedYears(newExpandedYears);
  };

  return (
    <div className="h-full bg-gradient-to-b from-blue-50/30 to-purple-50/30">
      <ScrollArea className="h-full">
        <div className="max-w-3xl mx-auto p-4 pb-20">
          {years.length === 0 ? (
            // 아예 처음 사용자
            <div className="text-center py-20 px-6">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="size-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                첫 기억을 기록해보세요
              </h3>
              <p className="text-gray-500 mb-6">
                당신 인생의 소중한 순간들을<br />
                이곳에 남겨보세요
              </p>
              {onCreateMemory && (
                <Button
                  onClick={onCreateMemory}
                  className={`bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg ${
                    isFirstTimeUser ? 'animate-bounce' : ''
                  }`}
                >
                  <Calendar className="size-4 mr-2" />
                  첫 기억 추가하기
                </Button>
              )}
            </div>
          ) : (
            years.map(year => {
              const yearMemories = Object.values(groupedMemories[year]).flat();

              return (
                <div key={year} className="mb-12">
                  {/* 연도 헤더 */}
                  <button
                    onClick={() => toggleYear(year)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl font-bold text-purple-700">{year}</div>
                      <div className="text-sm text-purple-600">
                        {yearMemories.length}개의 기억
                      </div>
                    </div>
                    {/* 접기/펼치기 아이콘 */}
                    {expandedYears.has(year) ? (
                      <ChevronUp className="size-5 text-purple-600 transition-transform" />
                    ) : (
                      <ChevronDown className="size-5 text-purple-600 transition-transform" />
                    )}
                  </button>

                  {/* 월별로 표시 */}
                  {expandedYears.has(year) && (
                    Object.keys(groupedMemories[year])
                      .map(Number)
                      .sort((a, b) => b - a)
                      .map(month => {
                        const monthMemories = groupedMemories[year][month];

                        return (
                          <div key={month} className="mb-8 ml-4">
                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                              <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                              <span>{monthNames[month]}</span>
                              <span className="text-base text-purple-600 font-medium">· {monthMemories.length}</span>
                            </h3>

                            {/* 타임라인 */}
                            <div className="relative pl-8">
                              {/* 수직선 */}
                              <div className="absolute left-[7px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-200 to-blue-200" />

                              {/* 기억 카드들 */}
                              <div className="space-y-4">
                                {monthMemories
                                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                  .map(memory => {
                                    const primaryTag = memory.tags[0];
                                    const tagColor = primaryTag ? getTagColor(primaryTag, 'dark') : '#9CA3AF';

                                    return (
                                      <div key={memory.id} className="relative">
                                        {/* 타임라인 점 */}
                                        <div
                                          className="absolute -left-8 top-4 w-4 h-4 rounded-full border-4 border-white shadow-md"
                                          style={{ backgroundColor: tagColor }}
                                        />

                                        {/* 카드 */}
                                        <Card
                                          className="cursor-pointer hover:shadow-lg transition-all"
                                          onClick={() => onSelectMemory(memory)}
                                          style={{
                                            borderLeft: `4px solid ${tagColor}`
                                          }}
                                        >
                                          <CardContent className="p-4">
                                            <div className="flex items-start justify-between gap-2 mb-2">
                                              <h4 className="font-semibold text-base">{memory.title}</h4>
                                              <div className="text-xs text-gray-500 shrink-0">
                                                {formatDate(memory.date)}
                                              </div>
                                            </div>

                                            {memory.description && (
                                              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                                {memory.description}
                                              </p>
                                            )}

                                            <div className="flex flex-wrap gap-1.5 mb-2">
                                              {memory.tags.map(tag => {
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
                                                    className="text-xs gap-1 px-2 py-1 rounded-full flex items-center hover:shadow-sm transition-shadow"
                                                    style={{
                                                      backgroundColor: getTagColor(tag, 'light'),
                                                      color: '#374151'
                                                    }}
                                                  >
                                                    {tagOption && <TagIcon iconName={tagOption.icon} className="size-3" />}
                                                    {tagOption?.label || tag}
                                                  </button>
                                                );
                                              })}
                                            </div>

                                            {/* 주소 */}
                                            {(memory.placeName || memory.shortLocation || memory.address) && (
                                              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                <MapPin className="size-3 shrink-0" />
                                                <span className="line-clamp-1">
                                                  {memory.placeName && memory.shortLocation 
                                                    ? `${memory.placeName} · ${memory.shortLocation}`
                                                    : memory.placeName || memory.shortLocation || memory.address}
                                                </span>
                                              </div>
                                            )}
                                          </CardContent>
                                        </Card>
                                      </div>
                                    );
                                  })}
                              </div>
                            </div>
                          </div>
                        );
                      })
                  )}
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}