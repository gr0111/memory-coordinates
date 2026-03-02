export type Memory = {
  id: string;
  title: string;
  description?: string;
  date: string; // ISO string
  tags: string[];
  lat: number;
  lng: number;
  address?: string; // 사람이 읽을 수 있는 주소
  placeName?: string; // 장소명 (예: 한성대학교)
  shortLocation?: string; // 간단 위치 (예: 서울 성북구)
  photo?: string; // base64 encoded image
  createdAt: string;
};

export const TAG_OPTIONS = [
  { value: 'work', label: '일', icon: 'Briefcase', color: '#A8D5E2', darkColor: '#6BB3CC' },
  { value: 'love', label: '연애', icon: 'Heart', color: '#FFB5C5', darkColor: '#FF8FA3' },
  { value: 'school', label: '학교', icon: 'GraduationCap', color: '#C5B3E6', darkColor: '#A68DD9' },
  { value: 'cafe', label: '카페', icon: 'Coffee', color: '#D4C5B9', darkColor: '#B8A28F' },
  { value: 'travel', label: '여행', icon: 'Plane', color: '#B5E7D3', darkColor: '#8FD8B8' },
  { value: 'friend', label: '친구', icon: 'Users', color: '#FFE5A0', darkColor: '#FFD870' },
  { value: 'family', label: '가족', icon: 'Home', color: '#B8E6B8', darkColor: '#8FD88F' },
  { value: 'food', label: '맛집', icon: 'UtensilsCrossed', color: '#FFCCB3', darkColor: '#FFB38A' },
] as const;

export function getTagColor(tag: string, variant: 'light' | 'dark' = 'light'): string {
  const tagOption = TAG_OPTIONS.find(t => t.value === tag);
  if (!tagOption) return variant === 'light' ? '#E5E7EB' : '#9CA3AF';
  return variant === 'light' ? tagOption.color : tagOption.darkColor;
}