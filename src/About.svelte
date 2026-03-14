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
      made a few things like this such as
      <a href="https://claydegruchy.github.io/wfrp-map-osm/"
        >Google Maps for Warhammer</a
      >
      and an
      <a href="https://map.weylandyutani.company/">Alien movie galaxy map</a>.
    </p>
    <h3>Where is the data from</h3>
    <p>
      This data is pulled from <a href="viltdata.se">viltdata.se</a> care of Jägareförbundet.
    </p>
    <h3>Why did you make this</h3>
    <p>
      I've got a bit of a specific diet where I only eat hunted meat,
      particularly species that cause enviromental harm if over populated.
    </p>
    <p>
      Finding information on this isn't that easy in most places, but Mattias at
      Jägareförbundet was kind enough to point me in the direction of
      viltdata.se which has a really good dataset.
    </p>
    <p>
      Knowing what regions have an abundance of a given species is useful for
      determining what would be best to eat, and it would be cool if a map like
      this could help people make meat choices based off of population counts
      instead of price tags.
    </p>
    <p>
      It's a pretty lofty idea but I'll mostly use this for personal reference.
    </p>
    <h3>I think something need changing</h3>
    <p>
      This is <a href="https://github.com/claydegruchy/vilt-map-se">
        open source</a
      >
      if you're into programming but I'm happy to make updates too. Hit me up on
      <a href="https://www.instagram.com/houseofgruchy">Instagram</a> or
      <a href="mailto:vilt-map-se@claydegruchy.com">email</a>.
    </p>
    <h3>I think this sucks</h3>
    <p>well thats just like your opinion, man</p>
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
