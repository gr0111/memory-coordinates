import { useState, useEffect } from "react";
import { Memory, TAG_OPTIONS, getTagColor } from "../types/memory";
import { TagIcon } from "./TagIcon";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { X } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { toast } from "react-toastify";
import { Upload } from "lucide-react";
import { AddressSearch } from "./AddressSearch";
import { MapPin } from "lucide-react";

type Props = {
  memory?: Memory | null;
  initialLat?: number;
  initialLng?: number;
  initialAddress?: string;
  onSave: (data: Omit<Memory, "id" | "createdAt">) => void;
  onCancel: () => void;
};

export function MemoryFormSheet({ memory, initialLat, initialLng, initialAddress, onSave, onCancel }: Props) {
  const [title, setTitle] = useState(memory?.title || "");
  const [description, setDescription] = useState(memory?.description || "");
  const [date, setDate] = useState(
    memory?.date ? new Date(memory.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(memory?.tags || []);
  const [lat, setLat] = useState(memory?.lat || initialLat || 37.5665);
  const [lng, setLng] = useState(memory?.lng || initialLng || 126.978);
  const [photo, setPhoto] = useState<string | undefined>(memory?.photo);
  const [selectedAddress, setSelectedAddress] = useState(memory?.address || initialAddress || "");
  const [placeName, setPlaceName] = useState(memory?.placeName || "");
  const [shortLocation, setShortLocation] = useState(memory?.shortLocation || "");
  const [showCoordinateInput, setShowCoordinateInput] = useState(false);

  useEffect(() => {
    if (memory) {
      setTitle(memory.title);
      setDescription(memory.description || "");
      setDate(new Date(memory.date).toISOString().split("T")[0]);
      setSelectedTags(memory.tags);
      setLat(memory.lat);
      setLng(memory.lng);
      setPhoto(memory.photo);
      setSelectedAddress(memory.address || "");
      setPlaceName(memory.placeName || "");
      setShortLocation(memory.shortLocation || "");
    } else if (initialAddress) {
      setSelectedAddress(initialAddress);
    }
  }, [memory, initialAddress]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 크기 체크 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("사진 크기는 5MB 이하여야 합니다.");
      return;
    }

    // 이미지 파일만 허용
    if (!file.type.startsWith("image/")) {
      toast.error("이미지 파일만 업로드 가능합니다.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setPhoto(base64);
      toast.success("사진이 추가되었습니다!");
    };
    reader.onerror = () => {
      toast.error("사진 업로드 중 오류가 발생했습니다.");
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhoto(undefined);
    toast.success("사진이 제거되었습니다.");
  };

  const handleSelectLocation = (selectedLat: number, selectedLng: number, address: string, selectedPlaceName?: string, selectedShortLocation?: string) => {
    setLat(selectedLat);
    setLng(selectedLng);
    setSelectedAddress(address);
    setPlaceName(selectedPlaceName || "");
    setShortLocation(selectedShortLocation || "");
    setShowCoordinateInput(false);
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
      address: selectedAddress || undefined,
      placeName: placeName || undefined,
      shortLocation: shortLocation || undefined,
      photo,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={onCancel}>
      <div
        className="bg-white w-full rounded-t-3xl shadow-2xl max-h-[90vh] flex flex-col animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b shrink-0">
          <h2 className="text-lg font-bold">
            {memory ? "기억 수정" : "새로운 기억 추가"}
          </h2>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="size-5" />
          </Button>
        </div>

        {/* 폼 */}
        <ScrollArea className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-4 space-y-4 pb-24">
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

            {/* 메모 */}
            <div>
              <Label htmlFor="description">메모 (선택)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="이 순간에 대한 메모를 남겨보세요..."
                className="resize-none h-24 mt-2"
              />
            </div>

            {/* 날짜 */}
            <div>
              <Label htmlFor="date">날짜 <span className="text-red-500">*</span></Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="mt-2"
              />
            </div>

            {/* 태그 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>태그 (최대 3개 선택 가능)</Label>
                {selectedTags.length > 0 && (
                  <span className="text-xs text-gray-500">
                    선택한 태그 {selectedTags.length}개
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {TAG_OPTIONS.map((tag) => {
                  const isSelected = selectedTags.includes(tag.value);
                  const canSelect = selectedTags.length < 3 || isSelected;
                  
                  return (
                    <button
                      key={tag.value}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          setSelectedTags(selectedTags.filter(t => t !== tag.value));
                        } else if (canSelect) {
                          setSelectedTags([...selectedTags, tag.value]);
                        }
                      }}
                      disabled={!canSelect}
                      className={`px-3 py-2 rounded-xl text-sm transition-all flex items-center gap-1.5 ${
                        isSelected 
                          ? 'ring-2 shadow-sm font-semibold' 
                          : canSelect
                          ? 'hover:shadow-sm'
                          : 'opacity-40 cursor-not-allowed'
                      }`}
                      style={{
                        backgroundColor: getTagColor(tag.value, 'light'),
                        color: isSelected ? '#1F2937' : '#374151',
                        borderColor: isSelected ? getTagColor(tag.value, 'dark') : 'transparent',
                        ringColor: isSelected ? getTagColor(tag.value, 'dark') : 'transparent',
                      }}
                    >
                      <TagIcon iconName={tag.icon} className="size-4" />
                      <span>{tag.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 위치 */}
            <div>
              <Label>위치 <span className="text-red-500">*</span></Label>
              <div className="mt-2 space-y-3">
                <AddressSearch onSelectLocation={handleSelectLocation} />
                
                {(selectedAddress || placeName || shortLocation) && (
                  <div className="text-sm bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-start gap-2">
                      <MapPin className="size-4 text-blue-500 mt-0.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        {/* 선택된 주소 미리보기 */}
                        {(placeName || shortLocation) && (
                          <div className="text-gray-800 font-medium mb-1">
                            {placeName && shortLocation 
                              ? `${placeName} · ${shortLocation}`
                              : placeName || shortLocation}
                          </div>
                        )}
                        {selectedAddress && (
                          <div className="text-xs text-gray-500">
                            {selectedAddress}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 좌표 직접 입력 토글 */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="coordinateToggle"
                    checked={showCoordinateInput}
                    onChange={(e) => setShowCoordinateInput(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="coordinateToggle" className="text-sm text-gray-600 cursor-pointer">
                    좌표 직접 입력
                  </label>
                </div>

                {/* 좌표 입력 필드 */}
                {showCoordinateInput && (
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <Label htmlFor="lat" className="text-xs">위도</Label>
                      <Input
                        id="lat"
                        type="number"
                        step="any"
                        value={lat}
                        onChange={(e) => setLat(parseFloat(e.target.value))}
                        className="text-sm mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lng" className="text-xs">경도</Label>
                      <Input
                        id="lng"
                        type="number"
                        step="any"
                        value={lng}
                        onChange={(e) => setLng(parseFloat(e.target.value))}
                        className="text-sm mt-1"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </form>
        </ScrollArea>

        {/* 하단 버튼 */}
        <div className="p-4 border-t bg-white shrink-0">
          <div className="flex gap-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
              취소
            </Button>
            <Button 
              type="submit" 
              className="flex-1"
              onClick={handleSubmit}
            >
              {memory ? "수정" : "추가"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}