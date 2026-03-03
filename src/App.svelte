<script>
  import SwedenMap from "./SwedenMap.svelte";

  import MapLegend from "./MapLegend.svelte";
  import SpeciesPanel from "./SpeciesPanel.svelte";
  import SettingsPanel from "./SettingsPanel.svelte";
  import { mapConfig } from "./mapConfig.js";

  import {
    activeSpeciesId,
    activeYear,
    availableYears,
    activeCountyData,
    isLoading,
    species,
  } from "./speciesStore.js";

  import About from "./About.svelte";

  $: activeSpeciesName =
    $species.find((s) => s.id === $activeSpeciesId)?.name ?? "";

  $: allValues = Object.values($activeCountyData).map((d) => d.value);
  $: minVal = allValues.length ? Math.min(...allValues) : 0;
  $: maxVal = allValues.length ? Math.max(...allValues) : 1;

  let selected = null;

  function handleCountyClick(e) {
    selected = e.detail;
    console.log("handleCountyClick", selected);
  }

  let speciesPanelOpen = false;
</script>

<div class="app">
  <header>
    <h1>Enkel Jaktstatistik Sverige</h1>
    <div>
      by <a href="https://www.instagram.com/houseofgruchy">Clay D</a>
    </div>
    {#if $isLoading}<div>Loading...</div>{/if}
    {#if selected}
      <p>
        {selected.name} — {selected.data?.value?.toLocaleString() ?? "No data"} found
      </p>
    {/if}
  </header>

  <div class="map-area" on:countyclick={handleCountyClick}>
    <SwedenMap countyData={$activeCountyData} />

    <div class="desktop-overlays">
      <div class="panel-overlay">
        {#if $availableYears.length}
          <div class="year-overlay">
            <label for="year-slider">{$activeYear}</label>
            <input
              id="year-slider"
              type="range"
              min={0}
              max={$availableYears.length - 1}
              value={$availableYears.indexOf($activeYear)}
              on:input={(e) => activeYear.set($availableYears[+e.target.value])}
            />
            <div class="year-ticks">
              <span>{$availableYears[0]}</span>
              <span>{$availableYears[$availableYears.length - 1]}</span>
            </div>
          </div>
        {/if}
        <SpeciesPanel />
      </div>
      <div class="settings-overlay">
        <About />
        <SettingsPanel />
      </div>
    </div>

    <div class="bottom-bar">
      <button class="bottom-bar-btn" on:click={() => (speciesPanelOpen = true)}>
        {activeSpeciesName}
      </button>
      {#if $availableYears.length}
        <div class="year-slider-compact">
          <span>{$activeYear}</span>
          <input
            type="range"
            min={0}
            max={$availableYears.length - 1}
            value={$availableYears.indexOf($activeYear)}
            on:input={(e) => activeYear.set($availableYears[+e.target.value])}
          />
        </div>
      {/if}

      <About />
      <SettingsPanel />
    </div>

    {#if speciesPanelOpen}
      <div
        class="bottom-sheet"
        on:click|self={() => (speciesPanelOpen = false)}
      >
        <div class="bottom-sheet-inner">
          <SpeciesPanel />
        </div>
      </div>
    {/if}

    {#if $mapConfig.showLegend}
      <div class="legend-overlay">
        <MapLegend {minVal} {maxVal} label={activeSpeciesName} />
      </div>
    {/if}
  </div>
</div>

<style>
  :global(body) {
    margin: 0;
    font-family: system-ui, sans-serif;
  }

  .app {
    display: flex;
    flex-direction: column;
    height: 100vh;
  }

  header {
    padding: 12px 20px;
    background: #1e293b;
    color: #f1f5f9;
    display: flex;
    align-items: baseline;
    gap: 24px;
    flex-shrink: 0;
    height: 20px;
  }

  header h1 {
    margin: 0;
    font-size: 1.1rem;
  }

  header p {
    margin: 0;
    font-size: 0.9rem;
    color: #94a3b8;
  }

  .loading {
    color: #7dd3fc;
  }

  .map-area {
    flex: 1;
    position: relative;
  }

  .panel-overlay {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 10;
  }

  .year-overlay {
    background: rgba(15, 23, 42, 0.88);
    color: #f1f5f9;
    padding: 10px 16px;
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    margin-bottom: 20px;
    z-index: 10;
  }

  .year-overlay label {
    font-size: 1.1rem;
    font-weight: 700;
    letter-spacing: 0.05em;
  }

  .year-overlay input[type="range"] {
    width: 100%;
    cursor: pointer;
  }

  .year-ticks {
    display: flex;
    justify-content: space-between;
    width: 100%;
    font-size: 0.72rem;
    color: #64748b;
  }

  .legend-overlay {
    position: absolute;
    bottom: 24px;
    left: 20px;
    background: rgba(255, 255, 255, 0.92);
    padding: 10px 14px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
    pointer-events: none;
    z-index: 10;
  }

  .settings-overlay {
    position: absolute;
    bottom: 24px;
    right: 20px;
    z-index: 10;
  }

  .desktop-overlays {
    display: contents;
  }

  .bottom-bar {
    display: none;
  }

  .bottom-sheet {
    display: none;
  }

  @media (max-width: 640px) {
    .desktop-overlays {
      display: none;
    }

    .bottom-bar {
      display: flex;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(15, 23, 42, 0.95);
      color: #f1f5f9;
      padding: 10px 16px;
      gap: 12px;
      align-items: center;
      z-index: 20;
    }

    .bottom-bar-btn {
      background: rgba(255, 255, 255, 0.08);
      color: #f1f5f9;
      border: none;
      border-radius: 6px;
      padding: 6px 10px;
      font-size: 0.85rem;
      cursor: pointer;
      white-space: nowrap;
    }

    .year-slider-compact {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.85rem;
    }

    .year-slider-compact input {
      flex: 1;
    }

    .bottom-sheet {
      display: block;
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.4);
      z-index: 30;
    }

    .bottom-sheet-inner {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: #1e293b;
      border-radius: 12px 12px 0 0;
      padding: 16px;
      max-height: 60vh;
      overflow-y: auto;
    }
    .legend-overlay {
      bottom: 80px;
    }
  }
</style>
