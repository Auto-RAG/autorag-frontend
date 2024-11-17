import React, { useState, useEffect } from 'react';
import * as arrow from "apache-arrow";
import { parseTable } from "arrow-js-ffi";
import initWasm, { wasmMemory, readParquet } from "parquet-wasm";
import { 
  Edit,           // 기본 편집 아이콘
  Edit2,          // 다른 스타일의 편집 아이콘
  Edit3,          // 또 다른 스타일의 편집 아이콘
  Pencil,         // 연필 아이콘
  PenTool,        // 펜 도구 아이콘
  RotateCw,       // 회전 아이콘
} from 'lucide-react';

const vectorToStringList = (vector: any): string[] => {
  if (!vector || !vector.data || !vector.data[0]) {
    return [];
  }

  // Vector의 data 속성에서 실제 값을 추출
  const values = vector.data[0].values;
  if (!values) return [];

  if (Array.isArray(values)) {
    return values.map(value => {
      if (typeof value === 'string') {
        return value.replace(/[\[\]]/g, '');
      }
      return String(value);
    });
  }

  // TypedArray인 경우
  const result: string[] = [];
  for (let i = 0; i < vector.length; i++) {
    const value = vector.get(i);
    if (value) {
      if (typeof value === 'string') {
        result.push(value.replace(/[\[\]]/g, ''));
      } else {
        result.push(String(value));
      }
    }
  }
  return result;
};


