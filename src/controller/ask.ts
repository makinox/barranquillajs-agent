export const postAsk = async (message: string): Promise<string | undefined> => {
  try {
    const response = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    const result = await response.json();
    return result?.message
  } catch (error) {
    console.error(error)
    return undefined
  }
}