import { promises as fs } from 'fs';
import path from 'path';

import yaml from 'js-yaml';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ yamlName: string}>}
) {
    const yamlName = (await params).yamlName;
    
    try {
        const fullPath = path.join(process.cwd(), 'sample_configs', `${yamlName}.yaml`);
        const fileContents = await fs.readFile(fullPath, 'utf8');

        return NextResponse.json({ raw_content: fileContents, content: yaml.load(fileContents), target_env_keys: getTargetEnvKeys(yamlName) });
    } catch (error) {
        return NextResponse.json({ error: `Failed to read file: ${error}` }, { status: 500 });
    }
}

const getTargetEnvKeys = (yamlName: string) => {
    if (yamlName.includes("all")) {
        return ["OPENAI_API_KEY", "COHERE_API_KEY", "JINAAI_API_KEY", "MXBAI_API_KEY", "VOYAGE_API_KEY"];
    } else if (yamlName.includes("only_api")) {
        return ["OPENAI_API_KEY"];
    } else if ((yamlName.includes("cheap") || yamlName.includes("expensive")) && yamlName.includes("ko")) {
        return ["OPENAI_API_KEY", "COHERE_API_KEY"];
    } else if ((yamlName.includes("cheap") || yamlName.includes("expensive")) && yamlName.includes("en")) {
        return ["OPENAI_API_KEY", "COHERE_API_KEY", "JINAAI_API_KEY", "MXBAI_API_KEY", "VOYAGE_API_KEY"];
    }
    else {
        return [];
    }
}
