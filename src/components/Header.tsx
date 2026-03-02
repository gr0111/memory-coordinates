import { MapPin, List, Calendar, LogOut, User as UserIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Logo } from "./Logo";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

type Props = {
  currentView: 'map' | 'timeline';
  onViewChange: (view: 'map' | 'timeline') => void;
  userName?: string;
  userProfileImage?: string;
  onLogout?: () => void;
  onOpenMyPage?: () => void;
};

export function Header({ currentView, onViewChange, userName, userProfileImage, onLogout, onOpenMyPage }: Props) {
  const getInitials = (name: string) => {
    return name?.charAt(0).toUpperCase() || "U";
  };

  return (
    <header className="bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-3 shadow-sm border-b border-blue-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo size={32} />
          <div>
            <h1 className="font-bold text-base text-gray-800">기억의 좌표</h1>
            <p className="text-xs text-gray-500">
              {userName ? `${userName}님의 기억이 머문 자리` : '기억이 머문 자리'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex gap-1 bg-white rounded-lg p-1 shadow-sm">
            <Button
              variant={currentView === 'map' ? 'default' : 'ghost'}
              size="sm"
              className="gap-1 h-8"
              onClick={() => onViewChange('map')}
            >
              <MapPin className="size-3.5" />
              <span className="text-xs">지도</span>
            </Button>
            <Button
              variant={currentView === 'timeline' ? 'default' : 'ghost'}
              size="sm"
              className="gap-1 h-8"
              onClick={() => onViewChange('timeline')}
            >
              <Calendar className="size-3.5" />
              <span className="text-xs">타임라인</span>
            </Button>
          </div>

          {onOpenMyPage && (
            <button
              onClick={onOpenMyPage}
              className="hover:opacity-80 transition-opacity"
              title="마이페이지"
            >
              <Avatar className="size-8 border-2 border-white shadow-sm">
                <AvatarImage src={userProfileImage} alt={userName} />
                <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white text-sm">
                  {getInitials(userName || "")}
                </AvatarFallback>
              </Avatar>
            </button>
          )}

          {onLogout && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1"
              onClick={onLogout}
              title="로그아웃"
            >
              <LogOut className="size-3.5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}