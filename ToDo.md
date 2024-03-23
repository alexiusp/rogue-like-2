# Ideas to be implemented (unsorted):

- Name generator (for character and guild masters)
- character avatar selection
  - improve save slots to include avatar as menu item icon
- Buffers or hotkeys - panel with quick access to spells/items
- refactor battle to propagate dealt damage as event payload to properly display it
- magic/spells: need to design how to structure the data in a best way
  - use of spells in battle/encounter
  - use of spells in dungeon
  - instant spells / lasting charms
  - check if monster is dead after spells do their effect
  - cursed items
- encounters:
  - monster: generate optional chest
  - monster: switch image of dead monster to skull or grave on battle screen
  - map: differentiate between tiles with alive monsters and dead monsters (finished encounter)
  - monster: badges for spells/effect - depends on magic and monster special attacks implementation
  - monster: size for monster - depends on character races (trolls and halflings) implementation
  - monster generate different monsters in one group (rules to combine them? by type?)
  - lair
  - event: picture, text, actions with stat to do a check roll, consequenses as items, gold, xp, spells cast on character, monster ambush
- other terrains and effects
  - multiple effects on same tile
- guild log - list of "events" happened with guild members, initialized with guild master takes the position
- global quest (story) - need to design how and when it should be triggered
- tavern quests (should be similar to quests from the guild)
- tavern gossips: after drinking/eating at tavern bartender tells player about some possible profitable item/monster and its approximate location
- item use in battle/dungeon/city - depends on spells implementation
- special animation for hits with 0 damage
- multiple attacks (swings) handling
- AoE attacks/spells in battle
- charming of monsters
- add more races: dwarf, ork, troll, lizardmen etc.
- bank items storage (stash)
- create character form validation
- character stats generation must be greedy + free points validation
- add more item types (see TItemKind)
- guild masters list save on update instead of manual saving
- guild level titles for character
- items that modifies character stats -> related calculations, guild joining must not be affected
- items: ingredients (alchemy, crafting etc.)
- leveling: generate guild quest - depends on quest implementation
- Mage tower: part of main quest, collect lore scrolls and books, uncurses items

# Bugs to fix:

- when selling an item with other identical items in inventory first item in list will be sold instead of selected one
- when identifying items it is possible to have a "-x" amount of money after that - need to disable button if not enough money
- respawn counter does not increase for levels other than current

# Next tasks (sorted):

- chests: opened, locked, magically locked
