import { LatLngBoundsExpression } from "leaflet";

export const DEFAULT_CENTER = [39.925533, 32.866287];
export const DEFAULT_ZOOM = 8;
export const DEFAULT_ZOOM_MOBILE = 8;
export const DEFAULT_IMPORTANCY = 1;
export const DEFAULT_MAX_BOUNDS: LatLngBoundsExpression = [
  [39.684006, 31.607263],
  [35.459834, 45.281141],
];
export const DEFAULT_MIN_ZOOM_DESKTOP = 7;
export const DEFAULT_MIN_ZOOM_MOBILE = 4;

export const localStorageKeys = {
  coordinatesURL: "coordinatesURL",
} as const;

export const localForageKeys = {
  markersVisited: "markersVisited",
} as const;

export const safeGetLocalStorage = (key: string) => {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

export const safeSetLocalStorage = (key: string, value: string): void => {
  try {
    return window.localStorage.setItem(key, value);
  } catch {
    //
  }
};
