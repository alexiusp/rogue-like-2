# Ideas to be implemented (unsorted):

- Name generator (for character and guild masters)
- character avatar selection
  - improve save slots to include avatar as menu item icon
- Buffers or hotkeys - panel with quick access to spells/items
- Messages buffer - to describe events or battle log to use
- refactor battle to propagate dealt damage as event payload to properly display it
- magic/spells: need to design how to structure the data in a best way
  - use of spells in battle/encounter
  - use of spells in dungeon
  - instant spells / lasting charms
  - check if monster is dead after spells do their effect
  - cursed items
- encounters:
  - monster: generate more than one monster, generate optional chest
  - monster: switch image of dead monster to skull or grave
  - monster: badges for spells/effect
  - chests: opened, locked, magically locked
  - lair
  - event: picture, text, actions with stat to do a check roll, consequenses as items, gold, xp, spells cast on character
- other terrains and effects
  - multiple effects on same tile
- guild log - list of "events" happened with guild members, initialized with guild master takes the position
- global quest (story) - need to design how and when it should be triggered
- tavern quests (should be similar to quests from the guild)
- tavern gossips: after drinking/eating at tavern bartender tells player about some possible profitable item/monster and its approximate location
- item use in battle/dungeon/city
- special animation for hits with 0 damage
- multiple attacks (swings) handling
- AoE attacks/spells in battle
- charming of monsters
- health badge/progress color change and/or animation when health is low/critical
- add more races: dwarf, ork, troll, lizardmen etc.
- bank items storage (stash)
- create character form validation
- character stats generation must be greedy + free points validation
- add more item types (see TItemKind)
- guild masters list save on update instead of manual saving
- guild level titles for character
- items that modifies character stats -> related calculations, guild joining must not be affected
- items: ingredients (alchemy, crafting etc.)

# Bugs to fix:

- when selling an item with other identical items in inventory first item in list will be sold instead of selected one
- "pinned" state must start 1xp before second level, not right after reaching the current one

# Next tasks (sorted):

- add two more monsters and items
- leveling - hp/mp increase, attack/defense bonuses etc.
- skill modifiers for attack/defense (depending on guild levels)
- aggro check roll when entering encounter
- time/move counter (for each tile) when player is in dungeon to respawn/regenerate dungeon tiles after timeout (before character enters is again? or in realtime)
