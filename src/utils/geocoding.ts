// 역지오코딩: 좌표 → 주소
export async function reverseGeocode(lat: number, lng: number): Promise<{
  fullAddress: string;
  placeName?: string;
  shortLocation?: string;
} | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ko`
    );
    
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    
    if (!data || !data.address) {
      return null;
    }
    
    // 주소 포맷팅: "시/도 구/군 · 장소명" 형식
    const address = data.address;
    const parts: string[] = [];

    // 시/도
    if (address.city) {
      parts.push(address.city);
    } else if (address.province) {
      parts.push(address.province);
    }

    // 구/군
    if (address.borough || address.district || address.county) {
      parts.push(address.borough || address.district || address.county);
    }

    // 동/읍/면
    if (address.suburb || address.neighbourhood || address.village) {
      parts.push(address.suburb || address.neighbourhood || address.village);
    }

    // 상세 장소 (건물, 카페, 상점 등)
    let placeName = "";
    if (address.amenity) {
      placeName = address.amenity;
    } else if (address.building) {
      placeName = address.building;
    } else if (address.shop) {
      placeName = address.shop;
    } else if (address.tourism) {
      placeName = address.tourism;
    } else if (address.leisure) {
      placeName = address.leisure;
    }

    // 간단 위치: 시/도 + 구/군
    const shortLocation = [
      address.city || address.province,
      address.borough || address.district || address.county
    ].filter(Boolean).join(" ");

    // 최종 주소 조합
    const mainAddress = parts.join(" ");
    let fullAddress = mainAddress;
    if (placeName && placeName !== mainAddress) {
      fullAddress = `${mainAddress} · ${placeName}`;
    } else if (!mainAddress) {
      fullAddress = data.display_name;
    }
    
    return {
      fullAddress,
      placeName: placeName || undefined,
      shortLocation: shortLocation || undefined,
    };
  } catch (error) {
    console.error("Reverse geocoding failed:", error);
    return null;
  }
}