'use client';

import { useState, useEffect } from 'react';
import { Eye, EyeOff, Trash2 } from 'lucide-react'; // Assuming you're using lucide-react for icons
import { Dictionary } from 'apache-arrow';
import toast from 'react-hot-toast';

import { APIClient } from '@/lib/api-client';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/table';




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
        // When apiKeyName is empty, don't submit
        if (apiKeyName === '') {
            toast.error("API Key Name is required", {
                position: "top-center",
                duration: 3000,
            });

            return;
        }
        // When apiKeyValue is empty, don't submit
        if (apiKeyValue === '') {
            toast.error("API Key Value is required", {
                position: "top-center",
                duration: 3000,
            });
            
            return;
        }
    
      await apiClient.setEnv({
        key: apiKeyName,
        value: apiKeyValue,
      });
      toast.success("API Key Added", {
        position: "top-center",
        duration: 3000,
      });
      // Fetch updated list instead of manually updating state
      await fetchEnvVars();
      setApiKeyName('');
      setApiKeyValue('');
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

      toast.success("API Key Deleted", {
        position: "top-center",
        duration: 1500,
      });
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
        <Table aria-label="Environment variables table">
          <TableHeader>
            <TableColumn className="w-[150px] text-left">KEY</TableColumn>
            <TableColumn className="w-[300px]">VALUE</TableColumn>
            <TableColumn className="w-[80px] text-right">REVEAL</TableColumn>
            <TableColumn className="w-[80px] text-right">DELETE</TableColumn>
          </TableHeader>
          <TableBody>
            {Object.entries(envVars).map(([key, value]) => (
              <TableRow key={key}>
                <TableCell>
                  <p className="font-medium">{key}</p>
                </TableCell>
                <TableCell>
                  <p className="font-mono text-sm whitespace-pre-wrap break-all">
                    {revealedKeys[key] ? String(value) : '••••••••'}
                  </p>
                </TableCell>
                <TableCell className="text-right">
                  <button
                    className="p-1 hover:bg-gray-100 rounded-md"
                    onClick={() => handleReveal(key)}
                  >
                    {revealedKeys[key] ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </TableCell>
                <TableCell className="text-right">
                  <button
                    className="p-1 hover:bg-gray-100 rounded-md text-red-500"
                    onClick={() => handleDelete(key)}
                  >
                    <Trash2 size={14} />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
