# Ideas to be implemented (unsorted):

- character
  - Name generator (for character and guild masters)
  - character avatar selection
  - improve save slots to include avatar as menu item icon
  - create character form validation
  - add more races: dwarf, ork, troll, lizardmen etc.
  - character stats generation must be greedy: only minimal stats + free points validation (no reroll)
  - character screen: show permanent effects from items (invisible, see invisible etc.)
- Buffers or hotkeys - panel with quick access to spells/items
- magic/spells: need to design how to structure the data in a best way
  - use of spells in battle/encounter
  - use of spells in dungeon
  - instant spells / lasting charms
  - check if monster is dead after spells do their effect
  - cursed items
- encounters:
  - refactor battle to propagate dealt damage as event payload to properly display it
  - special animation for hits with 0 damage
  - monster: generate optional chest
  - monster: badges for spells/effect - depends on magic and monster special attacks implementation
  - monster: size for monster - depends on character races (trolls and halflings) implementation
  - monster generate different monsters in one group (rules to combine them? by type?)
  - lair
  - event: picture, text, actions with stat to do a check roll, consequenses as items, gold, xp, spells cast on character, monster ambush
- other terrains and effects
  - effect in battle
  - multiple effects on same tile
- guilds
  - guild log - list of "events" happened with guild members, initialized with guild master takes the position
  - guild masters list save on update instead of manual saving
  - guild level titles for character
  - leveling: generate guild quest - depends on quest implementation
  - all skills must work at proper moments (todo when magic, chests, monster special attacts etc. are implemented)
- quests
  - global quest (story) - need to design how and when it should be triggered
  - tavern quests (should be similar to quests from the guild)
- tavern gossips: after drinking/eating at tavern bartender tells player about some possible profitable item/monster and its approximate location
- item use in battle/dungeon/city - depends on spells implementation
- multiple attacks (swings) handling
- AoE attacks/spells in battle
- charming of monsters
- add more item types (see TItemKind)
- items that modifies character stats -> related calculations, guild joining must not be affected
- items: ingredients (alchemy, crafting etc.)
- Mage tower: part of main quest, alchemy, collect lore scrolls and books, uncurses items
- respawn: respawn only possible encounter, not terraing and effects?

# Known bugs to fix:

# Next tasks (sorted):

- chests: opened, locked, magically locked
- falling into a pit handling
