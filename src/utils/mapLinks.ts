// 지도 앱 링크 생성

export function getNaverMapLink(lat: number, lng: number, placeName?: string): string {
  const name = placeName ? encodeURIComponent(placeName) : "목적지";
  return `nmap://place?lat=${lat}&lng=${lng}&name=${name}&appname=com.memorymap`;
}

export function getKakaoMapLink(lat: number, lng: number, placeName?: string): string {
  const name = placeName ? encodeURIComponent(placeName) : "목적지";
  return `kakaomap://look?p=${lat},${lng}&name=${name}`;
}

export function getGoogleMapLink(lat: number, lng: number): string {
  return `https://www.google.com/maps?q=${lat},${lng}`;
}

export function openMapApp(lat: number, lng: number, placeName?: string) {
  // 모바일 환경 감지
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  
  if (isMobile) {
    // 네이버맵 앱 시도
    const naverLink = getNaverMapLink(lat, lng, placeName);
    window.location.href = naverLink;
    
    // 앱이 없으면 구글맵으로 폴백
    setTimeout(() => {
      window.open(getGoogleMapLink(lat, lng), '_blank');
    }, 1000);
  } else {
    // 데스크톱은 구글맵 웹으로
    window.open(getGoogleMapLink(lat, lng), '_blank');
  }
}
