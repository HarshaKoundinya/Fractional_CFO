import { Send, Bot, User } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import type { Document } from '../App';

const N8N_WEBHOOK_URL = 'https://c5af-106-51-87-203.ngrok-free.app/webhook/ai-analysze';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
  isLoading?: boolean;
}

interface ChatPanelProps {
  selectedDocument: Document | null;
}

export function ChatPanel({ selectedDocument }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hello! Select a document and ask me anything about it.",
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch extracted text whenever selected document changes
  useEffect(() => {
    if (!selectedDocument) { setExtractedText(''); return; }
    fetch(`/api/documents/${selectedDocument.id}/text`)
      .then(res => res.json())
      .then(data => setExtractedText(data.extracted_text ?? ''))
      .catch(() => setExtractedText(''));
  }, [selectedDocument?.id]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const query = inputValue;
    const loadingId = Date.now().toString();

    setMessages(prev => [
      ...prev,
      {
        id: (Date.now() - 1).toString(),
        type: 'user',
        content: query,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      },
      {
        id: loadingId,
        type: 'ai',
        content: '',
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        isLoading: true,
      },
    ]);
    setInputValue('');

    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({
          sessionId: selectedDocument?.id ?? 'default-session',
          user_query: query,
          document_text: extractedText,
        }),
      });

      const data = await response.json();
      const extractOutput = (obj: unknown): string => {
        if (typeof obj === 'string' && obj.trim() !== '') return obj;
        if (typeof obj === 'object' && obj !== null) {
          if ('output' in obj) {
            const val = (obj as Record<string, unknown>).output;
            if (typeof val === 'string' && val.trim() !== '') return val;
          }
          for (const val of Object.values(obj)) {
            const found = extractOutput(val);
            if (found && found !== 'No response received.') return found;
          }
        }
        return 'No response received.';
      };
      const aiText = extractOutput(data);

      setMessages(prev =>
        prev.map(m => m.id === loadingId ? { ...m, isLoading: false, content: aiText } : m)
      );
    } catch {
      setMessages(prev =>
        prev.map(m =>
          m.id === loadingId
            ? { ...m, isLoading: false, content: 'Failed to reach the AI backend. Please check your n8n webhook.' }
            : m
        )
      );
    }
  };

  return (
    <div className="w-96 bg-white border-l border-[#E2E8F0] h-screen flex flex-col" style={{ minWidth: '384px' }}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#10B981] rounded-lg">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-[#0F172A]">AI Assistant</h3>
            <p className="text-xs text-[#64748B] truncate">
              {selectedDocument ? `Context: ${selectedDocument.file_name}` : 'No document selected'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              message.type === 'user' ? 'bg-[#0F172A]' : 'bg-[#10B981]'
            }`}>
              {message.type === 'user'
                ? <User className="w-4 h-4 text-white" />
                : <Bot className="w-4 h-4 text-white" />
              }
            </div>

            <div className={`flex flex-col ${message.type === 'user' ? 'items-end' : 'items-start'} flex-1`}>
              <div className={`rounded-xl px-4 py-3 max-w-[85%] ${
                message.type === 'user' ? 'bg-[#0F172A] text-white' : 'bg-[#F8FAFC] text-[#0F172A]'
              }`}>
                {message.isLoading ? (
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-[#64748B] rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-[#64748B] rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-[#64748B] rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                )}
              </div>
              <span className="text-xs text-[#64748B] mt-1 px-1">{message.timestamp}</span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-[#E2E8F0]">
        {!selectedDocument && (
          <p className="text-xs text-[#94A3B8] mb-2 text-center">Select a document to enable document-aware queries</p>
        )}
        <div className="flex items-end gap-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
            }}
            placeholder={selectedDocument ? `Ask about ${selectedDocument.file_name}...` : 'Select a document first...'}
            className="flex-1 bg-[#F8FAFC] border border-[#E2E8F0] focus:border-[#10B981] rounded-xl px-4 py-3 resize-none outline-none text-sm text-[#0F172A] placeholder:text-[#94A3B8] transition-colors"
            rows={1}
            style={{ maxHeight: '120px' }}
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="p-3 bg-[#10B981] hover:bg-[#059669] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
