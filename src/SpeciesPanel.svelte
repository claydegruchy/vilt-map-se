<script>
  import { species, activeSpeciesId } from "./speciesStore.js";

  // Group by speciesGroupId — labels unknown so we just use the id as a heading
  $: grouped = $species.reduce((acc, s) => {
    const key = s.speciesGroupId ?? "Övrigt";
    (acc[key] ??= []).push(s);
    return acc;
  }, {});
</script>

<div class="panel">
  <div class="panel-title">Art</div>
  {#each Object.entries(grouped) as [group, members]}
    <div class="category">Group {group}</div>
    {#each members as s}
      <button
        class="species-btn"
        class:active={$activeSpeciesId === s.id}
        on:click={() => activeSpeciesId.set(s.id)}
      >
        <div class="species-name">
          <div>{s.name}</div>
          <div>{s.swedishName}</div>
        </div>
      </button>
    {/each}
  {/each}
</div>

<style>
  .panel {
    background: rgba(15, 23, 42, 0.92);
    color: #f1f5f9;
    border-radius: 8px;
    padding: 12px;

    max-height: 60vh;
    overflow-y: auto;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
    font-family: inherit;
    font-size: 0.82rem;
  }

  .panel-title {
    font-weight: 700;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #94a3b8;
    margin-bottom: 8px;
  }

  .category {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #475569;
    margin: 10px 0 4px;
  }

  .species-btn {
    display: block;
    width: 100%;
    text-align: left;
    background: none;
    border: none;
    color: #cbd5e1;
    padding: 4px 6px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.82rem;
    font-family: inherit;
    transition:
      background 0.1s,
      color 0.1s;
  }

  .species-btn:hover {
    background: rgba(255, 255, 255, 0.07);
    color: #f1f5f9;
  }

  .species-btn.active {
    background: rgba(125, 211, 252, 0.15);
    color: #7dd3fc;
    font-weight: 600;
  }

  .species-name {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    width: 100%;
  }
</style>
