import { promises as fs } from 'fs';
import path from 'path';

import yaml from 'js-yaml';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    context: { params: { yamlName: string } }
) {
    const params = await context.params;
    const { yamlName } = params;
    
    try {
        const fullPath = path.join(process.cwd(), 'sample_configs', `${yamlName}.yaml`);
        const fileContents = await fs.readFile(fullPath, 'utf8');

        return NextResponse.json({ raw_content: fileContents, content: yaml.load(fileContents) });
    } catch (error) {
        return NextResponse.json({ error: `Failed to read file: ${error}` }, { status: 500 });
    }
}
