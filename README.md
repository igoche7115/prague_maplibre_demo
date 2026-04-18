# Prague MapLibre Demo

A React + TypeScript demo built with MapLibre that displays approximately 300 mocked locations across Prague, including clustered regular points and 3 always-visible special points with a pulsing highlight.

## Live Demo

GitHub Pages deployment:

`https://igoche7115.github.io/prague_maplibre_demo/`

## Repository

GitHub repository:

`https://github.com/igoche7115/prague_maplibre_demo`

---

## Project Goal

The goal of this project is to demonstrate a small but complete frontend mapping solution that focuses on:

- rendering a map centered on Prague
- handling many points efficiently
- clustering nearby points
- distinguishing special points from regular points
- organizing the code in a maintainable way

---

## Tech Stack

- **React**
- **TypeScript**
- **Vite**
- **MapLibre GL**
- **GitHub Pages** for deployment

---

## Features Implemented

### 1. Map centered on Prague
The map loads with Prague as the initial center and a suitable starting zoom level.

### 2. Approximately 300 mocked locations
Location data is stored in a separate JSON file and imported into the app.

### 3. Uneven point distribution
The dataset simulates a more realistic distribution:
- some isolated points
- some grouped points that naturally form clusters

### 4. Clustering for regular points
Regular points are rendered through a clustered GeoJSON source, so nearby points group together when zoomed out and separate when zoomed in.

### 5. Three special points
Three points are treated as special:
- they are excluded from clustering
- they remain individually visible
- they use emoji markers

### 6. Pulsing highlight effect
Each special point includes a pulsing blue highlight that repeats continuously.

### 7. Live deployment
The project is deployed to GitHub Pages for easy review.

---

## How to Run the Project Locally

### 1. Clone the repository

```bash
git clone https://github.com/igoche7115/prague_maplibre_demo.git
cd prague_maplibre_demo/map-demo