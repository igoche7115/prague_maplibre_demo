export type Coordinates = [number, number];

export type LocationPoint = {
  id: number;
  lat: number;
  lng: number;
  emoji: string;
};

export type LocationProperties = {
  id: number;
  emoji: string;
};

export type PointGeometry = {
  type: "Point";
  coordinates: Coordinates;
};

export type GeoJSONFeature<TProperties = Record<string, unknown>> = {
  type: "Feature";
  properties: TProperties;
  geometry: PointGeometry;
};

export type GeoJSONFeatureCollection<TProperties = Record<string, unknown>> = {
  type: "FeatureCollection";
  features: GeoJSONFeature<TProperties>[];
};