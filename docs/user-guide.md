This will be more organised at some point, but for now it's just going to be a list of questions I've answered on the Discord server.

## Memories

* **Question**: "I am trying to understand the concept of memories. So, since memories go back very far, how do the memories make it into the context? I mean which memories make it into the context and where do they end up in the context?"
  * The character "recalls" memories based on their "semantic similarity" to the current context
  * "Semantic similarity" basically means memories that have similar concepts in them to the concepts currently being discussed in the latest messages
  * The memories are placed just after the summary - at the top of the message list that is sent to the AI
  * It goes (roleInstruction + summaryOfOldMessages + memories + messages + reminderMessage) --> bot's response
  * Note this answer assumes that you have summaries and memories enabled in the character settings
