<script>
  import { onMount, onDestroy } from "svelte";
  import Map from "ol/Map";
  import View from "ol/View";
  import VectorLayer from "ol/layer/Vector";
  import VectorSource from "ol/source/Vector";
  import TileLayer from "ol/layer/Tile";
  import OSM from "ol/source/OSM";
  import GeoJSON from "ol/format/GeoJSON";
  import { Style, Fill, Stroke } from "ol/style";
  import Overlay from "ol/Overlay";
  import { fromLonLat } from "ol/proj";
  import "ol/ol.css";

  import geojsonData from "../public/swedish_regions.json";
  import { mapConfig, makeEmptyPattern } from "./mapConfig.js";
  import { regionByShortName } from "./speciesStore";

  import { regionTop5 } from "./speciesStore.js";
  import { get } from "svelte/store";

  /**
   * countyData: Record<string, { label: string; value: number }>
   * Keyed by county id (e.g. "AB", "C", "BD").
   * value is used for choropleth fill.
   */
  export let countyData = {};

  let config;
  mapConfig.subscribe((v) => (config = v));

  let mapEl;
  let tooltipEl;
  let map;
  let overlay;
  let vectorLayer;

  // Tooltip state
  let tooltipContent = { name: "", label: "", value: null };
  let tooltipVisible = false;

  $: allValues = Object.values(countyData)
    .map((d) => d.value)
    .filter((v) => v != null);
  $: minVal = allValues.length ? Math.min(...allValues) : 0;
  $: maxVal = allValues.length ? Math.max(...allValues) : 1;
  import { Text } from "ol/style";

  const emptyPattern = makeEmptyPattern();

  function getStyle(feature, highlighted = false) {
    const id = String(feature.get("l_id"));
    const data = countyData[id];
    const fillColor =
      data?.value != null && data.value > 0
        ? config.colorScale(data.value, minVal, maxVal)
        : data?.value === 0
          ? emptyPattern
          : config.defaultFill;

    const trend =
      data?.prevValue == null
        ? null
        : data.value > data.prevValue
          ? "↑"
          : data.value < data.prevValue
            ? "↓"
            : "→";

    return new Style({
      fill: new Fill({ color: fillColor }),
      stroke: new Stroke({
        color: highlighted ? config.highlightStroke : config.defaultStroke,
        width: highlighted
          ? config.highlightStrokeWidth
          : config.defaultStrokeWidth,
      }),

      text:
        trend && config.showTrendArrows
          ? new Text({
              text: trend,
              font: "bold 24px sans-serif",
              fill: new Fill({
                color:
                  trend === "↑"
                    ? "#4ade80"
                    : trend === "↓"
                      ? "#f87171"
                      : "#94a3b8",
              }),
            })
          : undefined,
    });
  }

  function updateStyles() {
    if (!vectorLayer) return;
    vectorLayer
      .getSource()
      .getFeatures()
      .forEach((f) => {
        f.setStyle(getStyle(f));
      });
  }

  $: if (countyData && vectorLayer) {
    updateStyles();
  }

  onMount(() => {
    const source = new VectorSource({
      features: new GeoJSON().readFeatures(geojsonData, {
        featureProjection: "EPSG:3857",
      }),
    });

    vectorLayer = new VectorLayer({
      source,
      style: (feature) => getStyle(feature),
    });

    overlay = new Overlay({
      element: tooltipEl,
      positioning: "bottom-left",
      offset: [12, -8],
      stopEvent: false,
    });

    map = new Map({
      target: mapEl,
      layers: [new TileLayer({ source: new OSM() }), vectorLayer],
      overlays: [overlay],
      view: new View({
        center: fromLonLat([16.5, 62.5]),
        zoom: 4.5,
        minZoom: 3,
        maxZoom: 10,
        enableRotation: false,
      }),
      controls: [],
    });

    let highlighted = null;

    map.on("pointermove", (evt) => {
      if (evt.dragging) return;

      const feature = map.forEachFeatureAtPixel(evt.pixel, (f) => f);

      if (feature !== highlighted) {
        if (highlighted) highlighted.setStyle(getStyle(highlighted, false));
        highlighted = feature || null;
        if (highlighted) highlighted.setStyle(getStyle(highlighted, true));
      }

      if (feature) {
        const id = String(feature.get("l_id"));
        const name = feature.get("name");
        const data = countyData[id];

        const top5 = get(regionTop5)[id] ?? [];
        tooltipContent = {
          name,
          label: data?.label ?? "",
          value: data?.value ?? null,
          top5,
        };

        tooltipVisible = true;
        overlay.setPosition(evt.coordinate);
      } else {
        tooltipVisible = false;
        overlay.setPosition(undefined);
      }

      map.getViewport().style.cursor = feature ? "pointer" : "default";
    });

    map.on("click", (evt) => {
      const feature = map.forEachFeatureAtPixel(evt.pixel, (f) => f);
      if (feature) {
        const id = String(feature.get("l_id"));
        const name = feature.get("name");
        const data = countyData[id];
        tooltipContent = {
          name,
          label: data?.label ?? "",
          value: data?.value ?? null,
        };
        tooltipVisible = true;
        overlay.setPosition(evt.coordinate);
        mapEl.dispatchEvent(
          new CustomEvent("countyclick", {
            bubbles: true,
            detail: { id, name, data },
          }),
        );
      } else {
        tooltipVisible = false;
        overlay.setPosition(undefined);
      }
    });
  });

  onDestroy(() => {
    map?.setTarget(null);
  });
</script>

<div class="map-wrapper">
  <div bind:this={mapEl} class="map-container"></div>

  <div bind:this={tooltipEl} class="tooltip" class:visible={tooltipVisible}>
    <div class="tooltip-name">{tooltipContent.name}</div>
    {#if tooltipContent.label}
      <div class="tooltip-label">{tooltipContent.label}</div>
    {/if}
    {#if tooltipContent.value != null}
      <div class="tooltip-value">{tooltipContent.value}</div>
    {/if}

    {#if tooltipContent.top5?.length}
      <div class="tooltip-top5">
        {#each tooltipContent.top5 as s, i}
          <div>{i + 1}. {s.name} — {s.value.toLocaleString()}</div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  .map-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .map-container {
    width: 100%;
    height: 100%;
    background: #f0f4f7;
  }

  .tooltip {
    position: absolute;
    background: rgba(15, 23, 42, 0.92);
    color: #f1f5f9;
    border-radius: 6px;
    padding: 8px 12px;
    font-family: inherit;
    font-size: 0.85rem;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.15s ease;
    white-space: nowrap;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
    z-index: 10;
  }

  .tooltip.visible {
    opacity: 1;
  }

  .tooltip-name {
    font-weight: 600;
    margin-bottom: 2px;
  }

  .tooltip-label {
    color: #94a3b8;
    font-size: 0.78rem;
  }

  .tooltip-value {
    color: #7dd3fc;
    font-size: 0.92rem;
    margin-top: 2px;
  }

  .tooltip-top5 {
    margin-top: 6px;
    font-size: 0.78rem;
    color: #cbd5e1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
</style>
