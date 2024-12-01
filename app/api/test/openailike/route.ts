import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { api_key, base_api } = await request.json();

    const response = await fetch(`${base_api}/v1/chat/completions`, {
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

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to test OpenAI connection: ${response.statusText}`, status: "error" },
        { status: response.status }
      );
    }

    return NextResponse.json({ status: "success" });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to test OpenAI connection: ${error}`, status: "error" },
      { status: 400 }
    );
  }
}
