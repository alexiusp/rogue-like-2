import { createEffect, createEvent, createStore, sample } from "effector";
import {
  $character,
  $characterIsDead,
  $characterState,
  $characterStats,
  characterHpChanged,
  characterResurrected,
} from "../character/state";
import { createDelayEffect } from "../common/delay";
import {
  $currentLevel,
  $currentMapTile,
  $dungeonLevelMap,
  $dungeonState,
  $encounter,
  moveCharacter,
  startMonsterBattle,
} from "../dungeon/state";
import { EEncounterType } from "../dungeon/types";
import {
  isSpellCombat,
  isTargetedOnSelfSpell,
  isTargetedSpell,
} from "../magic/models";
import { characterCastsASpell } from "../magic/state";
import { IGameSpell } from "../magic/types";
import {
  EAggroMode,
  IGameMonster,
  areAllMonstersDead,
} from "../monsters/model";
import { forward } from "../navigation";
import {
  characterAttacksMonsterWithSpellFx,
  characterAttacksSingleMonsterFx,
  characterFledFx,
  characterFleeDetectionFx,
  monsterAttackCharacterFx,
  spellEffectsAppliedToMonstersFx,
} from "./battleEffects";
import {
  shouldCharacterBeAttackedByMonster,
  toggleMonstersAggro,
  updateDungeonStateWithResultsOfAnAttack,
} from "./model";
import { TBattleRound, TCharacterHitResult, TMonstersHitResult } from "./types";

/**
 * Battle flow:
 * 1. startMonsterBattle fired which triggers startCharacterRound
 * 1.1. battle round set to "character"
 * 2. during character round we wait for character action which are:
 * - monsterAttacked event - physical attack on a single monster
 * - monsterAttackedBySpell event
 * - ... more to come
 * 2.1. in case of a physical attack an effect is called which calculates
 * chances and damage to do to a particular monster. result is saved to
 * state to display on UI and saved to dungeon state.
 * 2.2. in case of a magical attack (combat spell directed on monster)
 * an effect is called to calculate and apply effects to monsters.
 * 2.3. after any of attacks an effect is called to trigger aggro
 * 3. after physical damage is applied an effect is called to determine
 * if all monsters are dead and end the battle
 * 4. after physical damage is applied an effect is called to calculate
 * and apply damage from effects
 * 5. after all magical damage is applied an effect is called to determine
 * if all monsters are dead and end the battle (same as pt. 3)
 * 6. if there are alive monsters toggle transition to monsters round
 * 7. speecial case - "defend" mode
 * 8. special case "flee" mode
 * 9. monsters round
 * 9.1. monsters special attacks handling - to be implemented
 * 10. when monsters round ended check if character has fled
 * 11. when monsters round ended check if character is dead and waits for resurrect
 * 12. if battle continues - switch back to character round and start from p.2
 */

// event that triggers character round
const startCharacterRound = createEvent();
startCharacterRound.watch(() => console.info("startCharacterRound"));
// event that triggers transition delay from character to monsters round
const characterToMonsterTransition = createEvent();
characterToMonsterTransition.watch(() =>
  console.info("characterToMonsterTransition"),
);
// event that triggers monsters round
const startMonstersRound = createEvent();
// trigger transition to character when all monsters attacked
const monsterToCharacterTransition = createEvent();
monsterToCharacterTransition.watch(() =>
  console.info("monsterToCharacterTransition"),
);

// battle round defines where we are in the flow
export const $battleRound = createStore<TBattleRound>("character");
$battleRound.reset(startCharacterRound);
$battleRound.watch((s) => console.info("battle round:", s));
// switch round stage after attack is done
$battleRound.on(characterToMonsterTransition, () => "character-to-monster");
// switch to battle round when transition done
$battleRound.on(startMonstersRound, () => "monster");
// switch round stage after attack is done
$battleRound.on(monsterToCharacterTransition, () => "monster-to-character");

// trigger character round as soon as battle is started
// TODO: in future we might check for "initiative" to decide who starts first
sample({
  clock: startMonsterBattle,
  target: startCharacterRound,
});

// transition delay effects
const BATTLE_ROUND_DELAY_MS = 800;
const delay = createDelayEffect(BATTLE_ROUND_DELAY_MS);

const characterToMonsterTransitionFx = createEffect(delay);
const monsterToCharacterTransitionFx = createEffect(delay);

// trigger character to monster transition effect when round triggered
sample({
  clock: characterToMonsterTransition,
  target: characterToMonsterTransitionFx,
});

// trigger monsters round when transition done
sample({
  clock: characterToMonsterTransitionFx.done,
  target: startMonstersRound,
});

// trigger character to monster transition effect when round triggered
sample({
  clock: monsterToCharacterTransition,
  target: monsterToCharacterTransitionFx,
});

