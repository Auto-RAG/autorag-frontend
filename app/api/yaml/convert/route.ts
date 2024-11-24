import { NextResponse } from 'next/server';
import yaml from 'js-yaml';

export async function POST(request: Request) {
  try {
    const { content } = await request.json();

    const parsedYaml = yaml.load(content);

    return NextResponse.json({ data: parsedYaml });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to parse YAML: ${error}` },
      { status: 400 }
    );
  }
}
