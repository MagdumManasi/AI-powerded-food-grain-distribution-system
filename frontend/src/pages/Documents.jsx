import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { BookOpen, Plus, X, FileText, CheckCircle2 } from 'lucide-react';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    documentType: 'PDS_CIRCULAR',
    source: 'Ministry of Consumer Affairs, Food & Public Distribution',
    version: '2024.2',
    content: '',
  });

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await api.get('/rag/documents');
      setDocuments(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleIngest = async (e) => {
    e.preventDefault();
    try {
      await api.post('/rag/documents', formData);
      setShowModal(false);
      fetchDocuments();
      alert('Document ingested, chunked, and indexed for RAG vector retrieval!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error ingesting document');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Policy Knowledge Base & RAG Index</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Statutory PDS circulars, inspection procedures, and stock reconciliation guidelines indexed for AI grounding
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary text-xs shadow">
          <Plus size={16} />
          <span>Upload Policy Circular</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-2 text-center py-8 text-slate-400 text-xs">Loading indexed documents...</div>
        ) : documents.length === 0 ? (
          <div className="col-span-2 text-center py-8 text-slate-400 text-xs">No documents indexed in RAG store.</div>
        ) : (
          documents.map((doc) => (
            <div key={doc.id} className="card bg-white p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="badge badge-info">{doc.documentType}</span>
                  <span className="text-[11px] font-mono font-bold text-slate-400">Ver: {doc.version}</span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-base mb-1">{doc.title}</h3>
                <p className="text-xs text-slate-500 mb-3">{doc.source}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1 text-emerald-800 font-bold">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  {doc.totalChunks} Chunks Vectorized
                </span>
                <span>Effective: {doc.effectiveDate}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-fade-in border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="font-black text-slate-900 text-base">Index Government PDS Policy Document</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleIngest} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Revised Transit Loss Standard 2024"
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
                  rows="6"
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Paste statutory policy guidelines, clauses, and regulations here for automatic chunking and semantic vector storage..."
                  className="form-input text-xs"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Chunk & Index for RAG
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
