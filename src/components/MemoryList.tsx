import { useState } from "react";
import { Memory, TAG_OPTIONS } from "../types/memory";
import { MemoryCard } from "./MemoryCard";
import { TagIcon } from "./TagIcon";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Search, Filter } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

type Props = {
  memories: Memory[];
  selectedMemoryId?: string | null;
  onSelectMemory: (memory: Memory) => void;
  onEditMemory: (memory: Memory) => void;
  onDeleteMemory: (id: string) => void;
};

export function MemoryList({
  memories,
  selectedMemoryId,
  onSelectMemory,
  onEditMemory,
  onDeleteMemory,
}: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const filteredMemories = memories.filter(memory => {
    // 검색어 필터
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesTitle = memory.title.toLowerCase().includes(query);
      const matchesDescription = memory.description?.toLowerCase().includes(query);
      if (!matchesTitle && !matchesDescription) return false;
    }

    // 태그 필터
    if (selectedTags.length > 0) {
      const hasMatchingTag = selectedTags.some(tag => memory.tags.includes(tag));
      if (!hasMatchingTag) return false;
    }

    return true;
  });

  return (
    <div className="flex flex-col h-full bg-white border-r">
      <div className="p-4 border-b space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <Input
            placeholder="제목이나 내용 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Filter className="size-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">태그 필터</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {TAG_OPTIONS.map(tag => (
              <Badge
                key={tag.value}
                variant={selectedTags.includes(tag.value) ? "default" : "outline"}
                className="cursor-pointer hover:bg-blue-100 transition-colors text-xs gap-1"
                onClick={() => toggleTag(tag.value)}
              >
                <TagIcon iconName={tag.icon} className="size-3" />
                <span>{tag.label}</span>
              </Badge>
            ))}
          </div>
        </div>

        <div className="text-sm text-gray-500">
          전체 {memories.length}개 / 검색 결과 {filteredMemories.length}개
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {filteredMemories.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              {memories.length === 0
                ? "아직 기억이 없습니다.\n지도를 더블클릭해서 첫 기억을 추가해보세요!"
                : "검색 결과가 없습니다."}
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
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}