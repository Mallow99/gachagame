// Complete source pieces stay intact. Banner composition and reveal art are
// separate, and all use in this build is private prototype use (see credits).
import sourceEra from '../../assets/portraits/source-era/manifest.mjs';
export const REVEAL_ART = {
  'classic-mario': {url:'demos/mario-pull/pull-block.webp',style:'painted',credit:'しかばね · approved demo intake'},
  'adventure-kirby': {url:'assets/portraits/kirby.png',style:'portrait',credit:'Nintendo / HAL Laboratory · enhanced presentation'},
  'dream-land-kirby': {url:'assets/portraits/kirby.png',style:'portrait',credit:'Nintendo / HAL Laboratory · enhanced presentation'},
  ...sourceEra,
};
export const BANNER_ART = {
  mario:{url:'demos/mario-pull/pull-flower.webp',style:'painted',credit:'maribou · approved demo intake'},
  kirby:{url:'assets/scenes/ka-valley.png',style:'pixel',credit:'Drshnaps / HAL Laboratory · source scene'},
};
