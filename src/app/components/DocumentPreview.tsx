import { FileText } from 'lucide-react';
import type { Document } from '../App';

interface DocumentPreviewProps {
  document: Document | null;
}

export function DocumentPreview({ document }: DocumentPreviewProps) {
  if (!document) {
    return (
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 h-full flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex p-4 bg-[#F8FAFC] rounded-full mb-4">
            <FileText className="w-8 h-8 text-[#64748B]" />
          </div>
          <h3 className="text-[#0F172A] mb-2">No Document Selected</h3>
          <p className="text-sm text-[#64748B]">Select a document from the grid below to see its details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] h-full flex flex-col">
      <div className="px-6 py-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#F8FAFC] rounded-lg">
            <FileText className="w-6 h-6 text-[#0F172A]" />
          </div>
          <div>
            <h3 className="text-[#0F172A]">{document.file_name}</h3>
            <p className="text-xs text-[#64748B]">
              {new Date(document.uploaded_at).toLocaleDateString('en-US', {
                month: 'long', day: 'numeric', year: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-auto">
        <p className="text-sm text-[#64748B] leading-relaxed">
          {document.preview || 'No description available for this document.'}
        </p>
      </div>
    </div>
  );
}
