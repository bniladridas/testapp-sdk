// Remove all @google/genai usage and export askBratAI as a fetch to the backend
export async function askBratAI(userInput: string): Promise<string> {
  try {
    const res = await fetch('/api/ask-brat-ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userInput }),
    });
    const data = await res.json();
    if (data.text) return data.text;
    return data.error || 'Unknown error from Brat AI backend.';
  } catch (e: any) {
    return 'Error: Could not connect to Brat AI backend.';
  }
} 