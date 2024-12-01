import { Code, FileJson, Send, Zap } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


export default function ApiDocumentation({ host }: { host: string }) {
  const BASE_URL = host;

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-4xl font-bold mb-4">API Documentation</h1>
      
      <Accordion collapsible className="w-full" type="single">
        <AccordionItem value="endpoints">
          <AccordionTrigger>Endpoints</AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-4">
              {[
                { title: "/v1/run", icon: Send, description: "Run a query and get generated text with retrieved passages" },
                { title: "/v1/retrieve", icon: FileJson, description: "Retrieve documents based on a specified query" },
                { title: "/v1/stream", icon: Zap, description: "Stream generated text with retrieved passages" },
                { title: "/version", icon: Code, description: "Get the API version" },
              ].map((endpoint, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <endpoint.icon className="h-5 w-5" />
                      {endpoint.title}
                    </CardTitle>
                    <CardDescription>{endpoint.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Tabs className="w-full" defaultValue="run">
        <TabsList>
          <TabsTrigger value="run">/v1/run</TabsTrigger>
          <TabsTrigger value="retrieve">/v1/retrieve</TabsTrigger>
          <TabsTrigger value="stream">/v1/stream</TabsTrigger>
          <TabsTrigger value="version">/version</TabsTrigger>
        </TabsList>
        <TabsContent value="run">
          <Card>
            <CardHeader>
              <CardTitle>POST /v1/run</CardTitle>
              <CardDescription>Run a query and get generated text with retrieved passages</CardDescription>
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-semibold mb-2">Request Body</h3>
              <pre className="bg-gray-100 p-4 rounded-md">
{`{
  "query": "string",
  "result_column": "string" (optional)
}`}
              </pre>
              <h3 className="text-lg font-semibold mt-4 mb-2">Response (200 OK)</h3>
              <pre className="bg-gray-100 p-4 rounded-md">
{`{
  "result": "string or array of strings",
  "retrieved_passage": [
    {
      "content": "string",
      "doc_id": "string",
      "filepath": "string or null",
      "file_page": "integer or null",
      "start_idx": "integer or null",
      "end_idx": "integer or null"
    }
  ]
}`}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="retrieve">
          <Card>
            <CardHeader>
              <CardTitle>POST /v1/retrieve</CardTitle>
              <CardDescription>Retrieve documents based on a specified query</CardDescription>
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-semibold mb-2">Request Body</h3>
              <pre className="bg-gray-100 p-4 rounded-md">
{`{
  "query": "string"
}`}
              </pre>
              <h3 className="text-lg font-semibold mt-4 mb-2">Response (200 OK)</h3>
              <pre className="bg-gray-100 p-4 rounded-md">
{`{
  "passages": [
    {
      "doc_id": "string",
      "content": "string",
      "score": "number"
    }
  ]
}`}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="stream">
          <Card>
            <CardHeader>
              <CardTitle>POST /v1/stream</CardTitle>
              <CardDescription>Stream generated text with retrieved passages</CardDescription>
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-semibold mb-2">Request Body</h3>
              <pre className="bg-gray-100 p-4 rounded-md">
{`{
  "query": "string",
  "result_column": "string" (optional)
}`}
              </pre>
              <h3 className="text-lg font-semibold mt-4 mb-2">Response (200 OK)</h3>
              <p>Content-Type: text/event-stream</p>
              <SyntaxHighlighter className="rounded-md overflow-x-auto" language="json" style={coy}>
{`{
  "type": "generated_text or retrieved_passage",
  "generated_text": "string",
  "retrieved_passage": {
    "content": "string",
    "doc_id": "string",
    "filepath": "string or null",
    "file_page": "integer or null",
    "start_idx": "integer or null",
    "end_idx": "integer or null"
  },
  "passage_index": "integer"
}`}
              </SyntaxHighlighter>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="version">
          <Card>
            <CardHeader>
              <CardTitle>GET /version</CardTitle>
              <CardDescription>Get the API version</CardDescription>
            </CardHeader>
            <CardContent>
              <h3 className="text-lg font-semibold mt-4 mb-2">Response (200 OK)</h3>
              <pre className="bg-gray-100 p-4 rounded-md">
{`{
  "version": "string"
}`}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>API Client Usage Example</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="python">
            <TabsList>
              <TabsTrigger value="python">Python</TabsTrigger>
              <TabsTrigger value="curl">cURL</TabsTrigger>
            </TabsList>
            <TabsContent value="python">
            <SyntaxHighlighter className="rounded-md overflow-x-auto" language="python" style={coy}>
{`import requests
from autorag.utils.util import decode_multiple_json_from_bytes

BASE_URL = "${host}"

def run_query(query, result_column="generated_texts"):
    url = f"{BASE_URL}/v1/run"
    payload = {
        "query": query,
        "result_column": result_column
    }
    response = requests.post(url, json=payload)
    if response.status_code == 200:
        return response.json()
    else:
        response.raise_for_status()

def stream_query(query, result_column="generated_texts"):
    url = f"{BASE_URL}/v1/stream"
    payload = {
        "query": query,
        "result_column": result_column
    }
    with requests.Session() as session:
        response = session.post(url, json=payload, stream=True)
        retrieved_passages = []
        if response.status_code == 200:
            for chunk in response.iter_content(chunk_size=None):
                if chunk:
                    data_list = decode_multiple_json_from_bytes(chunk)
                    for data in data_list:
                        if data["type"] == "retrieved_passage":
                            retrieved_passages.append(data["retrieved_passage"])
                        else:
                            print(data["generated_text"], end="")
        else:
            print(f"Request failed: {response.status_code}")
            print(f"Response: {response.text}")

def get_version():
    url = f"{BASE_URL}/version"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        response.raise_for_status()

# Example usage
if __name__ == "__main__":
    result = run_query("example query")
    print("Run Query Result:", result)

    print("Stream Query Result:")
    stream_query("example query")

    version = get_version()
    print("API Version:", version)`}
              </SyntaxHighlighter>
            </TabsContent>
            <TabsContent value="curl">
            <SyntaxHighlighter className="rounded-md overflow-x-auto" language="bash" style={coy}>
{`# /v1/run (POST)
curl -X POST "${BASE_URL}/v1/run" \\
     -H "Content-Type: application/json" \\
     -d '{"query": "example query", "result_column": "generated_texts"}'

# /v1/stream (POST)
curl -X POST "${BASE_URL}/v1/stream" \\
     -H "Content-Type: application/json" \\
     -d '{"query": "example query", "result_column": "generated_texts"}' \\
     --no-buffer

# /version (GET)
curl -X GET "${BASE_URL}/version"`}
              </SyntaxHighlighter>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