// some state mapping for convenience
export const $monsters = $encounter.map((encounter) =>
  encounter !== null && encounter.type === EEncounterType.Monster
    ? encounter.monsters
    : null,
);
// length of monsters array of current encounter
const $monstersLength = $monsters.map((monsters) =>
  monsters ? monsters.length : 0,
);
$monstersLength.watch((length) => console.info("$monstersLength:", length));

// result of monsters health change
export const $monstersHitResult = createStore<TMonstersHitResult>([]);
$monstersHitResult.reset(startMonstersRound);
$monstersHitResult.reset(startCharacterRound);
$monstersHitResult.watch((hitResult) =>
  console.info("monsters hitResult:", hitResult),
);

// result of character health change
export const $characterHitResult = createStore<TCharacterHitResult>(null);
$characterHitResult.reset(startMonstersRound);
$characterHitResult.reset(startCharacterRound);
$characterHitResult.watch((hitResult) =>
  console.info("character hitResult:", hitResult),
);

// Step 2. - character attacks monster(-s)
// event to fire from UI
export const monsterAttacked = createEvent<number>();
// Step 2.1
// collect data from stores to calculate an attack
sample({
  clock: monsterAttacked,
  source: { monsters: $monsters, character: $characterState },
  target: characterAttacksSingleMonsterFx,
  fn: ({ monsters, character }, index) => {
    if (!monsters) {
      throw new Error("monsters are not defined");
    }
    const params = {
      monsters,
      character,
      monsterCursor: index,
    };
    return params;
  },
});

// set animation state to result of an attack
sample({
  clock: characterAttacksSingleMonsterFx.doneData,
  target: $monstersHitResult,
});

// update dungeon state with results of an attack
sample({
  clock: characterAttacksSingleMonsterFx.finally,
  source: {
    state: $dungeonState,
    level: $currentLevel,
    tile: $currentMapTile,
    monsters: $monsters,
  },
  target: $dungeonState,
  fn: ({ level, monsters, state, tile }, clock) =>
    updateDungeonStateWithResultsOfAnAttack(
      level,
      tile,
      state,
      monsters,
      clock.status === "done" ? clock.result : clock.error,
    ),
});

// Step 2.2. spells
export const $spellSelected = createStore<IGameSpell | null>(null);
const spellsApplicationDelayFx = createEffect(delay);
$spellSelected.watch((spell) =>
  console.log("spell selected for casting", spell),
);

// save combat spell to store when cast
// to wait for target selection
sample({
  clock: characterCastsASpell,
  target: $spellSelected,
  filter(spell) {
    // filter only combat spells
    if (!isSpellCombat(spell.name)) {
      return false;
    }
    // and not target=all or self - they will trigger immediately
    if (!isTargetedSpell(spell.name)) {
      return false;
    }
    return true;
  },
});

// switch to monsters turn when cast spell on self
sample({
  clock: characterCastsASpell,
  source: $encounter,
  target: spellsApplicationDelayFx,
  filter(encounter, spell) {
    // ignore if not in an encounter
    if (encounter === null) {
      return false;
    }
    // filter only combat spells
    if (!isSpellCombat(spell.name)) {
      return false;
    }
    // and target = self
    return isTargetedOnSelfSpell(spell.name);
  },
});

// Step 2.2. - character attacks monster with spell
// TODO: target=all and number handling
// need to create a spell for testing first
// event parameter - monster index in the list of current monsters
export const monsterAttackedBySpell = createEvent<number>();

// trigger effect when event is dispatched
sample({
  clock: monsterAttackedBySpell,
  source: {
    monsters: $monsters,
    character: $character,
    spell: $spellSelected,
  },
  target: characterAttacksMonsterWithSpellFx,
  fn: ({ monsters, character, spell }, index) => {
    if (!spell) {
      // this error should never happen actually
      throw new Error("Invalid spell!");
    }
    if (!monsters) {
      throw new Error("Invalid monsters state!");
    }
    const params = {
      monsters,
      monsterCursor: index,
      character,
      spell,
    };
    return params;
  },
  filter({ spell }) {
    if (spell === null) {
      return false;
    }
    // TODO: implement other checks? what shold they be?
    return true;
  },
});

// redirect monsters data from effects generation to dungeon state
sample({
  clock: characterAttacksMonsterWithSpellFx.doneData,
  source: {
    state: $dungeonState,
    level: $currentLevel,
    tile: $currentMapTile,
    monsters: $monsters,
  },
  target: $dungeonState,
  fn: ({ level, state, tile, monsters }, { monsters: updatedMonsters }) => {
    if (!monsters) {
      throw new Error("invalid monsters state");
    }
    // this merging is needed to avoid overriding aggro monsters with monsters with effects
    const mergedMonsters = monsters.map((monster, index) => {
      const updatedMonster: IGameMonster = {
        ...monster,
        effects: updatedMonsters[index].effects,
      };
      return updatedMonster;
    });
    return updateDungeonStateWithResultsOfAnAttack(
      level,
      tile,
      state,
      mergedMonsters,
      [],
    );
  },
});

