import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { api_key } = await request.json();

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${api_key}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant.'
          },
          {
            role: 'user',
            content: 'Hello!'
          }
        ]
      })
    });

    await response.json();

    return NextResponse.json({ status: "success" });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to test OpenAI connection: ${error}`, status: "error" },
      { status: 400 }
    );
  }
}
