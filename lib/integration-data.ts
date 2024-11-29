export interface IntegrationInfo {
  name: string;
  author: string;
  imagePath: string;
  description: string;
  tag: string;
}

export interface IntegrationSetup {
    setups: {
        apiKey: string;
        name: string;
        description: string;
    }[];
    onClickTest: (setups: {
        apiKey: string;
        name: string;
        description: string;
    }[]) => Record<string, any>;
}

export const integrations: Record<string, IntegrationInfo> = {
    "openai": {
        name: "OpenAI",
        author: "AutoRAG",
        imagePath: "/integrations/openai-logo.webp",
        description: "OpenAI is one of the most popular LLM & Embedding model providers.",
        tag: "LLM, Embedding"
    },
    "openailike": {
        name: "OpenAI-like",
        author: "AutoRAG",
        imagePath: "/integrations/openai-logo.webp",
        description: "You can integrate any OpenAI-like API.",
        tag: "LLM"
    }
};

export const integrationSetups: Record<string, IntegrationSetup> = {
    "openai": {
        setups: [
            {
                apiKey: "OPENAI_API_KEY",
                name: "OpenAI",
                description: "Input your OpenAI API key.",
            }
        ],
        onClickTest: async (setups: {
            apiKey: string;
            name: string;
            description: string;
        }[]) => {
            const response = await fetch("/api/test/openai", {
                method: "POST",
                body: JSON.stringify({ api_key: setups[0].apiKey }),
            });

            return await response.json();
        }
    },
    "openailike": {
        setups:[
            {
                apiKey: "OPENAI_API_KEY",
                name: "API Key",
                description: "Input your API key.",
            },{
                apiKey: "OPENAI_BASE_API",
                name: "Base API URL",
                description: "Input your base API URL.",
            }
        ],
        onClickTest: async (setups: {
            apiKey: string;
            name: string;
            description: string;
        }[]) => {
            const api_key = setups[0].apiKey;
            const base_api = setups[1].apiKey;

            const response = await fetch("/api/test/openailike", {
                method: "POST",
                body: JSON.stringify({ api_key: api_key, base_api: base_api }),
            });

            return await response.json();
        }
    }
};
