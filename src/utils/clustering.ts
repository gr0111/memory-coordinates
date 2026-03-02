import { Memory } from "../types/memory";

export type Cluster = {
  id: string;
  lat: number;
  lng: number;
  memories: Memory[];
  isCluster: boolean;
};

// 두 지점 간의 거리 계산 (Haversine formula - km 단위)
function getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // 지구 반지름 (km)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// 줌 레벨에 따른 클러스터 거리 임계값 (km)
function getClusterThreshold(zoom: number): number {
  if (zoom >= 15) return 0; // 줌이 크면 클러스터링 안 함
  if (zoom >= 13) return 0.5; // 500m
  if (zoom >= 11) return 2; // 2km
  if (zoom >= 9) return 5; // 5km
  return 10; // 10km
}

export function clusterMemories(memories: Memory[], zoom: number): Cluster[] {
  const threshold = getClusterThreshold(zoom);
  
  // 클러스터링을 하지 않는 경우
  if (threshold === 0) {
    return memories.map(memory => ({
      id: memory.id,
      lat: memory.lat,
      lng: memory.lng,
      memories: [memory],
      isCluster: false,
    }));
  }

  const clusters: Cluster[] = [];
  const processed = new Set<string>();

  memories.forEach(memory => {
    if (processed.has(memory.id)) return;

    // 현재 메모리와 가까운 다른 메모리들 찾기
    const nearbyMemories = memories.filter(other => {
      if (processed.has(other.id)) return false;
      const distance = getDistance(memory.lat, memory.lng, other.lat, other.lng);
      return distance <= threshold;
    });

    // 클러스터 생성
    if (nearbyMemories.length > 1) {
      // 평균 위치 계산
      const avgLat = nearbyMemories.reduce((sum, m) => sum + m.lat, 0) / nearbyMemories.length;
      const avgLng = nearbyMemories.reduce((sum, m) => sum + m.lng, 0) / nearbyMemories.length;

      clusters.push({
        id: `cluster-${clusters.length}`,
        lat: avgLat,
        lng: avgLng,
        memories: nearbyMemories,
        isCluster: true,
      });

      nearbyMemories.forEach(m => processed.add(m.id));
    } else {
      // 단일 메모리
      clusters.push({
        id: memory.id,
        lat: memory.lat,
        lng: memory.lng,
        memories: [memory],
        isCluster: false,
      });
      processed.add(memory.id);
    }
  });

  return clusters;
}
