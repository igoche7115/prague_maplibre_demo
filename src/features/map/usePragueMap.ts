import { useEffect, useRef } from "react";
import maplibregl, { Map as MapLibreMap, Marker } from "maplibre-gl";
import locationsData from "../../data/locations.json";
import type { LocationPoint } from "../../types/location";
import { INITIAL_ZOOM, MAP_STYLE_URL, PRAGUE_CENTER } from "./map.config";
import {
  addClusterLayers,
  addSpecialPointLayers,
  createSpecialMarkers,
  removeMapArtifacts,
  splitLocations,
} from "./map.utils";

const locations: LocationPoint[] = locationsData;

type UsePragueMapReturn = {
  mapContainerRef: React.RefObject<HTMLDivElement | null>;
};

export function usePragueMap(): UsePragueMapReturn {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) {
      return;
    }

    const map: MapLibreMap = new maplibregl.Map({
      container: mapContainerRef.current,
      style: MAP_STYLE_URL,
      center: PRAGUE_CENTER,
      zoom: INITIAL_ZOOM,
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");

    let specialMarkers: Marker[] = [];

    map.on("load", () => {
      const { specialPoints, normalPoints } = splitLocations(locations);

      addClusterLayers(map, normalPoints);
      addSpecialPointLayers(map, specialPoints);
      specialMarkers = createSpecialMarkers(specialPoints, map);
    });

    return () => {
      specialMarkers.forEach((marker) => marker.remove());
      removeMapArtifacts(map);
      map.remove();
    };
  }, []);

  return { mapContainerRef };
}