import React, { useState } from 'react';
import { Dialog } from '@radix-ui/react-dialog';
import { ChevronDown, ChevronRight, Copy, Maximize2, X } from 'lucide-react';
import DocumentViewer from './document-viewer';

interface ParsedData {
  patient_name: string;
  patient_age: string;
  patient_pid: number;
  lab_results: Array<{
    investigation: string;
    result: number | string;
    reference_value: string;
    unit: string;
  }>;
}

const DocumentParserInterface: React.FC<{ file?: string }> = ({ file = '/sample.pdf' }) => {
  const [showFullScreen, setShowFullScreen] = useState<'document' | 'json' | null>(null);
  const [query, setQuery] = useState('');
  const [sparrowKey, setSparrowKey] = useState('');

  const handleSubmitQuery = () => {
    // Query 처리 로직 구현
    console.log('Executing query:', query);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="h-screen bg-gray-100 p-4">
      <div className="grid grid-cols-2 gap-4 h-[60vh]">
        {/* Original Document View */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
          <div className="p-3 bg-gray-50 border-b flex justify-between items-center">
            <h2 className="font-semibold">Input Document Image</h2>
            <button 
              onClick={() => setShowFullScreen('document')}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <Maximize2 size={16} />
            </button>
          </div>
          <div className="flex-1 overflow-auto p-4">
          <DocumentViewer file={file} />
          </div>
        </div>

        {/* Parsed JSON View */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
          <div className="p-3 bg-gray-50 border-b flex justify-between items-center">
            <h2 className="font-semibold">Response (JSON)</h2>
            <div className="flex gap-2">
              <button 
                onClick={() => copyToClipboard(JSON.stringify(parsedData, null, 2))}
                className="p-1 hover:bg-gray-200 rounded"
              >
                <Copy size={16} />
              </button>
              <button 
                onClick={() => setShowFullScreen('json')}
                className="p-1 hover:bg-gray-200 rounded"
              >
                <Maximize2 size={16} />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <JsonView data={parsedData} />
          </div>
        </div>
      </div>

      {/* Query Interface */}
      <div className="mt-4 bg-white rounded-lg shadow-lg p-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Query
            </label>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-24 p-3 border rounded-md font-mono text-sm"
              placeholder={'{"patient_name": "example", "patient_age": "example"...'}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sparrow Key
            </label>
            <input
              type="text"
              value={sparrowKey}
              onChange={(e) => setSparrowKey(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <button
            onClick={handleSubmitQuery}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </div>

      {/* Fullscreen Dialog */}
      {showFullScreen && (
        <Dialog open onOpenChange={() => setShowFullScreen(null)}>
          <div className="fixed inset-0 bg-black/50 z-50">
            <div className="fixed inset-4 bg-white rounded-lg flex flex-col">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="font-semibold">
                  {showFullScreen === 'document' ? 'Document View' : 'JSON View'}
                </h2>
                <button 
                  onClick={() => setShowFullScreen(null)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="flex-1 overflow-auto p-4">
                {showFullScreen === 'document' ? (
                  <img 
                    src="/api/placeholder/800/1000"
                    alt="Original Document" 
                    className="w-full h-auto"
                  />
                ) : (
                  <JsonView data={parsedData} />
                )}
              </div>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};

// JSON Tree View 컴포넌트
const JsonView: React.FC<{ data: any }> = ({ data }) => {
  const renderValue = (value: any, path: string, key?: string) => {
    if (value === null) return <span className="text-gray-500">null</span>;
    if (typeof value === 'boolean') return <span className="text-blue-600">{value.toString()}</span>;
    if (typeof value === 'number') return <span className="text-blue-600">{value}</span>;
    if (typeof value === 'string') return <span className="text-green-600">"{value}"</span>;
    
    const isArray = Array.isArray(value);
    
    return (
      <div>
        <div className="flex items-center gap-1">
          {key && <span className="text-purple-600">"{key}"</span>}
          <span>{isArray ? '[' : '{'}</span>
        </div>
        
        <div className="ml-4 border-l pl-2">
          {isArray ? (
            value.map((item: any, index: number) => (
              <div key={index} className="flex items-start gap-1">
                <span className="text-gray-500">{index}:</span>
                {renderValue(item, `${path}.${index}`)}
                {index < value.length - 1 && <span>,</span>}
              </div>
            ))
          ) : (
            Object.entries(value).map(([k, v], index, arr) => (
              <div key={k} className="flex items-start gap-1">
                {renderValue(v, `${path}.${k}`, k)}
                {index < arr.length - 1 && <span>,</span>}
              </div>
            ))
          )}
        </div>
        <div>{isArray ? ']' : '}'}</div>
      </div>
    );
  };

  return (
    <div className="font-mono text-sm p-4">
      {renderValue(data, 'root')}
    </div>
  );
};

// 샘플 데이터
const parsedData: ParsedData = {
  "patient_name": "Yash M. Patel",
  "patient_age": "21 Years",
  "patient_pid": 555,
  "lab_results": [
    {
      "investigation": "Hemoglobin (Hb)",
      "result": 12.5,
      "reference_value": "13.0 - 17.0",
      "unit": "g/dL"
    },
    {
      "investigation": "RBC COUNT",
      "result": 5.2,
      "reference_value": "4.5 - 5.5",
      "unit": "mill/cumm"
    }
    // ... 추가 결과들
  ]
};

export default DocumentParserInterface;
