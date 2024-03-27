/**
 * Nature element: magical nature of the spell/effect
 * some creatures might be resistant to particular elements
 *
 * common spells/effects according to nature:
 *
 * fire: burning hands, fire bolt
 * cold: cold blast, ice spray
 * earth: poison, sand burst, sand walking
 * water: acid, water walking
 * air: disease, levitate, ethereal portal, shield
 * stone: petrification, stone skin
 * life: drain stats, drain life, healing, dispel undead
 * electric: shock, lightning bolt, chain lightning
 * mind: paralysis, charm, sight veil, see invisible
 * astral: teleport, banish demon, charm of opening
 */
export type TNatureElement =
  | "fire"
  | "cold"
  | "earth"
  | "water"
  | "air"
  | "stone"
  | "life"
  | "electric"
  | "mind"
  | "astral";
