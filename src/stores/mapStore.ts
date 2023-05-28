import { ChannelData, DeviceType, EVENT_TYPES } from "@/types";
import { create } from "zustand";
import isMobile from "is-mobile";

/* eslint-disable no-unused-vars */
export enum MapType {
  Terrain = "p",
  Satellite = "y",
  Default = "m",
}

export enum MapLayer {
  Heatmap = "heatmap",
  Markers = "markers",
}
/* eslint-enable no-unused-vars */

export type DrawerData = ChannelData | null;

interface MapState {
  eventType?: EVENT_TYPES;
  drawerData: DrawerData;
  isDrawerOpen: boolean;
  device: DeviceType;
  mapType: MapType;
  mapLayers: MapLayer[];
  actions: {
    toggleDrawer: () => void;
    toggleMapLayer: (_mapLayer: MapLayer) => void;

    // after click a point, pass to drawer content
    setDrawerData: (_data: DrawerData) => void;
    setDevice: (_device: DeviceType) => void;
    setMapType: (_mapType: MapType) => void;
    setEventType: (_eventType: EVENT_TYPES) => void;
  };
}

export const useMapStore = create<MapState>()((set) => ({
  drawerData: null,
  isDrawerOpen: false,
  device: isMobile() ? "mobile" : "desktop",
  markerData: [],
  mapType: MapType.Default,
  mapLayers: [],
  actions: {
    toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
    toggleMapLayer: (mapLayer: MapLayer) =>
      set(({ mapLayers }) => ({
        mapLayers: mapLayers.includes(mapLayer)
          ? mapLayers.filter((layer) => layer !== mapLayer)
          : mapLayers.concat(mapLayer),
      })),
    setDrawerData: (data: DrawerData) => set(() => ({ drawerData: data })),
    setDevice: (device: DeviceType) => set(() => ({ device })),
    setMapType: (mapType) => set(() => ({ mapType })),
    setEventType: (eventType) => set(() => ({ eventType })),
  },
}));

export const useIsDrawerOpen = () => useMapStore((state) => state.isDrawerOpen);
export const useDrawerData = () => useMapStore((state) => state.drawerData);
export const useMapActions = () => useMapStore((state) => state.actions);
export const useDevice = () => useMapStore((state) => state.device);
export const useEventType = () => useMapStore((state) => state.eventType);
