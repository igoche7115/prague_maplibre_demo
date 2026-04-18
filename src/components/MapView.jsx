import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import locations from "../data/locations.json";

export default function MapView() {
  const mapRef = useRef(null);

  useEffect(() => {
    const map = new maplibregl.Map({
      container: mapRef.current,
      style: "https://tiles.openfreemap.org/styles/liberty",
      center: [14.4378, 50.0755],
      zoom: 11,
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");

    let specialMarkers = [];

    map.on("load", () => {
      const specialPoints = locations.slice(0, 3);
      const normalPoints = locations.slice(3);

      const normalGeoJSON = {
        type: "FeatureCollection",
        features: normalPoints.map((loc) => ({
          type: "Feature",
          properties: {},
          geometry: {
            type: "Point",
            coordinates: [loc.lng, loc.lat],
          },
        })),
      };

      const specialGeoJSON = {
        type: "FeatureCollection",
        features: specialPoints.map((loc) => ({
          type: "Feature",
          properties: {
            emoji: loc.emoji,
          },
          geometry: {
            type: "Point",
            coordinates: [loc.lng, loc.lat],
          },
        })),
      };

      // NORMAL POINTS WITH CLUSTERING
      map.addSource("locations", {
        type: "geojson",
        data: normalGeoJSON,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      });

      map.addLayer({
        id: "clusters",
        type: "circle",
        source: "locations",
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
        id: "cluster-count",
        type: "symbol",
        source: "locations",
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
        id: "unclustered-point",
        type: "circle",
        source: "locations",
        filter: ["!", ["has", "point_count"]],
        paint: {
          "circle-color": "#10b981",
          "circle-radius": 5,
          "circle-stroke-width": 1,
          "circle-stroke-color": "#ffffff",
        },
      });

      // SPECIAL SOURCE FOR PULSE EFFECT
      map.addSource("special", {
        type: "geojson",
        data: specialGeoJSON,
      });

      // PULSE IMAGE
      const size = 100;

      const pulsingDot = {
        width: size,
        height: size,
        data: new Uint8Array(size * size * 4),

        onAdd: function () {
          const canvas = document.createElement("canvas");
          canvas.width = size;
          canvas.height = size;
          this.context = canvas.getContext("2d");
        },

        render: function () {
          const duration = 1000;
          const t = (performance.now() % duration) / duration;

          const radius = (size / 2) * t;

          const context = this.context;
          context.clearRect(0, 0, size, size);

          context.beginPath();
          context.arc(size / 2, size / 2, radius, 0, Math.PI * 2);
          context.fillStyle = `rgba(0, 136, 255, ${1 - t})`;
          context.fill();

          this.data = context.getImageData(0, 0, size, size).data;

          map.triggerRepaint();
          return true;
        },
      };

      if (!map.hasImage("pulse")) {
        map.addImage("pulse", pulsingDot, { pixelRatio: 2 });
      }

      map.addLayer({
        id: "pulse-layer",
        type: "symbol",
        source: "special",
        layout: {
          "icon-image": "pulse",
        },
      });

      // SPECIAL EMOJI MARKERS
      specialMarkers = specialPoints.map((point) => {
        const el = document.createElement("div");
        el.textContent = point.emoji;
        el.style.fontSize = "26px";
        el.style.lineHeight = "26px";
        el.style.width = "26px";
        el.style.height = "26px";
        el.style.display = "flex";
        el.style.alignItems = "center";
        el.style.justifyContent = "center";
        el.style.transform = "translateY(-2px)";
        el.style.pointerEvents = "none";

        return new maplibregl.Marker({
          element: el,
          anchor: "center",
        })
          .setLngLat([point.lng, point.lat])
          .addTo(map);
      });
    });

    return () => {
      specialMarkers.forEach((marker) => marker.remove());
      map.remove();
    };
  }, []);

  return <div ref={mapRef} style={{ width: "100%", height: "100vh" }} />;
}