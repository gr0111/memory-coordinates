import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search, MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner@2.0.3";

type SearchResult = {
  lat: number;
  lng: number;
  displayName: string;
  shortAddress: string; // 간단한 주소
  placeName?: string; // 장소명
  shortLocation?: string; // 간단 위치
};

type Props = {
  onSelectLocation: (lat: number, lng: number, address: string, placeName?: string, shortLocation?: string) => void;
};

export function AddressSearch({ onSelectLocation }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) {
      toast.error("주소를 입력해주세요.");
      return;
    }

    setIsSearching(true);
    setShowResults(true);

    try {
      // Nominatim API 사용 (OpenStreetMap의 무료 지오코딩 서비스)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&accept-language=ko`
      );
      
      if (!response.ok) {
        throw new Error("검색�� 실패했습니다.");
      }

      const data = await response.json();
      
      if (data.length === 0) {
        toast.error("검색 결과가 없습니다.");
        setResults([]);
      } else {
        const searchResults: SearchResult[] = data.map((item: any) => {
          // 주소 정보 파싱
          const addr = item.address || {};
          
          // 장소명 추출 (우선순위대로)
          let placeName = "";
          if (item.name && item.name !== item.display_name) {
            placeName = item.name;
          } else if (addr.amenity) {
            placeName = addr.amenity;
          } else if (addr.building) {
            placeName = addr.building;
          } else if (addr.shop) {
            placeName = addr.shop;
          } else if (addr.tourism) {
            placeName = addr.tourism;
          } else if (addr.university) {
            placeName = addr.university;
          } else if (addr.school) {
            placeName = addr.school;
          }

          // 간단 위치 (시/도 + 구/군)
          const locationParts = [];
          if (addr.city) locationParts.push(addr.city);
          else if (addr.province) locationParts.push(addr.province);
          else if (addr.state) locationParts.push(addr.state);
          
          if (addr.borough) locationParts.push(addr.borough);
          else if (addr.district) locationParts.push(addr.district);
          else if (addr.county) locationParts.push(addr.county);
          
          const shortLocation = locationParts.join(" ");

          // 간단한 주소 (검색 결과 표시용)
          const shortAddress = shortLocation || item.display_name;

          return {
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
            displayName: item.display_name,
            shortAddress,
            placeName: placeName || undefined,
            shortLocation: shortLocation || undefined,
          };
        });
        setResults(searchResults);
      }
    } catch (error) {
      console.error(error);
      toast.error("주소 검색 중 오류가 발생했습니다.");
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSelectResult = (result: SearchResult) => {
    // displayName을 전체 주소로, placeName과 shortLocation도 함께 전달
    onSelectLocation(
      result.lat, 
      result.lng, 
      result.displayName, // 전체 주소
      result.placeName,   // 장소명
      result.shortLocation // 간단 위치
    );
    setQuery("");
    setResults([]);
    setShowResults(false);
    toast.success("위치가 선택되었습니다!");
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <Input
            placeholder="주소 검색 (예: 강남역, 서울 마포구...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-9"
          />
        </div>
        <Button
          onClick={handleSearch}
          disabled={isSearching}
          className="shrink-0"
        >
          {isSearching ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Search className="size-4" />
          )}
        </Button>
      </div>

      {/* 검색 결과 */}
      {showResults && results.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
          {results.map((result, index) => (
            <button
              key={index}
              className="w-full text-left px-3 py-2.5 hover:bg-blue-50 transition-colors flex items-start gap-2 border-b last:border-b-0"
              onClick={() => handleSelectResult(result)}
            >
              <MapPin className="size-4 text-blue-500 mt-1 shrink-0" />
              <div className="flex-1 min-w-0">
                {/* 장소명이 있으면 강조 */}
                {result.placeName && (
                  <div className="font-medium text-gray-800 text-sm mb-0.5">
                    {result.placeName}
                    {result.shortLocation && ` · ${result.shortLocation}`}
                  </div>
                )}
                {/* 전체 주소 */}
                <div className="text-xs text-gray-500 line-clamp-2">
                  {result.displayName}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}