<script>
  import { mapConfig } from "./mapConfig.js";
  import { activeSpeciesId, activeTotalHunted } from "./speciesStore.js";

  export let minVal = 0;
  export let maxVal = 100;
  export let label = "";

  let config;
  mapConfig.subscribe((v) => (config = v));

  const STEPS = 8;

  $: stops = Array.from({ length: STEPS }, (_, i) => {
    const t = i / (STEPS - 1);
    const value = minVal + t * (maxVal - minVal);
    return config.colorScale(value, minVal, maxVal);
  });

  $: gradient = `linear-gradient(to right, ${stops.join(", ")})`;

  function fmt(n) {
    return Number.isInteger(n) ? n.toLocaleString() : n.toFixed(1);
  }
</script>

<div class="legend">
  {#if label}
    <div class="legend-label">{label}</div>
    <span class="total">{$activeTotalHunted.toLocaleString()} total</span>
  {/if}
  <div class="gradient-bar" style="background: {gradient};"></div>
  <div class="ticks">
    <span>{fmt(minVal)}</span>
    <span>{fmt((minVal + maxVal) / 2)}</span>
    <span>{fmt(maxVal)}</span>
  </div>
</div>

<style>
  .legend {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-family: inherit;
    font-size: 0.8rem;
    color: #334155;
    min-width: 160px;
  }

  .legend-label {
    font-weight: 600;
    color: #1e293b;
  }

  .gradient-bar {
    height: 12px;
    border-radius: 4px;
    width: 100%;
  }

  .ticks {
    display: flex;
    justify-content: space-between;
    color: #64748b;
  }
</style>
