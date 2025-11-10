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
  } catch {
    return 'Error: Could not connect to Test AI backend.';
  }
}
