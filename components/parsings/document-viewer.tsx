import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

// PDF.js 워커 설정
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;
https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.worker.min.js
interface DocumentViewerProps {
  file: string | File | Blob;  // PDF 파일 경로 또는 File 객체
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ file }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  const changePage = (offset: number) => {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
  };

  const previousPage = () => {
    if (pageNumber > 1) {
      changePage(-1);
    }
  };

  const nextPage = () => {
    if (numPages && pageNumber < numPages) {
      changePage(1);
    }
  };

  const zoomIn = () => {
    setScale(prevScale => Math.min(prevScale + 0.2, 2.0));
  };

  const zoomOut = () => {
    setScale(prevScale => Math.max(prevScale - 0.2, 0.5));
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <button
            className="p-1 hover:bg-gray-100 rounded"
            disabled={scale <= 0.5}
            onClick={zoomOut}
          >
            <ZoomOut size={20} />
          </button>
          <span className="text-sm">{Math.round(scale * 100)}%</span>
          <button
            className="p-1 hover:bg-gray-100 rounded"
            disabled={scale >= 2.0}
            onClick={zoomIn}
          >
            <ZoomIn size={20} />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="p-1 hover:bg-gray-100 rounded"
            disabled={pageNumber <= 1}
            onClick={previousPage}
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-sm">
            Page {pageNumber} of {numPages || '--'}
          </span>
          <button
            className="p-1 hover:bg-gray-100 rounded"
            disabled={numPages === null || pageNumber >= numPages}
            onClick={nextPage}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="border rounded-lg overflow-auto max-h-[800px] bg-gray-50">
        <Document
          error={
            <div className="flex items-center justify-center h-[800px] text-red-500">
              Failed to load PDF document
            </div>
          }
          file={file}
          loading={
            <div className="flex items-center justify-center h-[800px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
            </div>
          }
          onLoadSuccess={onDocumentLoadSuccess}
        >
          <Page
            pageNumber={pageNumber}
            renderAnnotationLayer={false}
            renderTextLayer={false}
            scale={scale}
          />
        </Document>
      </div>
    </div>
  );
};

export default DocumentViewer;
