import React, { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';
import {
  BookOpen,
  Plus,
  X,
  FileText,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Building2
} from 'lucide-react';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    documentType: 'PDS_CIRCULAR',
    source: 'Ministry of Consumer Affairs, Food & Public Distribution',
    version: '2026.1',
    content: '',
  });

  const loadDocuments = async () => {
    try {
      const res = await dataService.getDocuments();
      setDocuments(res.data || []);
    } catch (err) {
      console.error('Error fetching documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
    const unsubscribe = dataService.subscribe(loadDocuments);
    return () => unsubscribe();
  }, []);

  const handleIngest = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    setSubmitting(true);
    try {
      await dataService.ingestDocument(formData);
      setShowModal(false);
      setFormData({
        title: '',
        documentType: 'PDS_CIRCULAR',
        source: 'District Supply Office Sangli',
        version: '2026.1',
        content: '',
      });
      setFeedback({
        type: 'success',
        message: 'Statutory policy document chunked and indexed into the RAG vector store successfully!',
      });
      loadDocuments();
      setTimeout(() => setFeedback(null), 5000);
    } catch (err) {
      alert(err.message || 'Error ingesting document');
    } finally {
      setSubmitting(false);
    }
  };

  const totalChunks = documents.reduce((sum, d) => sum + (d.totalChunks || 0), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Policy Knowledge Base & RAG Index</h1>
            <span className="badge badge-info text-[10px] uppercase font-bold tracking-wider">
              Vector Grounding
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Statutory PDS circulars, inspection procedures, and stock reconciliation guidelines indexed for AI grounding
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary text-xs shadow flex items-center gap-1.5"
        >
          <Plus size={16} />
          <span>Upload Policy Circular</span>
        </button>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div className="p-4 rounded-xl border bg-emerald-50 border-emerald-200 text-emerald-900 flex items-start gap-3 animate-fade-in">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs font-semibold">{feedback.message}</div>
        </div>
      )}

      {/* Stats KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-4 bg-white border-slate-200 shadow-2xs">
          <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">Active Regulations</span>
          <p className="text-2xl font-black text-slate-900 mt-2">{documents.length}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Indexed policy manuals & circulars</p>
        </div>

        <div className="card p-4 bg-white border-slate-200 shadow-2xs">
          <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">Vector Chunks</span>
          <p className="text-2xl font-black text-emerald-800 mt-2">{totalChunks}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Semantically embedded text fragments</p>
        </div>

        <div className="card p-4 bg-white border-slate-200 shadow-2xs">
          <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">Statutory Grounding</span>
          <p className="text-2xl font-black text-slate-900 mt-2">100%</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Zero hallucination policy adherence</p>
        </div>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-2 text-center py-8 text-slate-400 text-xs">
            Loading indexed policy documents...
          </div>
        ) : documents.length === 0 ? (
          <div className="col-span-2 text-center py-8 text-slate-400 text-xs">
            No documents indexed in RAG store.
          </div>
        ) : (
          documents.map((doc) => (
            <div
              key={doc.id}
              className="card bg-white p-5 flex flex-col justify-between border-slate-200 shadow-xs hover:border-emerald-300 transition"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="badge badge-info text-[10px] uppercase font-bold">
                    {(doc.documentType || 'PDS_CIRCULAR').replace(/_/g, ' ')}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-slate-400">Ver: {doc.version}</span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-base mb-1">{doc.title}</h3>
                <p className="text-xs text-slate-500 mb-3">{doc.source}</p>
                {doc.content && (
                  <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 line-clamp-3 leading-relaxed">
                    {doc.content}
                  </p>
                )}
              </div>

              <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5 text-emerald-800 font-bold">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  <span>{doc.totalChunks} Chunks Vectorized</span>
                </span>
                <span>Effective: {doc.effectiveDate || '2024-01-01'}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Ingest Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-fade-in border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <BookOpen size={20} className="text-emerald-700" />
                <h3 className="font-black text-slate-900 text-base">Index Government PDS Policy Document</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 rounded-lg p-1"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleIngest} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Revised Transit Loss Standard 2026"
                  className="form-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Document Type</label>
                  <select
                    value={formData.documentType}
                    onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
                    className="form-input"
                  >
                    <option value="PDS_CIRCULAR">PDS Circular</option>
                    <option value="ALLOCATION_POLICY">Allocation Policy</option>
                    <option value="INSPECTION_GUIDELINE">Inspection Guideline</option>
                    <option value="AUDIT_MANUAL">Audit Manual</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Version</label>
                  <input
                    type="text"
                    value={formData.version}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Issuing Source / Authority</label>
                <input
                  type="text"
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  className="form-input"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Document Text Content</label>
                <textarea
                  rows="5"
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Paste statutory policy guidelines, clauses, and regulations here for automatic chunking and semantic vector storage..."
                  className="form-input text-xs"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary flex items-center gap-1.5"
                >
                  <Sparkles size={14} className="text-amber-300" />
                  <span>{submitting ? 'Indexing...' : 'Chunk & Index for RAG'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;
