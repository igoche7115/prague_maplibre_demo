import type { CircleLayerSpecification, SymbolLayerSpecification } from "maplibre-gl";
import type { Coordinates } from "../../types/location";

export const MAP_STYLE_URL = "https://tiles.openfreemap.org/styles/liberty";
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

export const CLUSTER_SOURCE_OPTIONS = {
  cluster: true,
  clusterMaxZoom: 14,
  clusterRadius: 50,
} as const;

export const CLUSTERS_LAYER_CONFIG: Omit<CircleLayerSpecification, "source"> = {
  id: CLUSTERS_LAYER_ID,
  type: "circle",
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
};

export const CLUSTER_COUNT_LAYER_CONFIG: Omit<SymbolLayerSpecification, "source"> = {
  id: CLUSTER_COUNT_LAYER_ID,
  type: "symbol",
  filter: ["has", "point_count"],
  layout: {
    "text-field": "{point_count}",
    "text-size": 12,
  },
  paint: {
    "text-color": "#ffffff",
  },
};

export const UNCLUSTERED_POINT_LAYER_CONFIG: Omit<CircleLayerSpecification, "source"> = {
  id: UNCLUSTERED_POINT_LAYER_ID,
  type: "circle",
  filter: ["!", ["has", "point_count"]],
  paint: {
    "circle-color": "#10b981",
    "circle-radius": 5,
    "circle-stroke-width": 1,
    "circle-stroke-color": "#ffffff",
  },
};

export const PULSE_LAYER_CONFIG: Omit<SymbolLayerSpecification, "source"> = {
  id: PULSE_LAYER_ID,
  type: "symbol",
  layout: {
    "icon-image": PULSE_IMAGE_ID,
  },
};