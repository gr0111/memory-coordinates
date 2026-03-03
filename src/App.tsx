// src/App.tsx
import { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { MapView } from "./components/MapView";
import { TimelineView } from "./components/TimelineView";
import { MemoryListSheet } from "./components/MemoryListSheet";
import { MemoryDetailSheet } from "./components/MemoryDetailSheet";
import { MemoryFormSheet } from "./components/MemoryFormSheet";
import { AuthScreen } from "./components/AuthScreen";
import { MyPage } from "./components/MyPage";
import { useMemories } from "./hooks/useMemories";
import { useAuth } from "./hooks/useAuth";
import type { Memory } from "./types/memory";
import { Button } from "./components/ui/button";
import { Plus } from "lucide-react";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";

export default function App() {
  const {
    user,
    isLoading: isAuthLoading,
    login,
    register,
    logout,
    updateProfile,
  } = useAuth();

  const {
    memories,
    isLoading: isMemoriesLoading,
    addMemory,
    updateMemory,
    deleteMemory,
  } = useMemories();

  const [selectedMemoryId, setSelectedMemoryId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
  const [pendingLocation, setPendingLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [hideTutorial, setHideTutorial] = useState(false);
  const [isListExpanded, setIsListExpanded] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [currentView, setCurrentView] = useState<"map" | "timeline">("map");
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);
  const [showMyPage, setShowMyPage] = useState(false);

  // 신규 사용자 감지
  useEffect(() => {
    if (user && memories.length === 0) {
      setIsFirstTimeUser(true);
      const timer = setTimeout(() => {
        setIsFirstTimeUser(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [user, memories.length]);

  // 로딩 중
  if (isAuthLoading || isMemoriesLoading) {
    return (
        <div className="h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">로딩 중...</p>
          </div>
        </div>
    );
  }

  // 로그인하지 않은 경우
  if (!user) {
    return (
        <>
          <AuthScreen onLogin={login} onRegister={register} />
          <Toaster position="top-center" />
        </>
    );
  }

  // 통계 계산
  const memoryStats = {
    totalMemories: memories.length,
    totalTags: new Set(memories.flatMap((m) => m.tags ?? [])).size,
    firstMemoryDate:
        memories.length > 0
            ? [...memories].sort(
                (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
            )[0].date
            : undefined,
  };

  const handleMapDoubleClick = (lat: number, lng: number) => {
    setPendingLocation({ lat, lng });
    setEditingMemory(null);
    setIsFormOpen(true);
    setShowDetail(false);
    setHideTutorial(true);
  };

  const handleSaveMemory = async (data: Omit<Memory, "id" | "createdAt">) => {
    try {
      if (editingMemory) {
        await updateMemory(editingMemory.id, data);
        toast.success("기억이 수정되었습니다!");
      } else {
        const newMemory = await addMemory(data);
        setSelectedMemoryId(newMemory.id);
        toast.success("새로운 기억이 추가되었습니다!");
      }
      setIsFormOpen(false);
      setEditingMemory(null);
      setPendingLocation(null);
      setShowDetail(false);
    } catch (e) {
      console.error(e);
      toast.error("기억을 저장하는 데 실패했습니다.");
    }
  };

  const handleEditMemory = (memory: Memory) => {
    setEditingMemory(memory);
    setPendingLocation(null);
    setShowDetail(false);
    setIsFormOpen(true);
  };

  const handleDeleteMemory = async (id: string) => {
    try {
      await deleteMemory(id);
      setSelectedMemoryId(null);
      setShowDetail(false);
      toast.success("기억이 삭제되었습니다.");
    } catch (e) {
      console.error(e);
      toast.error("기억을 삭제하는 데 실패했습니다.");
    }
  };

  const handleLogout = () => {
    if (confirm("로그아웃 하시겠습니까?")) {
      logout();
      toast.success("로그아웃되었습니다.");
    }
  };

  const handleSelectMemory = (memory: Memory) => {
    setSelectedMemoryId(memory.id);
    setShowDetail(true);
    setHideTutorial(true);
  };

  return (
      <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden">
        <Header
            currentView={currentView}
            onViewChange={setCurrentView}
            userName={user.name}
            userProfileImage={user.profileImage}
            onLogout={handleLogout}
            onOpenMyPage={() => setShowMyPage(true)}
        />

        {/* 지도 또는 타임라인 뷰 */}
        <div className="flex-1 relative">
          {currentView === "map" ? (
              <>
                <MapView
                    memories={memories}
                    selectedMemoryId={selectedMemoryId}
                    onSelectMemory={handleSelectMemory}
                    onMapDoubleClick={handleMapDoubleClick}
                    onCreateMemory={() => {
                      setPendingLocation(null);
                      setEditingMemory(null);
                      setIsFormOpen(true);
                    }}
                    hideTutorial={hideTutorial}
                    isFirstTimeUser={isFirstTimeUser}
                />

                {/* 플로팅 추가 버튼 */}
                {!isFormOpen && (
                    <Button
                        size="lg"
                        className="absolute bottom-[42vh] right-4 shadow-2xl rounded-full w-14 h-14 p-0 bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                        onClick={() => {
                          setPendingLocation(null);
                          setEditingMemory(null);
                          setIsFormOpen(true);
                        }}
                    >
                      <Plus className="size-6" />
                    </Button>
                )}
              </>
          ) : (
              <TimelineView
                  memories={memories}
                  onSelectMemory={handleSelectMemory}
                  onEditMemory={handleEditMemory}
                  onDeleteMemory={handleDeleteMemory}
                  onTagClick={() => {
                    // 태그 필터링 로직은 나중에
                    setCurrentView("map");
                  }}
                  onCreateMemory={() => {
                    setCurrentView("map");
                    setIsFormOpen(true);
                    setPendingLocation(null);
                    setEditingMemory(null);
                  }}
                  isFirstTimeUser={isFirstTimeUser}
              />
          )}
        </div>

        {/* 하단 시트: 기억 리스트 (지도 모드일 때만) */}
        {currentView === "map" && !isFormOpen && !showDetail && (
            <MemoryListSheet
                memories={memories}
                selectedMemoryId={selectedMemoryId}
                onSelectMemory={handleSelectMemory}
                onEditMemory={handleEditMemory}
                onDeleteMemory={handleDeleteMemory}
                isExpanded={isListExpanded}
                onToggleExpand={() => setIsListExpanded(!isListExpanded)}
            />
        )}

        {/* 기억 상세 */}
        {showDetail &&
            selectedMemoryId &&
            (() => {
              const selectedMemory = memories.find((m) => m.id === selectedMemoryId);
              if (!selectedMemory) return null;

              return (
                  <MemoryDetailSheet
                      memory={selectedMemory}
                      onClose={() => {
                        setShowDetail(false);
                        setSelectedMemoryId(null);
                      }}
                      onEdit={() => handleEditMemory(selectedMemory)}
                      onDelete={() => handleDeleteMemory(selectedMemoryId)}
                      onTagClick={() => {
                        setShowDetail(false);
                        setSelectedMemoryId(null);
                      }}
                  />
              );
            })()}

        {/* 기억 추가/수정 폼 */}
        {isFormOpen && (
            <MemoryFormSheet
                memory={editingMemory}
                initialLat={pendingLocation?.lat}
                initialLng={pendingLocation?.lng}
                initialAddress={pendingLocation ? undefined : editingMemory?.address}
                onSave={handleSaveMemory}
                onCancel={() => {
                  setIsFormOpen(false);
                  setEditingMemory(null);
                  setPendingLocation(null);
                }}
            />
        )}

        {/* 마이페이지 */}
        {showMyPage && (
            <MyPage
                user={{
                  email: user.email,
                  name: user.name,
                  profileImage: user.profileImage,
                  bio: user.bio,
                }}
                onUpdateProfile={updateProfile}
                onClose={() => setShowMyPage(false)}
                memoryStats={memoryStats}
            />
        )}

        <Toaster position="top-center" />
      </div>
  );
}