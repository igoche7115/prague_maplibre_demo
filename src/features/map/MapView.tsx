import { useEffect, useRef } from "react";
import maplibregl, { Map as MapLibreMap, Marker } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "./MapView.css";
import locationsData from "../../data/locations.json";
import type { LocationPoint } from "../../types/location";
import {
  addClusterLayers,
  addSpecialPointLayers,
  createSpecialMarkers,
  INITIAL_ZOOM,
  PRAGUE_CENTER,
  removeMapArtifacts,
  splitLocations,
} from "./map.utils";

const locations: LocationPoint[] = locationsData;

export default function MapView() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) {
      return;
    }

    const map: MapLibreMap = new maplibregl.Map({
      container: mapContainerRef.current,
      style: "https://tiles.openfreemap.org/styles/liberty",
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

  return <div ref={mapContainerRef} className="map-view__container" />;
}