import { useState, useEffect } from "react";
import { Memory, TAG_OPTIONS } from "../types/memory";
import { TagIcon } from "./TagIcon";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { X } from "lucide-react";
import { Badge } from "./ui/badge";

type Props = {
  memory?: Memory | null;
  initialLat?: number;
  initialLng?: number;
  onSave: (data: Omit<Memory, "id" | "createdAt">) => void;
  onCancel: () => void;
};

export function MemoryForm({ memory, initialLat, initialLng, onSave, onCancel }: Props) {
  const [title, setTitle] = useState(memory?.title || "");
  const [description, setDescription] = useState(memory?.description || "");
  const [date, setDate] = useState(
    memory?.date ? new Date(memory.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(memory?.tags || []);
  const [lat, setLat] = useState(memory?.lat || initialLat || 37.5665);
  const [lng, setLng] = useState(memory?.lng || initialLng || 126.978);

  useEffect(() => {
    if (memory) {
      setTitle(memory.title);
      setDescription(memory.description || "");
      setDate(new Date(memory.date).toISOString().split("T")[0]);
      setSelectedTags(memory.tags);
      setLat(memory.lat);
      setLng(memory.lng);
    }
  }, [memory]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      description: description.trim() || undefined,
      date: new Date(date).toISOString(),
      tags: selectedTags,
      lat,
      lng,
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            {memory ? "기억 수정" : "새 기억 추가"}
          </CardTitle>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onCancel}>
            <X className="size-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">제목 *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="이 순간의 제목을 입력하세요"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">메모</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="이 기억에 대한 메모를 작성하세요"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="date">날짜</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div>
            <Label>태그</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {TAG_OPTIONS.map(tag => (
                <Badge
                  key={tag.value}
                  variant={selectedTags.includes(tag.value) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-blue-100 transition-colors gap-1.5"
                  onClick={() => toggleTag(tag.value)}
                >
                  <TagIcon iconName={tag.icon} className="size-3.5" />
                  <span>{tag.label}</span>
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="lat">위도</Label>
              <Input
                id="lat"
                type="number"
                step="any"
                value={lat}
                onChange={(e) => setLat(parseFloat(e.target.value))}
              />
            </div>
            <div>
              <Label htmlFor="lng">경도</Label>
              <Input
                id="lng"
                type="number"
                step="any"
                value={lng}
                onChange={(e) => setLng(parseFloat(e.target.value))}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="submit" className="flex-1">
              {memory ? "수정 완료" : "추가하기"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              취소
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}