// apply mana reduction to the character
sample({
  clock: characterAttacksMonsterWithSpellFx.doneData,
  source: $character,
  target: $character,
  fn(character, { manaCost }) {
    return { ...character, mp: character.mp - manaCost };
  },
});

// Step 2.3
// in case of attack from character (fighting or spell)
// trigger aggro for all monsters and update dungeon state
sample({
  clock: [monsterAttacked, monsterAttackedBySpell],
  source: {
    state: $dungeonState,
    level: $currentLevel,
    tile: $currentMapTile,
    monsters: $monsters,
  },
  target: $dungeonState,
  fn: toggleMonstersAggro,
});

// Step 3 - detect end of battle
// in case of all monsters are dead after fighting
export const battleEnded = createEvent();
// redirect to reward screen when battle ended.
const battleEndedDelayFx = createEffect(delay);
sample({ clock: battleEnded, target: battleEndedDelayFx });
sample({ clock: battleEndedDelayFx.done, target: forward, fn: () => "reward" });

// do some delay to let state be updated
sample({
  clock: [
    characterAttacksSingleMonsterFx.finally,
    characterAttacksMonsterWithSpellFx.finally,
  ],
  target: spellsApplicationDelayFx,
});

sample({
  clock: spellsApplicationDelayFx.finally,
  source: $monsters,
  filter: (monsters) => {
    if (!monsters) {
      return false;
    }
    return areAllMonstersDead(monsters);
  },
  target: battleEnded,
});

// Step 4. trigger spells effects application to monsters
// if not all monsters are dead
sample({
  clock: spellsApplicationDelayFx.finally,
  source: $monsters,
  filter: (monsters) => {
    if (!monsters) {
      return false;
    }
    return !areAllMonstersDead(monsters);
  },
  target: spellEffectsAppliedToMonstersFx,
});

// show damage done on UI
sample({
  clock: spellEffectsAppliedToMonstersFx.doneData,
  target: $monstersHitResult,
  fn({ hitResults }) {
    return hitResults;
  },
});

// update dungeon state with results of effects application
sample({
  clock: spellEffectsAppliedToMonstersFx.doneData,
  source: { state: $dungeonState, level: $currentLevel, tile: $currentMapTile },
  target: $dungeonState,
  fn: ({ level, state, tile }, { hitResults, monsters }) =>
    updateDungeonStateWithResultsOfAnAttack(
      level,
      tile,
      state,
      monsters,
      hitResults,
    ),
});

// Step 5.
// detect end of the battle after spells effects application
sample({
  clock: spellEffectsAppliedToMonstersFx.finally,
  source: $monsters,
  filter: (monsters) => {
    if (!monsters) {
      return false;
    }
    return areAllMonstersDead(monsters);
  },
  target: battleEnded,
});

// Step 6. if battle not ended - start transition of the battle round to monsters
sample({
  clock: spellEffectsAppliedToMonstersFx.finally,
  source: $monsters,
  filter: (monsters) => {
    if (!monsters) {
      return false;
    }
    return !areAllMonstersDead(monsters);
  },
  target: characterToMonsterTransition,
});

// Step 7.
// defend mode - increase (double) defense for the next round
// in future we can consider to keep defense boost for several rounds
// to make it more useful for current single-character mode
export const characterDefends = createEvent();
const $isDefending = createStore(false);
$isDefending.on(characterDefends, () => true);
$isDefending.reset(startCharacterRound);

// start monsters round right after defend mode is set
sample({
  clock: characterDefends,
  target: startMonstersRound,
});

// Step 8.
// flee mode - monsters are making a round
// and at end we roll if character can exit the battle
export const characterTriesToFlee = createEvent();
const $isFleeing = createStore(false);
$isFleeing.on(characterTriesToFlee, () => true);
$isFleeing.reset(startCharacterRound);

// start monsters round right after flee mode is set
sample({
  clock: characterTriesToFlee,
  target: startMonstersRound,
});

// Step 9. monsters round

// cursor to switch between monsters when its monsters round
export const $monstersCursor = createStore<number | null>(null);
$monstersCursor.watch((cursor) => console.info("$monstersCursor:", cursor));
$monstersCursor.reset(startCharacterRound);

