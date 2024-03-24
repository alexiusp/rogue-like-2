# Ideas to be implemented (unsorted):

- character
  - Name generator (for character and guild masters)
  - character avatar selection
  - improve save slots to include avatar as menu item icon
  - create character form validation
  - add more races: dwarf, ork, troll, lizardmen etc.
  - character stats generation must be greedy + free points validation
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
  - monster: switch image of dead monster to skull or grave on battle screen
  - map: differentiate between tiles with alive monsters and dead monsters (finished encounter)
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
  - guild skills must be generated for levels by function to avoid creating them for every possible character level
  - leveling: generate guild quest - depends on quest implementation
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

# Bugs to fix:

- respawn counter does not increase for levels other than current

# Next tasks (sorted):

- bank items storage (stash)
- chests: opened, locked, magically locked
