import maplibregl, {
  Map as MapLibreMap,
  Marker,
  StyleImageInterface,
} from "maplibre-gl";
import type {
  Coordinates,
  GeoJSONFeature,
  GeoJSONFeatureCollection,
  LocationPoint,
  LocationProperties,
} from "../../types/location";

export const PRAGUE_CENTER: Coordinates = [14.4378, 50.0755];
export const INITIAL_ZOOM = 11;
export const SPECIAL_POINTS_COUNT = 3;

export const PULSE_IMAGE_ID = "pulse";
export const LOCATIONS_SOURCE_ID = "locations";
export const SPECIAL_SOURCE_ID = "special";

export const CLUSTERS_LAYER_ID = "clusters";
export const CLUSTER_COUNT_LAYER_ID = "cluster-count";
export const UNCLUSTERED_POINT_LAYER_ID = "unclustered-point";
export const PULSE_LAYER_ID = "pulse-layer";

function toCoordinates(point: LocationPoint): Coordinates {
  return [point.lng, point.lat];
}

export function splitLocations(points: LocationPoint[]) {
  return {
    specialPoints: points.slice(0, SPECIAL_POINTS_COUNT),
    normalPoints: points.slice(SPECIAL_POINTS_COUNT),
  };
}

export function createGeoJSONFeatures(
  points: LocationPoint[]
): GeoJSONFeature<LocationProperties>[] {
  return points.map((point) => ({
    type: "Feature",
    properties: {
      id: point.id,
      emoji: point.emoji,
    },
    geometry: {
      type: "Point",
      coordinates: toCoordinates(point),
    },
  }));
}

export function createFeatureCollection(
  points: LocationPoint[]
): GeoJSONFeatureCollection<LocationProperties> {
  return {
    type: "FeatureCollection",
    features: createGeoJSONFeatures(points),
  };
}

type PulsingDotImage = StyleImageInterface & {
  context?: CanvasRenderingContext2D | null;
};

export function createPulsingDot(
  map: MapLibreMap,
  size = 100
): PulsingDotImage {
  return {
    width: size,
    height: size,
    data: new Uint8Array(size * size * 4),

    onAdd() {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      this.context = canvas.getContext("2d");
    },

    render() {
      if (!this.context) {
        return false;
      }

      const duration = 1000;
      const t = (performance.now() % duration) / duration;
      const radius = (size / 2) * t;

      this.context.clearRect(0, 0, size, size);
      this.context.beginPath();
      this.context.arc(size / 2, size / 2, radius, 0, Math.PI * 2);
      this.context.fillStyle = `rgba(0, 136, 255, ${1 - t})`;
      this.context.fill();

      this.data = this.context.getImageData(0, 0, size, size).data;

      map.triggerRepaint();
      return true;
    },
  };
}

function createSpecialMarkerElement(emoji: string): HTMLDivElement {
  const element = document.createElement("div");
  element.textContent = emoji;
  element.className = "map-view__special-marker";
  return element;
}

export function createSpecialMarker(
  point: LocationPoint,
  map: MapLibreMap
): Marker {
  return new maplibregl.Marker({
    element: createSpecialMarkerElement(point.emoji),
    anchor: "center",
  })
    .setLngLat(toCoordinates(point))
    .addTo(map);
}

export function createSpecialMarkers(
  points: LocationPoint[],
  map: MapLibreMap
): Marker[] {
  return points.map((point) => createSpecialMarker(point, map));
}

export function addClusterLayers(
  map: MapLibreMap,
  normalPoints: LocationPoint[]
): void {
  const normalGeoJSON = createFeatureCollection(normalPoints);

  map.addSource(LOCATIONS_SOURCE_ID, {
    type: "geojson",
    data: normalGeoJSON,
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 50,
  });

  map.addLayer({
    id: CLUSTERS_LAYER_ID,
    type: "circle",
    source: LOCATIONS_SOURCE_ID,
    filter: ["has", "point_count"],
    paint: {
      "circle-color": "#2563eb",
      "circle-radius": [
        "step",
        ["get", "point_count"],
        15,
        20,
        20,
        50,
        25,
      ],
      "circle-stroke-width": 1,
      "circle-stroke-color": "#ffffff",
    },
  });

  map.addLayer({
    id: CLUSTER_COUNT_LAYER_ID,
    type: "symbol",
    source: LOCATIONS_SOURCE_ID,
    filter: ["has", "point_count"],
    layout: {
      "text-field": "{point_count}",
      "text-size": 12,
    },
    paint: {
      "text-color": "#ffffff",
    },
  });

  map.addLayer({
    id: UNCLUSTERED_POINT_LAYER_ID,
    type: "circle",
    source: LOCATIONS_SOURCE_ID,
    filter: ["!", ["has", "point_count"]],
    paint: {
      "circle-color": "#10b981",
      "circle-radius": 5,
      "circle-stroke-width": 1,
      "circle-stroke-color": "#ffffff",
    },
  });
}

export function addSpecialPointLayers(
  map: MapLibreMap,
  specialPoints: LocationPoint[]
): void {
  const specialGeoJSON = createFeatureCollection(specialPoints);

  map.addSource(SPECIAL_SOURCE_ID, {
    type: "geojson",
    data: specialGeoJSON,
  });

  const pulsingDot = createPulsingDot(map);

  if (!map.hasImage(PULSE_IMAGE_ID)) {
    map.addImage(PULSE_IMAGE_ID, pulsingDot, { pixelRatio: 2 });
  }

  map.addLayer({
    id: PULSE_LAYER_ID,
    type: "symbol",
    source: SPECIAL_SOURCE_ID,
    layout: {
      "icon-image": PULSE_IMAGE_ID,
    },
  });
}

export function removeMapArtifacts(map: MapLibreMap): void {
  if (map.getLayer(PULSE_LAYER_ID)) {
    map.removeLayer(PULSE_LAYER_ID);
  }

  if (map.getLayer(UNCLUSTERED_POINT_LAYER_ID)) {
    map.removeLayer(UNCLUSTERED_POINT_LAYER_ID);
  }

  if (map.getLayer(CLUSTER_COUNT_LAYER_ID)) {
    map.removeLayer(CLUSTER_COUNT_LAYER_ID);
  }

  if (map.getLayer(CLUSTERS_LAYER_ID)) {
    map.removeLayer(CLUSTERS_LAYER_ID);
  }

  if (map.getSource(SPECIAL_SOURCE_ID)) {
    map.removeSource(SPECIAL_SOURCE_ID);
  }

  if (map.getSource(LOCATIONS_SOURCE_ID)) {
    map.removeSource(LOCATIONS_SOURCE_ID);
  }

  if (map.hasImage(PULSE_IMAGE_ID)) {
    map.removeImage(PULSE_IMAGE_ID);
  }
}