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
    }
};
