'use client';

import { useState } from 'react';

import { APIClient } from '@/lib/api-client';


export default function ApiKeyForm() {
  const [apiKeyName, setApiKeyName] = useState('');
  const [apiKeyValue, setApiKeyValue] = useState('');
  const apiClient = new APIClient(process.env.NEXT_PUBLIC_API_URL!, '');

  const handleSubmit = async () => {
    try {
      await apiClient.setEnv({
        key: apiKeyName,
        value: apiKeyValue,
      });
      // You might want to add a success notification here
    } catch (error) {
      console.error('Error submitting Environment value:', error);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium" htmlFor="apiKeyName">
          API Key Name
        </label>
        <input
          className="border rounded-md p-2"
          id="apiKeyName"
          placeholder="Enter API key name"
          type="text"
          value={apiKeyName}
          onChange={(e) => setApiKeyName(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium" htmlFor="apiKeyValue">
          API Key Value
        </label>
        <input
          className="border rounded-md p-2"
          id="apiKeyValue" 
          placeholder="Enter API key value"
          type="password"
          value={apiKeyValue}
          onChange={(e) => setApiKeyValue(e.target.value)}
        />
      </div>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors w-fit"
        onClick={handleSubmit}
      >
        Submit API Key
      </button>
    </div>
  );
}
