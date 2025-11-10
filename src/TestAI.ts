// Fetch to the backend for AI responses
export async function askTestAI(userInput: string): Promise<string> {
  try {
    const res = await fetch('/api/ask-test-ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userInput }),
    });
    const data = await res.json();
    if (data.text) return data.text;
    return data.error || 'Unknown error from Test AI backend.';
  } catch (error: unknown) {
    // For network errors, check if it's a rate limit or overload
    if (
      error instanceof Error &&
      error.message?.includes('Too many requests')
    ) {
      return "I'm getting a lot of questions right now. How's your day going? 😊";
    }
    return 'Error: Could not connect to Test AI backend.';
  }
}
