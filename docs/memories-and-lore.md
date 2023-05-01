# Memories and Lore
If you have summaries enabled in your character settings, then your character will automatically start to create "memories" once the thread/convo gets long enough. Before each reply your character will search its memories for anything that might be relevant to the reply that it's about the write.

You can see the "search queries" that were used by your character when generating a message by tapping the brain icon that appears when you hover your mouse over a message (or when tap the message on mobile).

You can type `/mem` in the chat to open the memory editor for that thread/convo so that you can edit/add/remove memories.

**Lore** is similar to memories, except that they're not chronological. You can open the lore editor for a thread by typing `/lore`. This is where you can edit lore that's specific to just that particular thread. If you want to add lore to your *character* (so all new threads that you create using that character will "inherit" that lore), then you can open the advanced character editor, click advanced options, and scroll down to the "lorebook URLs" input, and paste a URL to your lorebook text file. The text file should just be a list of lore entries with blank lines in between each one. You can use a service like [gist.github.com](https://gist.github.com) or [renty.org](https://rentry.org/) to create hosted text files. Here's an example lorebook text file with 3 lore entries:
```
There are three concentric walls: Wall Maria, Wall Rose, and Wall Sina, which protect humanity from giant humanoid creatures called Titans.

The Survey Corps is a military branch dedicated to exploring the world outside the Walls and combating the Titans.

ODM gear, or Omni-Directional Mobility gear, is a piece of equipment used by the military to maneuver in three dimensions, allowing them to fly through the air during combat with Titans.
```
Here's an example lorebook URL for those entries: https://rentry.org/h9pb4/raw

You should think of lore like "**dynamic reminders**". They're like the reminder message, except that they only get loaded in when they're relevant to the current situation. This is good if you have lots of stuff that you want your character to know/remember - because you likely won't be able to fit it all in the instruction/reminder without using up a lot of precious 'context' tokens.

### Important
 * You can have as much lore/memories as you want - e.g. you could have thousands of entries, and it wouldn't cost any more than if you had 10 entries. The price does **not** increase as you add more lore/memories.
 * If you make an update to your character's lorebook URLs, then existing threads won't automatically get the update. You have to type `/lore`, and then show the hidden options and click the reload button to pull in the updated lore entries.