// set cursor to the first alive monster when round starts
sample({
  clock: startMonstersRound,
  source: $monsters,
  target: $monstersCursor,
  fn: (monsters) => {
    if (!monsters) {
      throw Error("Wrong encounter");
    }
    let cursor = 0;
    while (monsters[cursor].hp === 0) {
      cursor += 1;
    }
    return cursor;
  },
});

// event to fire when monster attacks character
// parameter - monster index in the monsters list of an encounter
const characterAttackedByMonster = createEvent<number | null>();
characterAttackedByMonster.watch((cursor) =>
  console.info("characterAttackedByMonster:", cursor),
);

// toggle even for each new value of the cursor
sample({
  clock: $monstersCursor,
  filter(cursor) {
    return cursor !== null;
  },
  target: characterAttackedByMonster,
});

// trigger monster attack calculation
sample({
  clock: characterAttackedByMonster,
  source: {
    character: $characterState,
    monsters: $monsters,
    isDefending: $isDefending,
  },
  target: monsterAttackCharacterFx,
  filter: ({ monsters }, clock) =>
    shouldCharacterBeAttackedByMonster(clock, monsters),
  fn({ character, isDefending, monsters }, clock) {
    if (!monsters) {
      throw new Error("invalid monsters state");
    }
    const monster = monsters[clock!];
    return {
      character,
      monster,
      isDefending,
    };
  },
});

// set animation state to result of an attack
$characterHitResult.on(monsterAttackCharacterFx.doneData, (damage) => damage);
$characterHitResult.on(monsterAttackCharacterFx.fail, () => null);

// pause between different monster attacks
export const monsterAttackTransitionFx = createEffect(delay);

// trigger delay transition when monster was skipped
sample({
  clock: characterAttackedByMonster,
  source: { character: $character, monsters: $monsters },
  target: monsterAttackTransitionFx,
  filter: ({ monsters }, cursor) => {
    console.log("characterAttackedByMonster monster skip check", cursor);
    if (cursor === null) {
      return false;
    }
    if (!monsters) {
      return false;
    }
    return !shouldCharacterBeAttackedByMonster(cursor, monsters);
  },
});

// update character state after successfull attack
sample({
  clock: monsterAttackCharacterFx.doneData,
  target: characterHpChanged,
});

// monster attack completed - start transition to next monster
sample({
  clock: monsterAttackCharacterFx.finally,
  target: monsterAttackTransitionFx,
});

// switch to next monster if any
sample({
  clock: monsterAttackTransitionFx.done,
  target: $monstersCursor,
  source: {
    index: $monstersCursor,
    length: $monstersLength,
    characterIsDead: $characterIsDead,
    monsters: $monsters,
  },
  fn: ({ index, length, characterIsDead, monsters }) => {
    if (!monsters) {
      throw new Error("invalid monsters state");
    }
    // check if round ended
    const check = index !== null && index < length - 1 && !characterIsDead;
    if (!check) {
      console.log("round ended");
      // set cursor to null if last alive monster
      return null;
    }
    let cursor = null;
    // find next alive and angry monster
    for (let i = index + 1; i < monsters.length; i++) {
      const monster = monsters[i];
      if (monster.aggro !== EAggroMode.Angry || monster.hp === 0) {
        continue;
      }
      cursor = i;
      break;
    }
    // if no alive monsters left set cursor to null
    return cursor;
  },
});

// reset hit result animation
$characterHitResult.reset(monsterAttackTransitionFx.done);

sample({
  clock: monsterAttackTransitionFx.finally,
  target: monsterToCharacterTransition,
  source: { index: $monstersCursor, length: $monstersLength },
  filter: (src) => {
    const { index } = src;
    // if cursor is reset to null - monster phase is finished
    const monstersAttackFinished = index === null;
    console.log("monstersAttackFinished", monstersAttackFinished);
    return monstersAttackFinished;
  },
});

// Step 10. detect if character managed to flee when monsters round is finished

// trigger monster to character transition effect when round triggered
sample({
  clock: monsterToCharacterTransitionFx.finally,
  source: {
    character: $characterState,
    isFleeing: $isFleeing,
    stats: $characterStats,
  },
  target: characterFleeDetectionFx,
});

// start new character round when transition successfull
sample({
  clock: characterFleeDetectionFx.done,
  target: startCharacterRound,
});

// find appropriate cell and redirect to dungeon when transition failed
sample({
  clock: characterFleeDetectionFx.fail,
  source: { dungeon: $dungeonLevelMap },
  target: characterFledFx,
});

sample({
  clock: characterFledFx.doneData,
  target: moveCharacter,
});

sample({
  clock: characterFledFx.finally,
  target: forward,
  fn: () => "dungeon",
});

// Step 11. wait for resurrect
export const waitForRescueTeam = createEvent();
sample({
  clock: waitForRescueTeam,
  source: $currentLevel,
  target: characterResurrected,
});
