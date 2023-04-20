This will be more organised at some point, but for now it's just going to be a list of questions I've answered on the Discord server.

## Memories

* **Question**: What should I put in memories, vs instruction message, vs reminder?
  * As a general guide: If you have lots of random things you want the GM to know that are only relevant in specific contexts, then use `/mem` to store them. You can treat memories like lorebook entries. If you have things that are relevant all the time, put them in the role/instruction. If you have things that are really important all the time, and that the AI needs a strong reminder about, put it in the reminder.

* **Question**: "I am trying to understand the concept of memories. So, since memories go back very far, how do the memories make it into the context? I mean which memories make it into the context and where do they end up in the context?"
  * The character "recalls" memories based on their "semantic similarity" to the current context
  * "Semantic similarity" basically means memories that have similar concepts in them to the concepts currently being discussed in the latest messages
  * The memories are placed just after the summary - at the top of the message list that is sent to the AI
  * It goes (roleInstruction + summaryOfOldMessages + memories + messages + reminderMessage) --> bot's response
  * Note this answer assumes that you have summaries and memories enabled in the character settings

* **Question:** How does infinite memory *actually work*?
  * Basically, the AI extracts "memories" (facts, events, etc.) from batches of messages, and then stores them in a database. Then, every time the AI is about to respond to a message, it generates some search queries for memories that it things will be relevant. Those queries are used to search the database, any relevant memories are added to the context (after the summary, and before all the messages).
  * (Note for technical audience: A text embedding model is used, rather than simple keyword search queries)
