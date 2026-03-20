import { FileText, Calendar } from 'lucide-react';
import { useState } from 'react';
import type { Document } from '../App';

interface DocumentGridProps {
  documents: Document[];
  loading: boolean;
  onSelectDocument: (doc: Document) => void;
  selectedDocId?: string;
}

export function DocumentGrid({ documents, loading, onSelectDocument, selectedDocId }: DocumentGridProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
      <div className="mb-6">
        <h2 className="text-[#0F172A] mb-1">Document Selector</h2>
        <p className="text-sm text-[#64748B]">Hover to preview · Click Select to analyze</p>
      </div>

      {loading ? (
        <div className="text-center py-8 text-sm text-[#64748B]">Loading documents...</div>
      ) : documents.length === 0 ? (
        <div className="text-center py-8 text-sm text-[#64748B]">No documents found in the database.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className={`relative bg-white border rounded-xl p-4 transition-all hover:shadow-md ${
                selectedDocId === doc.id
                  ? 'border-[#10B981] ring-2 ring-[#10B981] ring-opacity-20'
                  : 'border-[#E2E8F0]'
              }`}
              onMouseEnter={() => setHoveredId(doc.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Hover preview tooltip */}
              {hoveredId === doc.id && doc.preview && (
                <div className="absolute bottom-full left-0 mb-2 w-72 bg-[#0F172A] text-white text-xs rounded-lg p-3 shadow-lg z-10 leading-relaxed">
                  {doc.preview}
                  <div className="absolute top-full left-4 border-4 border-transparent border-t-[#0F172A]" />
                </div>
              )}

              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 bg-[#F8FAFC] rounded-lg">
                  <FileText className="w-5 h-5 text-[#0F172A]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm text-[#0F172A] truncate mb-1">{doc.file_name}</h3>
                  <div className="flex items-center gap-1 text-xs text-[#64748B]">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {new Date(doc.uploaded_at).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onSelectDocument(doc)}
                className="w-full py-2 px-4 bg-[#10B981] hover:bg-[#059669] text-white rounded-lg transition-colors text-sm"
              >
                Select
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
