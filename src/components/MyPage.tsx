import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Camera, User, Mail, MapPin, Calendar, Image as ImageIcon, X } from "lucide-react";
import { toast } from "sonner@2.0.3";

type User = {
  email: string;
  name: string;
  profileImage?: string;
  bio?: string;
};

type Props = {
  user: User;
  onUpdateProfile: (updates: Partial<Omit<User, 'email'>>) => void;
  onClose: () => void;
  memoryStats?: {
    totalMemories: number;
    totalTags: number;
    firstMemoryDate?: string;
  };
};

export function MyPage({ user, onUpdateProfile, onClose, memoryStats }: Props) {
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio || "");
  const [profileImage, setProfileImage] = useState(user.profileImage || "");
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 크기 체크 (2MB 제한)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("이미지 크기는 2MB 이하여야 합니다.");
      return;
    }

    // 이미지 파일 타입 체크
    if (!file.type.startsWith("image/")) {
      toast.error("이미지 파일만 업로드 가능합니다.");
      return;
    }

    // Base64로 변환
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!name.trim()) {
      toast.error("이름을 입력해주세요.");
      return;
    }

    onUpdateProfile({
      name: name.trim(),
      bio: bio.trim(),
      profileImage: profileImage || undefined,
    });

    setIsEditing(false);
    toast.success("프로필이 업데이트되었습니다! ✨");
  };

  const handleCancel = () => {
    setName(user.name);
    setBio(user.bio || "");
    setProfileImage(user.profileImage || "");
    setIsEditing(false);
  };

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-4 border-b border-blue-100 flex items-center justify-between rounded-t-3xl">
          <h2 className="text-xl font-bold text-gray-800">마이페이지</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full"
          >
            <X className="size-5" />
          </Button>
        </div>

        {/* 프로필 섹션 */}
        <div className="p-6">
          {/* 프로필 이미지 */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative group">
              <Avatar className="size-24 border-4 border-white shadow-lg">
                <AvatarImage src={profileImage} alt={name} />
                <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white text-2xl">
                  {getInitials(name)}
                </AvatarFallback>
              </Avatar>
              
              {isEditing && (
                <>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Camera className="size-6 text-white" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  {profileImage && (
                    <button
                      onClick={() => setProfileImage("")}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X className="size-4" />
                    </button>
                  )}
                </>
              )}
            </div>
            
            {!isEditing && (
              <div className="text-center mt-4">
                <h3 className="text-xl font-bold text-gray-800">{user.name}</h3>
                <p className="text-sm text-gray-500 flex items-center justify-center gap-1 mt-1">
                  <Mail className="size-3.5" />
                  {user.email}
                </p>
              </div>
            )}
          </div>

          {/* 편집 폼 */}
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">이름</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                    placeholder="이름을 입력하세요"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bio">소개</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="mt-1 resize-none"
                  rows={3}
                  placeholder="자기소개를 입력하세요 (선택사항)"
                  maxLength={150}
                />
                <p className="text-xs text-gray-500 mt-1 text-right">
                  {bio.length}/150
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  저장
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="flex-1"
                >
                  취소
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* 소개 */}
              {user.bio && (
                <Card className="mb-4">
                  <CardContent className="pt-4">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {user.bio}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* 통계 */}
              {memoryStats && (
                <Card className="mb-4">
                  <CardHeader>
                    <CardTitle className="text-base">나의 기억 통계</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-purple-100 rounded-full p-2">
                          <MapPin className="size-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">총 기억</p>
                          <p className="text-lg font-bold text-gray-800">
                            {memoryStats.totalMemories}개
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="bg-pink-100 rounded-full p-2">
                          <ImageIcon className="size-4 text-pink-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">사용 태그</p>
                          <p className="text-lg font-bold text-gray-800">
                            {memoryStats.totalTags}종류
                          </p>
                        </div>
                      </div>
                    </div>

                    {memoryStats.firstMemoryDate && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="size-4" />
                          <span>
                            첫 기억:{" "}
                            <span className="font-semibold">
                              {new Date(memoryStats.firstMemoryDate).toLocaleDateString("ko-KR")}
                            </span>
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* 계정 정보 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">계정 정보</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="size-4 text-gray-400" />
                    <span className="text-gray-600">이메일:</span>
                    <span className="font-semibold text-gray-800">{user.email}</span>
                  </div>
                </CardContent>
              </Card>

              <Button
                onClick={() => setIsEditing(true)}
                className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                프로필 수정
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
