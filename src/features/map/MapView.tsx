import "maplibre-gl/dist/maplibre-gl.css";
import "./MapView.css";
import { usePragueMap } from "./usePragueMap";

export default function MapView() {
  const { mapContainerRef } = usePragueMap();

  return <div ref={mapContainerRef} className="map-view__container" />;
}