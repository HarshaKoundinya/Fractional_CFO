import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { DocumentGrid } from './components/DocumentGrid';
import { DocumentPreview } from './components/DocumentPreview';
import { ChatPanel } from './components/ChatPanel';

export interface Document {
  id: string;
  file_name: string;
  file_path: string;
  preview: string;
  uploaded_at: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/documents')
      .then(res => res.json())
      .then(data => setDocuments(data))
      .catch(err => console.error('Failed to load documents:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden p-6 gap-6">
          <div className="flex-1 min-h-0">
            <DocumentPreview document={selectedDocument} />
          </div>

          <div className="flex-shrink-0">
            <DocumentGrid
              documents={documents}
              loading={loading}
              onSelectDocument={setSelectedDocument}
              selectedDocId={selectedDocument?.id}
            />
          </div>
        </div>

        <ChatPanel selectedDocument={selectedDocument} />
      </div>
    </div>
  );
}
