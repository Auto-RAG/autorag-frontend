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

  const handleSubmit = async () => {
    try {
      await apiClient.setEnv({
        key: apiKeyName,
        value: apiKeyValue,
      });
      // Reset form and refresh list
      setApiKeyName('');
      setApiKeyValue('');
      fetchEnvVars();
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
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Environment Variables</h2>
        <div className="border rounded-md divide-y">
          {Object.entries(envVars).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-4">
              <div className="flex-1">
                <p className="font-medium">{key}</p>
                <p className="font-mono text-sm">
                  {revealedKeys[key] ? String(value) : '••••••••'}
                </p>
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
