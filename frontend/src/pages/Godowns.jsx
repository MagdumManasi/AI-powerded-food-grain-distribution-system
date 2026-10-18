import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { Warehouse, MapPin, Boxes, Plus, X } from 'lucide-react';

const Godowns = () => {
  const [godowns, setGodowns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    godownCode: '',
    name: '',
    location: '',
    district: 'Pune',
    capacity: 100000.0,
    currentStatus: 'ACTIVE',
  });

  useEffect(() => {
    fetchGodowns();
  }, []);

  const fetchGodowns = async () => {
    try {
      const res = await api.get('/godowns');
      setGodowns(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/godowns', formData);
      setShowModal(false);
      fetchGodowns();
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating godown');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Central Grain Storage Godowns</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Bulk procurement depots and regional buffer stock holding facilities
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary text-xs shadow">
          <Plus size={16} />
          <span>Add Godown</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 text-center py-8 text-slate-400 text-xs">Loading storage godowns...</div>
        ) : godowns.length === 0 ? (
          <div className="col-span-3 text-center py-8 text-slate-400 text-xs">No godowns registered.</div>
        ) : (
          godowns.map((g) => (
            <div key={g.id} className="card bg-white p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                    {g.godownCode}
                  </span>
                  <span className="badge badge-success">{g.currentStatus}</span>
                </div>
                <h3 className="font-extrabold text-slate-900 text-base mb-1">{g.name}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 mb-4">
                  <MapPin size={13} className="text-slate-400" />
                  <span>{g.location}, {g.district}</span>
                </p>
              </div>

              <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl text-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500">Holding Capacity</span>
                  <div className="font-black text-emerald-950 text-sm">
                    {Number(g.capacity).toLocaleString()} KG
                  </div>
                </div>
                <Warehouse size={22} className="text-emerald-700" />
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-fade-in border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="font-black text-slate-900 text-base">Register New Storage Godown</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Godown Code</label>
                <input
                  type="text"
                  required
                  value={formData.godownCode}
                  onChange={(e) => setFormData({ ...formData, godownCode: e.target.value })}
                  placeholder="e.g. GOD-103"
                  className="form-input"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Facility Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Regional Buffer Storage Depo"
                  className="form-input"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">District</label>
                  <input
                    type="text"
                    required
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Holding Capacity (KG)</label>
                  <input
                    type="number"
                    required
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseFloat(e.target.value) })}
                    className="form-input"
                  />
                </div>
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Physical Address</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="MIDC Industrial Area, Plot 44"
                  className="form-input"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Godown
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Godowns;
