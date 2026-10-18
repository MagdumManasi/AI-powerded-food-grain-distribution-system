import React, { useState } from 'react';
import { dataService } from '../services/dataService';
import {
  BotMessageSquare,
  Send,
  Sparkles,
  BookOpen,
  User,
  ShieldCheck,
  HelpCircle,
  FileText,
  BadgeCheck
} from 'lucide-react';

const AiAssistant = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Hello Officer. I am GrainGuard AI, your food grain distribution intelligence and policy assistant. I am grounded in Maharashtra PDS circulars, Miraj Taluka inventories, and NFSA transit shortage protocols. How can I assist your vigilance inspection today?",
      sources: [
        { title: 'NFSA Transit Shortage Regulation v2024.1', section: 'Section 1.2: Permissible Moisture & Tare Limits' },
        { title: 'Government Resolution No. PDS-2024/CR-88/CS-21', section: 'Scale of Issue & Issue Rates' },
      ],
      confidence: 0.98,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    'Why does consignment DISP-SAN-1002 show a 150 kg shortage?',
    'What are the statutory entitlement quotas for AAY and PHH cardholders?',
    'Provide an overview of Fair Price Shops in Bedag and Belanki villages.',
    'What does PDS policy say about permissible in-transit tare loss?',
  ];

  const handleSend = async (promptToSend) => {
    const query = promptToSend || input;
    if (!query.trim()) return;

    const userMsg = { role: 'user', content: query };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await dataService.askAiAssistant(query);
      const data = res.data;

      const aiMsg = {
        role: 'assistant',
        content: data.answer,
        sources: data.sources || [],
        confidence: data.confidence || 0.95,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'I encountered an error retrieving data or communicating with the AI service. Please try again.',
          sources: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in max-w-4xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200 shrink-0">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Sparkles size={22} className="text-emerald-700" />
            <span>GrainGuard AI Policy & Inventory Assistant</span>
          </h1>
          <span className="badge badge-info text-[10px] uppercase font-bold tracking-wider">
            Sangli Jurisdiction
          </span>
        </div>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Retrieval-Augmented Generation (RAG) backed by Ministry circulars, SOP manuals, and live transactional databases
        </p>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 shrink-0">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <HelpCircle size={13} />
          Suggested:
        </span>
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="text-xs px-2.5 py-1 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-200 rounded-full whitespace-nowrap transition shadow-2xs font-medium"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex gap-3 text-xs ${
              m.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {m.role === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-emerald-800 text-white flex items-center justify-center shrink-0 shadow-xs">
                <BotMessageSquare size={16} />
              </div>
            )}

            <div
              className={`max-w-2xl p-4 rounded-2xl whitespace-pre-wrap leading-relaxed ${
                m.role === 'user'
                  ? 'bg-emerald-900 text-white font-medium rounded-tr-xs'
                  : 'bg-[#fafaf8] text-slate-800 border border-slate-200 rounded-tl-xs shadow-2xs'
              }`}
            >
              <div>{m.content}</div>

              {/* RAG Source References */}
              {m.sources && m.sources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-200 space-y-1.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <BookOpen size={12} />
                      <span>Grounded Statutory References ({m.sources.length})</span>
                    </span>
                    {m.confidence && (
                      <span className="font-mono text-slate-500">
                        Confidence: {(m.confidence * 100).toFixed(0)}%
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-1.5 text-[11px]">
                    {m.sources.map((s, idx) => (
                      <div key={idx} className="p-2 bg-white rounded-lg border border-slate-200 text-slate-700">
                        <span className="font-bold text-slate-900">[{s.title || s.documentTitle}]</span>
                        {s.section && (
                          <span className="text-slate-600 block mt-0.5">
                            • {s.section}
                          </span>
                        )}
                        {s.snippet && (
                          <span className="text-slate-500 block mt-0.5 italic">
                            "{s.snippet}"
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {m.role === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                <User size={16} />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-500 py-2">
            <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            <span>GrainGuard AI is analyzing Sangli PDS records & statutory circulars...</span>
          </div>
        )}
      </div>

      {/* Chat Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 shrink-0"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about Sangli PDS, DISP-SAN-1002 shortage, Bedag shops, or quota policies..."
          className="form-input flex-1 text-xs py-3"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="btn btn-primary py-3 px-5 text-xs font-bold shadow-md flex items-center gap-1.5"
        >
          <Send size={15} />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
};

export default AiAssistant;