const ParquetViewer: React.FC<{
  qaParquetUrl: string;
  chunkParquetUrl: string;
}> = ({ qaParquetUrl, chunkParquetUrl }) => {
  const [qaData, setQaData] = useState<any[]>([]);
  const [chunkData, setChunkData] = useState<Map<string, string>>(new Map());
  const [selectedChunkId, setSelectedChunkId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFromChunk, setSelectedFromChunk] = useState<string | null>(null);

  useEffect(() => {
    const loadParquetData = async () => {
      try {
        setLoading(true);
        
        // Initialize Wasm with CDN URL
        await initWasm("https://cdn.jsdelivr.net/npm/parquet-wasm@0.6.1/esm/parquet_wasm_bg.wasm");

        // A reference to the WebAssembly memory object.
        const WASM_MEMORY1 = wasmMemory();
        const WASM_MEMORY2 = wasmMemory();

        const resp = await fetch("http://localhost:3000/qa.parquet");
        const parquetUint8Array = new Uint8Array(await resp.arrayBuffer());
        const wasmArrowTable = readParquet(parquetUint8Array).intoFFI();

        // Arrow JS table that was directly copied from Wasm memory
        const table1: arrow.Table = parseTable(
          WASM_MEMORY1.buffer,
          wasmArrowTable.arrayAddrs(),
          wasmArrowTable.schemaAddr()
        );

        // Get the table data and schema
        console.log('table1 schema:', table1.schema.fields.map(f => f.name));
        console.log('table1 data:', table1.data);

        // Convert Arrow table to plain objects
        const qaRows = table1.toArray().map(row => ({
          qid: row['qid'],
          question: row['query'],
          answer: row['generation_gt'],
          retrieval_gt: row['retrieval_gt'].toArray()[0],
          // grammar_score: row['grammar_score'],
          // relevance_score: row['relevance_score'],
          // answer_score: row['answer_score'],
        }));

        // // Alternative approach using batches if the above doesn't work
        // if (qaRows.length === 0) {
        //   const batches = table1.batches;
        //   const rows = [];
          
        //   for (const batch of batches) {
        //     for (let i = 0; i < batch.numRows; i++) {
        //       rows.push({
        //         qid: batch.getChild('qid')?.get(i),
        //         question: batch.getChild('query')?.get(i),
        //         answer: batch.getChild('generation_gt')?.get(i),
        //         retrieval_gt: batch.getChild('retrieval_gt')?.get(i),
        //         // grammar_score: batch.getChild('grammar_score')?.get(i),
        //         // relevance_score: batch.getChild('relevance_score')?.get(i),
        //         // answer_score: batch.getChild('answer_score')?.get(i),
        //       });
        //     }
        //   }
          
        //   if (rows.length > 0) {
        //     qaRows.push(...rows);
        //   }
        // }

        console.log('Converted qaRows:', qaRows);
        setQaData(qaRows);
        wasmArrowTable.drop();


        // Load Chunk data


        // A reference to the WebAssembly memory object.

        const resp2 = await fetch("http://localhost:3000/chunk2.parquet");
        const parquetUint8Array2 = new Uint8Array(await resp2.arrayBuffer());
        const wasmArrowTable2 = readParquet(parquetUint8Array2).intoFFI();

        // Arrow JS table that was directly copied from Wasm memory
        const table2: arrow.Table = parseTable(
          WASM_MEMORY2.buffer,
          wasmArrowTable2.arrayAddrs(),
          wasmArrowTable2.schemaAddr()
        );
       
        console.log('chunk table schema:', table2.schema.fields.map(f => f.name));
        console.log('chunk table data:', table2.data);

        // Convert Arrow table to Map
        const chunks = new Map<string, string>();
        const chunkRows = table2.toArray();
        
        for (const row of chunkRows) {
          chunks.set(row['doc_id'], row['contents']);
        }

        // // Alternative approach using batches if chunks is empty
        // if (chunks.size === 0) {
        //   const batches = table2.batches;
        //   const rows = [];
          
        //   for (const batch of batches) {
        //     for (let i = 0; i < batch.numRows; i++) {
        //       const doc_id = batch.getChild('doc_id')?.get(i);
        //       const contents = batch.getChild('contents')?.get(i);
        //       const path = batch.getChild('path')?.get(i);
        //       // const start_end_idx = batch.getChild('start_end_idx')?.get(i);
        //       // const metadata = batch.getChild('metadata')?.get(i);
              
        //       if (doc_id && contents) {
        //         rows.push({
        //           doc_id: doc_id,
        //           contents: contents,
        //           path: path,
        //           // start_end_idx: start_end_idx,
        //           // metadata: metadata
        //         });
        //       }
        //     }
        //   }

        //   if (rows.length > 0) {
        //     chinkRows.push(...rows);
        //   }
          
          if (chunkRows.length > 0) {
            // Convert rows to Map
            chunkRows.forEach(row => {
              chunks.set(row.doc_id, row.contents);
            });
          }
        // }

        console.log('Converted chunks:', chunks);
        setChunkData(chunks);
        wasmArrowTable2.drop();

      } catch (err) {
        throw err;
        // console.error('Error loading parquet data:', err);
        // setError(err instanceof Error ? err.message : 'Failed to load parquet files');
      } finally {
        setLoading(false);
      }
    };

    loadParquetData();
  }, [qaParquetUrl, chunkParquetUrl]);

  const filteredQaData = React.useMemo(() => {
    if (!searchTerm) return qaData;
    const lowercaseSearch = searchTerm.toLowerCase();
    return qaData.filter(row => 
      row.question.toLowerCase().includes(lowercaseSearch) ||
      row.answer.toLowerCase().includes(lowercaseSearch)
    );
  }, [qaData, searchTerm]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-md">
        <h3 className="font-semibold mb-2">Error Loading Data</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* <div className="flex items-center gap-2">
        <Search className="w-4 h-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search questions or answers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        /> */}
      {/* </div> */}

      <div className="grid grid-cols-3 gap-4 h-[calc(100vh-200px)]">
        {/* Questions Column */}
        <div className="border rounded-lg bg-white overflow-hidden flex flex-col">
          <div className="p-3 bg-gray-50 border-b">
            <h3 className="font-semibold">Questions ({filteredQaData.length})</h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredQaData.map((row, index) => (
              <div
                key={index}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                  selectedChunkId === row.retrieval_gt ? 'bg-blue-50' : ''
                }`}
                onClick={() => setSelectedChunkId(row['retrieval_gt'].toArray()[0])} >
                <div className="flex justify-between items-start gap-2">
                  <p className="text-sm">{row.question}</p>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Edit2 className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
                <div className="flex gap-2 mt-2">
                  {row.grammar_score !== null && (
                    <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded">
                      Grammar: {Number(row.grammar_score).toFixed(2)}
                    </span>
                  )}
                  {row.relevance_score !== null && (
                    <span className="text-xs px-2 py-1 bg-green-50 text-green-600 rounded">
                      Relevance: {Number(row.relevance_score).toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Knowledge Chunks Column */}
        <div className="border rounded-lg bg-white overflow-hidden flex flex-col">
          <div className="p-3 bg-gray-50 border-b">
            <h3 className="font-semibold">Knowledge Chunks</h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            {selectedChunkId ? (
              <div className="p-4">
                  <p className="text-xs text-gray-500 mb-2">
                  
                  </p>
                <div className="text-xs text-gray-500 mb-2">
                  Chunk ID: <b>{selectedChunkId}</b> of {chunkData.size} chunks
                </div>
                  <p className="text-sm whitespace-pre-wrap">
                     { Array.from(chunkData.entries()).map(([key, value]) => {
                     const isEqual = String(key) === String(selectedChunkId);
                      return (isEqual) ? (
                        <span key={key}> 
                            <b>{key}</b>: {value}
                        </span>
                      ) : null
                    })}
                  </p>
              </div>
            ) : (
              <div className="p-4 text-gray-500 text-center">
                Select a question to view related chunk
              </div>
            )}
          </div>
        </div>

        {/* Answers Column */}
        <div className="border rounded-lg bg-white overflow-hidden flex flex-col">
          <div className="p-3 bg-gray-50 border-b">
            <h3 className="font-semibold">Answers</h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredQaData.map((row, index) => (
              <div
                key={index}
                className={`p-4 border-b ${
                  selectedChunkId === row.retrieval_gt ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex justify-between items-start gap-2">
                  <p className="text-sm">{row.answer}</p>
                  <div className="flex gap-1">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <Edit2 className="w-4 h-4 text-gray-400" />
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <RotateCw className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
                {row.answer_score !== null && (
                  <div className="mt-2">
                    <span className="text-xs px-2 py-1 bg-purple-50 text-purple-600 rounded">
                      Answer Score: {Number(row.answer_score).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParquetViewer;