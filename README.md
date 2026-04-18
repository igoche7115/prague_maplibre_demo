# MapLibre Vehicle Visualization

## Overview
This project visualizes vehicle locations on a map using MapLibre GL.

It demonstrates clustering, special-case rendering, and animated highlighting of selected points.

---

## Features

### Clustering
- Groups nearby vehicle points dynamically
- Displays count of clustered items
- Expands smoothly on zoom

### Normal Vehicles
- Rendered as small green markers
- Included in clustering logic

### Special Vehicles
- First 3 vehicles are treated as "priority"
- Rendered as distinct orange markers
- Excluded from clustering for visibility

### Animation
- Custom pulsing effect using canvas rendering
- Highlights important vehicles clearly

---

## Technical Approach

- Built with React + Vite
- Map rendering via MapLibre GL
- Data structured as GeoJSON
- Layer-based rendering strategy:
  - Cluster layer
  - Cluster count labels
  - Unclustered points
  - Special points
  - Animated pulse layer

---

## Key Decisions

- **Separated datasets** (normal vs special) to control behavior
- **Used clustering** to handle large datasets efficiently
- **Implemented animation manually** for better control
- **Avoided emoji rendering** due to cross-browser inconsistencies

---

## How to Run

```bash
npm install
npm run dev