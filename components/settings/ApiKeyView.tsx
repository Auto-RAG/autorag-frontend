'use client';

import { useState, useEffect } from 'react';
import { Eye, EyeOff, Trash2 } from 'lucide-react'; // Assuming you're using lucide-react for icons
import { Dictionary } from 'apache-arrow';

import { APIClient } from '@/lib/api-client';




export default function ApiKeyView() {
  const [apiKeyName, setApiKeyName] = useState('');
  const [apiKeyValue, setApiKeyValue] = useState('');
  const [envVars, setEnvVars] = useState<Dictionary[]>([]);
  const [revealedKeys, setRevealedKeys] = useState<Record<string, boolean>>({});
  const apiClient = new APIClient(process.env.NEXT_PUBLIC_API_URL!, '');

  // Fetch environment variables on component mount
  useEffect(() => {
    fetchEnvVars();
  }, []);

  const fetchEnvVars = async () => {
    try {
      const vars = await apiClient.getEnvList();

      setEnvVars(vars);
    } catch (error) {
      console.error('Error fetching environment variables:', error);
    }
  };

  const handleSubmitNewApi = async () => {
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

  const handleReveal = async (key: string) => {
    try {
      setRevealedKeys(prev => ({ ...prev, [key]: !prev[key] }));
    } catch (error) {
      console.error('Error revealing environment value:', error);
    }
  };

  const handleDelete = async (key: string) => {
    try {
      await apiClient.deleteEnv(key);
      fetchEnvVars();
    } catch (error) {
      console.error('Error deleting environment variable:', error);
    }
  };

  return (
    <div className="flex flex-col gap-4">
        <div className="flex gap-4">
        <div className="flex flex-col gap-2 flex-1">
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
        <div className="flex flex-col gap-2 flex-1">
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
      </div>
      <div className="flex justify-end">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          onClick={handleSubmitNewApi}
        >
          Submit API Key
        </button>
      </div>
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Environment Variables</h2>
        <div className="border rounded-md divide-y">
          {Object.entries(envVars).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-4">
              <div className="flex-1 flex items-center gap-4">
                <p className="font-medium flex-1">{key}</p>
              <div className="flex-auto flex items-left">
                <p className="font-mono text-sm flex-1">
                  {revealedKeys[key] ? String(value) : '••••••••'}
                </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  className="p-2 hover:bg-gray-100 rounded-md"
                  onClick={() => handleReveal(key)}
                >
                  {revealedKeys[key] ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <button
                  className="p-2 hover:bg-gray-100 rounded-md text-red-500"
                  onClick={() => handleDelete(key)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>
  );
}
