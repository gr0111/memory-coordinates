import { useState } from "react";
import { Memory, TAG_OPTIONS, getTagColor } from "../types/memory";
import { MemoryCard } from "./MemoryCard";
import { TagIcon } from "./TagIcon";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Search, Filter } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Button } from "./ui/button";

type Props = {
  memories: Memory[];
  selectedMemoryId?: string | null;
  onSelectMemory: (memory: Memory) => void;
  onEditMemory: (memory: Memory) => void;
  onDeleteMemory: (id: string) => void;
  onTagClick?: (tag: string) => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
};

export function MemoryListSheet({
  memories,
  selectedMemoryId,
  onSelectMemory,
  onEditMemory,
  onDeleteMemory,
  onTagClick,
  isExpanded = false,
  onToggleExpand,
}: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const filteredMemories = memories.filter(memory => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesTitle = memory.title.toLowerCase().includes(query);
      const matchesDescription = memory.description?.toLowerCase().includes(query);
      if (!matchesTitle && !matchesDescription) return false;
    }

    if (selectedTags.length > 0) {
      const hasMatchingTag = selectedTags.some(tag => memory.tags.includes(tag));
      if (!hasMatchingTag) return false;
    }

    return true;
  });

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-gradient-to-b from-white to-blue-50/30 rounded-t-3xl shadow-2xl transition-all duration-300 ease-out ${
        isExpanded ? 'h-[85vh]' : 'h-[40vh]'
      }`}
      style={{ touchAction: 'pan-y' }}
    >
      {/* 드래그 핸들 */}
      <div className="flex justify-center pt-3 pb-2">
        <button
          onClick={onToggleExpand}
          className="w-12 h-1.5 bg-gray-300 rounded-full active:bg-gray-400 transition-colors"
        />
      </div>

      <div className="flex flex-col h-[calc(100%-24px)]">
        {/* 헤더 */}
        <div className="px-4 pt-2 pb-3 border-b border-blue-100">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-bold text-lg text-gray-800">내 기억들</h2>
              <p className="text-xs text-gray-500">
                전체 {memories.length}개 · 검색 결과 {filteredMemories.length}개
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-1 relative"
            >
              <Filter className="size-4" />
              <span>필터</span>
              {selectedTags.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                  {selectedTags.length}
                </span>
              )}
            </Button>
          </div>

          {/* 검색 */}
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <Input
              placeholder="제목이나 내용 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* 태그 필터 */}
          {showFilters && (
            <div className="mt-3 pt-3 border-t border-blue-100">
              <div className="flex flex-wrap gap-1.5">
                {TAG_OPTIONS.map(tag => (
                  <span
                    key={tag.value}
                    className={`text-xs gap-1 px-3 py-1.5 rounded-full flex items-center cursor-pointer transition-all ${
                      selectedTags.includes(tag.value) ? 'ring-2 ring-offset-1' : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{
                      backgroundColor: getTagColor(tag.value, 'light'),
                      color: '#374151',
                      ringColor: getTagColor(tag.value, 'dark')
                    }}
                    onClick={() => toggleTag(tag.value)}
                  >
                    <TagIcon iconName={tag.icon} className="size-3" />
                    <span>{tag.label}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 리스트 */}
        <ScrollArea className="flex-1">
          <div className="p-3 space-y-2">
            {filteredMemories.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-sm px-4">
                {memories.length === 0
                  ? "✨ 아직 기억이 없습니다.\n지도를 더블클릭해서\n첫 기억을 추가해보세요!"
                  : "😢 검색 결과가 없습니다."}
              </div>
            ) : (
              filteredMemories.map(memory => (
                <MemoryCard
                  key={memory.id}
                  memory={memory}
                  isSelected={memory.id === selectedMemoryId}
                  onClick={() => onSelectMemory(memory)}
                  onEdit={() => onEditMemory(memory)}
                  onDelete={() => onDeleteMemory(memory.id)}
                  onTagClick={onTagClick}
                />
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}