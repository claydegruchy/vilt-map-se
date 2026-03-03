<script>
  import Dialog from "./lib/Blocks/Dialog.svelte";
  import { mapConfig } from "./mapConfig.js";
</script>

<Dialog>
  <span slot="button">⚙</span>
  <div slot="content">
    <h3>Settings</h3>
    <div>
      <label>
        <input
          type="checkbox"
          checked={$mapConfig.showTrendArrows}
          on:change={(e) =>
            mapConfig.update((c) => ({
              ...c,
              showTrendArrows: e.target.checked,
            }))}
        />
        Show trendlines
      </label>
    </div>
    <div>
      <label>
        <input
          type="checkbox"
          checked={$mapConfig.showLegend}
          on:change={(e) =>
            mapConfig.update((c) => ({ ...c, showLegend: e.target.checked }))}
        />
        Show legend
      </label>
    </div>
  </div>
</Dialog>
