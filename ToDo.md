# Ideas to be implemented (unsorted):

- character:
  - Name generator (for character and guild masters)
  - improve save slots to include avatar as menu item icon?
  - add more races: dwarf, ork, troll, lizardmen etc.
  - alignment limitations for certain races (orks - only evil etc.)
  - alignment limitations for certain guilds (thieves only neutral, paladin only good etc.)
  - create character form validation
  - reordering/sorting of items in the inventory
- magic/spells:
  - use of spells in the city?
  - magically locked chests
  - tile reveal spell
  - teleportation in dungeon
  - cursed items: without negative stats, but unable to unequip
  - charming of monsters
- encounters:
  - refactor battle to propagate dealt damage as event payload to properly display it
  - monster: badges for spells/effect - depends on magic and monster special attacks implementation
  - lair
  - monster: size for monster - depends on character races (trolls and halflings) implementation
  - special animation for hits with 0 damage?
  - monster: generate different monsters in one group (rules to combine them? by type?)
  - event: picture, text, actions with stat to do a check roll, consequenses as items, gold, xp, spells cast on character, monster ambush
- dungeon:
  - effects of terrain and effects in battle and display on UI
  - multiple effects on same tile?
  - new terrain type: stone - unpassable tile, teleporting to which means death
- guilds:
  - guild log - list of "events" happened with guild members, initialized with guild master takes the position
  - guild masters list save on update instead of manual saving
  - guild level titles for character
  - leveling: generate guild quest - depends on quest implementation
  - all skills must work at proper moments (todo when magic, chests, monster special attacts etc. are implemented)
- quests:
  - global quest (story) - need to design how and when it should be triggered
  - tavern quests (should be similar to quests from the guild)
  - guild quests
- tavern:
  - gossips: after drinking/eating at tavern bartender tells player about some possible profitable item/monster and its approximate location
  - resting: restore health/mana by resting (age increase)
- multiple attacks (swings) handling
- AoE attacks/spells in battle
- add more item types (see TItemKind)
- items that modifies character stats -> related calculations, guild joining must not be affected
- items: ingredients (alchemy, crafting etc.)
- Mage tower: part of main quest, alchemy, collect lore scrolls and books, uncurses items
- dungeon:
  - respawn only encounters, not terrains and effects?
  - unfinished encounters (alive monsters, closed chests) - should they respawn?
  - global events when everything respawns including terrain and effects (after implementing quest since it must be a part of the story)
  - split dungeon map and open/respawnCounter state to enable sharing the dungeon map between characters
  - an environmental message describing current part of the dungeon to improve UX
- keyboard support for movement in dungeons and buffers/hotkeys (probably also actions, like toggle items/spells/buffers)
- monsters exquisit for the lore of the game
- corruptions (like in ADoM) - negative effects on deeper levels of the dungeon - may be instead of cursed items?
- chests: mimics -> when character tries to open chest its transformed to monster and attacks
- Runes and rune-words integrated into lore and used for naming of scrolls/artefacts etc.

# Known bugs to fix:

- spell distribution by guilds must be generated from parameters, not hardcoded as an array
- xp needed to level up must be generated from parameters, not hardcoded as an array
- save slot label must be updated on guild change (in future also on title change?)

# Next tasks (sorted):

- refactor character state to be more granular (split parts of the character state into separate states)
- spells/magic
  - monsters affected by effects: implement spell with timeout and implement/test effects on monsters
  - items improving characters stats (books, potions etc.)
  - monster special attacks
- Buffers or hotkeys - panel with quick access to spells/items
- chests: traps
- falling into a pit handling
- add water living monster to test how battle on water tile going
