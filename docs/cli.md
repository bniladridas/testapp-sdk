# CLI Tool

The CLI tool provides a powerful command-line interface for interacting with the AI, featuring conversation memory, interactive mode, and built-in commands.

## Usage

### Single Query Mode

```bash
npm run cli "Your question here"
```

### Interactive Mode

```bash
npm run cli -- --interactive
```

### Additional Options

```bash
npm run cli --help                    # Show help information
npm run cli "prompt" --json           # Output in JSON format
npm run cli --interactive --verbose   # Enable verbose output
```

## Features

### 🤖 AI-Powered Responses

- Uses Google's Gemini AI for intelligent responses
- Supports natural language queries on any topic
- Provides detailed, contextual answers

### 💬 Interactive Mode

- Continuous conversation with context awareness
- Remembers previous messages within the session
- Persistent history across CLI restarts

### 🧠 Memory & Persistence

- **Conversation Memory**: AI remembers the entire conversation history
- **Persistent Storage**: History saved to `cli/history/history.json`
- **Cross-Session Continuity**: Conversations persist between CLI runs
- **Context-Aware Responses**: AI uses full conversation context

### 🛠️ Built-in Commands (Interactive Mode Only)

- `/help` - Show available commands
- `/history` - Display conversation history
- `/clear` - Clear conversation history and reset memory
- `/exit` or `/quit` - Exit the CLI

### ⚙️ Advanced Options

- **JSON Output**: `--json` flag for programmatic use
- **Verbose Mode**: `--verbose` for detailed response information
- **Error Handling**: Automatic retries and graceful error messages
- **Rate Limiting**: Built-in handling for API limits

## Memory Storage Details

### How Memory Works

The CLI stores conversation history as JSON data for persistent, context-aware conversations:

```json
[
  { "role": "user", "text": "Hello" },
  { "role": "model", "text": "Hi there!" },
  { "role": "user", "text": "What's the weather?" },
  {
    "role": "model",
    "text": "I don't have access to real-time weather data..."
  }
]
```

### Storage Process

1. **Load**: History loaded from `~/.config/testapp-cli/history.json` on startup
2. **Update**: Each user input and AI response added to memory
3. **Save**: History automatically saved after each AI response
4. **Context**: Full history passed to AI for contextual responses
5. **Persistence**: History persists across different project clones and sessions

### Memory Commands

- View history: `/history`
- Clear memory: `/clear`
- History persists automatically across sessions

## Examples

### Basic Queries

```bash
npm run cli "What is the capital of France?"
npm run cli "Explain quantum computing" --verbose
npm run cli "Generate a React component" --json
```

### Interactive Session

```bash
npm run cli -- --interactive
AI> Hello
[AI responds with greeting]
AI> What did I just ask?
[AI remembers: "You asked 'Hello'"]
AI> /history
1. user: Hello
2. model: Hi there! How can I help you today?
3. user: What did I just ask?
4. model: You asked "Hello"
AI> /clear
History cleared.
AI> /exit
Goodbye!
```

### Error Handling

```bash
npm run cli "test query"
# Shows spinner, handles network/API errors gracefully
# Retries automatically on temporary failures
```

## Requirements

- Node.js 20+
- GEMINI_API_KEY environment variable
- Internet connection for AI responses

## Implementation

The CLI uses the same AI backend as the web app, providing consistent responses across platforms. Built with modular architecture for maintainability:

- `cli/index.js` - Main entry point and argument parsing
- `cli/commands/interactive.js` - Interactive mode with memory management
- `cli/commands/process-query.js` - AI query processing and error handling
- `cli/history/index.js` - Persistent conversation storage

## Architecture

```
cli/
├── index.js                    # CLI entry point
├── commands/
│   ├── interactive.js         # Interactive mode logic
│   └── process-query.js       # Query processing
├── history/
│   ├── index.js               # History persistence
│   └── history.json           # Stored conversations
```

The modular design ensures clean separation of concerns and easy maintenance.
