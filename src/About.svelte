<script>
  import Dialog from "./lib/Blocks/Dialog.svelte";
</script>

<Dialog>
  <div slot="button">?</div>
  <div slot="content" class="about">
    <h3>What is this</h3>
    <p>
      This is a map of hunting statistics in Sweden between 2004 and 2024,
      displayed as a quick interactive map.
    </p>
    <h3>Who are you</h3>
    <p>
      I'm <a href="https://www.instagram.com/houseofgruchy">Clay D</a>. I've
      made a few things like this:
    </p>
    <p>
      <a href="https://claydegruchy.github.io/wfrp-map-osm/"
        >Google Maps for Warhammer</a
      >
    </p>
    <p>
      <a href="https://map.weylandyutani.company/">Alien movie galaxy map</a>
    </p>
    <h3>Why did you make this</h3>
    <p>
      I've got a very specific diet where I only eat hunted meat, particularly
      species that cause enviromental harm if over populated.
    </p>
    <p>
      Finding information on this isn't that easy in most places, but Mattias at
      jagareforbundet was kind enough to point me in the direction of
      viltdata.se where I drew this data from.
    </p>
    <p>
      The goal is to make a system that helps people make sensible meat choices
      based off of population counts instead of price tags.
    </p>

    <p>
      It's a pretty lofty idea but I'll mostly use this for personal reference
    </p>
    <h3>I think something need changing</h3>
    <p>
      This is <a href="https://github.com/claydegruchy/vilt-map-se">
        open source</a
      > but I'm happy to make updates. Hit me up on the gram link above.
    </p>
    <h3>I don't like this</h3>
    <p>ok</p>
  </div></Dialog
>

<style>
  .about {
    max-width: 50vw;
    text-align: left;
  }

  @media (max-width: 640px) {
    .about {
      max-width: 90vw;
    }
  }
</style>
