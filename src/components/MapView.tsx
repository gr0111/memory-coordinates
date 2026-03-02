import { useEffect, useRef, useState } from "react";
import { Memory, TAG_OPTIONS, getTagColor } from "../types/memory";
import { clusterMemories, Cluster } from "../utils/clustering";
import { Button } from "./ui/button";
import { ZoomIn, ZoomOut, Crosshair, Navigation, X, Sparkles, Calendar } from "lucide-react";
import { toast } from "sonner@2.0.3";

type Props = {
  memories: Memory[];
  selectedMemoryId?: string | null;
  onSelectMemory: (memory: Memory) => void;
  onMapDoubleClick?: (lat: number, lng: number) => void;
  hideTutorial?: boolean;
  onCreateMemory?: (lat: number, lng: number) => void;
  isFirstTimeUser?: boolean;
};

const TUTORIAL_DISMISSED_KEY = "memory-map-tutorial-dismissed";

export function MapView({ memories, selectedMemoryId, onSelectMemory, onMapDoubleClick, hideTutorial = false, onCreateMemory, isFirstTimeUser = false }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [center, setCenter] = useState({ lat: 37.5665, lng: 126.978 });
  const [zoom, setZoom] = useState(13);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [expandedCluster, setExpandedCluster] = useState<string | null>(null);
  const [showTutorial, setShowTutorial] = useState(!localStorage.getItem(TUTORIAL_DISMISSED_KEY) && !hideTutorial);
  
  const selectedMemory = memories.find(m => m.id === selectedMemoryId);
  
  // 클러스터링
  const clusters = clusterMemories(memories, zoom);

  // 선택된 기억이 있으면 해당 위치로 이동
  useEffect(() => {
    if (selectedMemory) {
      setCenter({ lat: selectedMemory.lat, lng: selectedMemory.lng });
    }
  }, [selectedMemory]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;

    // 간단한 팬 계산 (실제로는 더 복잡함)
    const latChange = (dy / 500) * (360 / Math.pow(2, zoom));
    const lngChange = (-dx / 500) * (360 / Math.pow(2, zoom));

    setCenter(prev => ({
      lat: Math.max(-85, Math.min(85, prev.lat + latChange)),
      lng: ((prev.lng + lngChange + 180) % 360) - 180,
    }));

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 클릭 위치를 lat/lng로 변환 (간단한 근사치)
    const lng = center.lng + ((x - rect.width / 2) / rect.width) * (360 / Math.pow(2, zoom)) * 2;
    const lat = center.lat - ((y - rect.height / 2) / rect.height) * (180 / Math.pow(2, zoom)) * 2;

    onMapDoubleClick?.(lat, lng);
    onCreateMemory?.(lat, lng);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(18, prev + 1));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(3, prev - 1));
  };

  const handleResetView = () => {
    setCenter({ lat: 37.5665, lng: 126.978 });
    setZoom(13);
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("위치 서비스를 지원하지 않는 브라우저입니다.");
      return;
    }

    toast.loading("현재 위치를 가져오는 중...");
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setCenter({ lat: latitude, lng: longitude });
        setZoom(15);
        toast.dismiss();
        toast.success("현재 위치로 이동했습니다!");
      },
      (error) => {
        toast.dismiss();
        toast.error("위치를 가져올 수 없습니다. 위치 권한을 확인해주세요.");
        console.error(error);
      }
    );
  };

  // 위도/경도를 화면 좌표로 변환
  const latLngToPixel = (lat: number, lng: number) => {
    if (!containerRef.current) return { x: 0, y: 0 };

    const rect = containerRef.current.getBoundingClientRect();
    const scale = Math.pow(2, zoom);

    const x = rect.width / 2 + ((lng - center.lng) / (360 / scale)) * rect.width / 2;
    const y = rect.height / 2 - ((lat - center.lat) / (180 / scale)) * rect.height / 2;

    return { x, y };
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getTagLabel = (tag: string) => {
    const tagOption = TAG_OPTIONS.find(t => t.value === tag);
    return tagOption?.label || tag;
  };

  const handleDismissTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem(TUTORIAL_DISMISSED_KEY, "true");
  };

  // 마커 렌더링 함수
  const renderMarker = (memory: Memory, isSelected: boolean, markerColor: string) => {
    const hasPhoto = !!memory.photo;

    return (
      <>
        {/* 마커 핀 - 감성적인 디자인 */}
        <div
          className={`relative transition-all ${
            isSelected ? 'scale-125' : 'hover:scale-110'
          }`}
        >
          <svg width="36" height="44" viewBox="0 0 36 44">
            {/* 그림자 */}
            <ellipse cx="18" cy="42" rx="8" ry="2" fill="rgba(0,0,0,0.2)" />
            
            {/* 핀 본체 */}
            <path
              d="M18 0C8.059 0 0 8.059 0 18c0 9.941 18 26 18 26s18-16.059 18-26C36 8.059 27.941 0 18 0z"
              fill={hasPhoto ? 'white' : markerColor}
              stroke={markerColor}
              strokeWidth="2.5"
              filter="drop-shadow(0 2px 4px rgba(0,0,0,0.2))"
            />
            
            {/* 사진이 있는 경우 원형 클립 */}
            {hasPhoto && (
              <>
                <defs>
                  <clipPath id={`clip-${memory.id}`}>
                    <circle cx="18" cy="18" r="13" />
                  </clipPath>
                </defs>
                {/* SVG 내부에 이미지 삽입 */}
                <image
                  href={memory.photo}
                  x="5"
                  y="5"
                  width="26"
                  height="26"
                  clipPath={`url(#clip-${memory.id})`}
                  preserveAspectRatio="xMidYMid slice"
                />
              </>
            )}
            
            {!hasPhoto && (
              /* 내부 원 (사진 없을 때) */
              <circle cx="18" cy="18" r="8" fill="white" opacity="0.9" />
            )}
            
            {/* 펄스 효과 (선택됨) */}
            {isSelected && (
              <circle cx="18" cy="18" r="18" fill={markerColor} opacity="0.3">
                <animate attributeName="r" from="18" to="24" dur="1.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.3" to="0" dur="1.5s" repeatCount="indefinite" />
              </circle>
            )}
          </svg>
        </div>

        {/* 호버 시 툴팁 */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
          <div className="bg-white rounded-xl shadow-xl px-3 py-2 text-sm border border-gray-100">
            {memory.photo && (
              <img 
                src={memory.photo} 
                alt={memory.title}
                className="w-32 h-20 object-cover rounded-lg mb-2"
              />
            )}
            <div className="font-semibold text-gray-800">{memory.title}</div>
            
            {/* 주소 표시 */}
            {(memory.placeName || memory.shortLocation) && (
              <div className="text-xs text-gray-600 mt-1">
                {memory.placeName && memory.shortLocation 
                  ? `${memory.placeName} · ${memory.shortLocation}`
                  : memory.placeName || memory.shortLocation}
              </div>
            )}
            
            <div className="text-xs text-gray-500">{formatDate(memory.date)}</div>
            <div className="flex gap-1 mt-1">
              {memory.tags.slice(0, 3).map(tag => (
                <span 
                  key={tag} 
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: getTagColor(tag, 'light'), color: '#374151' }}
                >
                  {getTagLabel(tag)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="relative w-full h-full bg-gray-200 overflow-hidden">
      {/* Empty 상태 - 기억이 없을 때 */}
      {memories.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-gradient-to-br from-blue-50/80 via-purple-50/80 to-pink-50/80 backdrop-blur-sm">
          <div className="text-center py-20 px-6">
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="size-10 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              첫 기억을 기록해보세요
            </h3>
            <p className="text-gray-500 mb-6">
              지도를 더블 탭하거나<br />
              아래 버튼으로 시작하세요
            </p>
            {onCreateMemory && (
              <Button
                onClick={onCreateMemory}
                className={`bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg ${
                  isFirstTimeUser ? 'animate-bounce' : ''
                }`}
              >
                <Calendar className="size-4 mr-2" />
                지도에서 첫 기억 남기기
              </Button>
            )}
          </div>
        </div>
      )}

      {/* 지도 배경 (OpenStreetMap 타일 이미지) */}
      <div
        ref={containerRef}
        className={`w-full h-full ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDoubleClick={handleDoubleClick}
        style={{
          backgroundImage: `url(https://tile.openstreetmap.org/${zoom}/${Math.floor((center.lng + 180) / 360 * Math.pow(2, zoom))}/${Math.floor((1 - Math.log(Math.tan(center.lat * Math.PI / 180) + 1 / Math.cos(center.lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom))}.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* 마커들 렌더링 */}
        {clusters.map(cluster => {
          const pos = latLngToPixel(cluster.lat, cluster.lng);

          if (cluster.isCluster) {
            // 클러스터 마커
            const count = cluster.memories.length;
            const isExpanded = expandedCluster === cluster.id;
            
            return (
              <div key={cluster.id}>
                {/* 클러스터 마커 */}
                <div
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                  style={{ left: pos.x, top: pos.y }}
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isExpanded) {
                      setExpandedCluster(null);
                    } else {
                      setExpandedCluster(cluster.id);
                    }
                  }}
                >
                  <div className="relative">
                    {/* 클러스터 원 */}
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-lg border-4 border-white transition-transform hover:scale-110">
                      <span className="text-white font-bold text-lg">{count}</span>
                    </div>
                    {/* 개수 배지 */}
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white shadow-md">
                      <span className="text-white text-xs font-bold">{count}</span>
                    </div>
                  </div>
                </div>

                {/* 확장된 클러스터 - 개별 마커들 */}
                {isExpanded && cluster.memories.map((memory, idx) => {
                  const angle = (idx / cluster.memories.length) * 2 * Math.PI;
                  const radius = 60;
                  const offsetX = Math.cos(angle) * radius;
                  const offsetY = Math.sin(angle) * radius;
                  
                  const expandedPos = {
                    x: pos.x + offsetX,
                    y: pos.y + offsetY
                  };

                  const isSelected = memory.id === selectedMemoryId;
                  const primaryTag = memory.tags[0];
                  const markerColor = primaryTag ? getTagColor(primaryTag, 'dark') : '#ef4444';

                  return (
                    <div
                      key={memory.id}
                      className="absolute transform -translate-x-1/2 -translate-y-full cursor-pointer group animate-slide-up"
                      style={{ 
                        left: expandedPos.x, 
                        top: expandedPos.y,
                        animation: `slideIn 0.3s ease-out ${idx * 0.05}s both`
                      }}
                      onMouseDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectMemory(memory);
                        setExpandedCluster(null);
                      }}
                    >
                      {renderMarker(memory, isSelected, markerColor)}
                    </div>
                  );
                })}
              </div>
            );
          } else {
            // 단일 마커
            const memory = cluster.memories[0];
            const isSelected = memory.id === selectedMemoryId;
            const primaryTag = memory.tags[0];
            const markerColor = primaryTag ? getTagColor(primaryTag, 'dark') : '#ef4444';

            return (
              <div
                key={memory.id}
                className="absolute transform -translate-x-1/2 -translate-y-full cursor-pointer group"
                style={{ left: pos.x, top: pos.y }}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectMemory(memory);
                }}
              >
                {renderMarker(memory, isSelected, markerColor)}
              </div>
            );
          }
        })}

        {/* 현재 위치 마커 */}
        {userLocation && (() => {
          const pos = latLngToPixel(userLocation.lat, userLocation.lng);
          return (
            <div
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: pos.x, top: pos.y }}
            >
              <div className="relative">
                <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg" />
                <div className="absolute inset-0 w-4 h-4 bg-blue-400 rounded-full animate-ping opacity-75" />
              </div>
            </div>
          );
        })()}
      </div>

      {/* 줌 컨트롤 */}
      <div className="absolute top-4 left-4 bg-white rounded-xl shadow-lg overflow-hidden">
        <Button
          variant="ghost"
          size="sm"
          className="w-10 h-10 rounded-none border-b"
          onClick={handleZoomIn}
        >
          <ZoomIn className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-10 h-10 rounded-none border-b"
          onClick={handleZoomOut}
        >
          <ZoomOut className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-10 h-10 rounded-none border-b"
          onClick={handleGetCurrentLocation}
          title="현재 위치"
        >
          <Navigation className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-10 h-10 rounded-none"
          onClick={handleResetView}
          title="서울로 이동"
        >
          <Crosshair className="size-4" />
        </Button>
      </div>

      {/* 지도 사용 안내 - 감성적인 문구 (첫 진입 시에만) */}
      {showTutorial && !hideTutorial && (
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2.5 rounded-xl shadow-lg text-xs text-gray-700 max-w-[200px] border border-purple-100">
          <button
            onClick={handleDismissTutorial}
            className="absolute -top-1 -right-1 w-5 h-5 bg-gray-600 hover:bg-gray-700 text-white rounded-full flex items-center justify-center transition-colors"
          >
            <X className="size-3" />
          </button>
          <div className="flex items-start gap-2">
            <Sparkles className="size-4 text-yellow-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>지도를 더블 탭</strong>해서<br/>
              그 순간의 기억을 남겨보세요
            </p>
          </div>
        </div>
      )}

      {/* OpenStreetMap 크레딧 */}
      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs text-gray-600">
        © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="underline">OpenStreetMap</a>
      </div>
    </div>
  );
}