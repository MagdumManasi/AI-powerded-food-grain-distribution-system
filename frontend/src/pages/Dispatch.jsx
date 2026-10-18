import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { Truck, Plus, X, Search, CheckCircle2 } from 'lucide-react';

const Dispatch = () => {
  const [dispatches, setDispatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [godowns, setGodowns] = useState([]);
  const [shops, setShops] = useState([]);

  const [formData, setFormData] = useState({
    dispatchCode: '',
    godownId: 1,
    rationShopId: 2,
    transporterId: 1,
    grainTypeId: 1,
    quantityDispatched: 5000.0,
    vehicleNumber: 'MH-12-PQ-9988',
  });

  useEffect(() => {
    fetchDispatches();
    fetchLocations();
  }, []);

  const fetchDispatches = async () => {
    try {
      const res = await api.get('/dispatch');
      setDispatches(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLocations = async () => {
    try {
      const [gRes, sRes] = await Promise.all([
        api.get('/godowns'),
        api.get('/ration-shops'),
      ]);
      setGodowns(gRes.data.data);
      setShops(sRes.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/dispatch', formData);
      setShowModal(false);
      fetchDispatches();
      alert('Dispatch order created! Stock deducted from godown.');
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating dispatch order');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Grain Dispatch & Movement Tracking</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Bulk transit manifests from central storage godowns to authorized fair price shops
          </p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary text-xs shadow">
          <Plus size={16} />
          <span>New Dispatch Order</span>
        </button>
      </div>

      <div className="table-container shadow-sm">
        <table>
          <thead>
            <tr>
              <th>Waybill Code</th>
              <th>Source Godown</th>
              <th>Destination FPS</th>
              <th>Transporter & Vehicle</th>
              <th>Grain Type</th>
              <th>Dispatched (KG)</th>
              <th>Dispatch Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center py-8 text-slate-400 text-xs">Loading shipment dispatches...</td>
              </tr>
            ) : dispatches.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-8 text-slate-400 text-xs">No dispatches recorded.</td>
              </tr>
            ) : (
              dispatches.map((d) => (
                <tr key={d.id}>
                  <td className="font-mono text-xs font-bold text-slate-900">{d.dispatchCode}</td>
                  <td className="font-semibold text-slate-800">{d.godownName}</td>
                  <td className="font-extrabold text-emerald-800">{d.shopName}</td>
                  <td>
                    <div className="text-xs font-bold text-slate-800">{d.transporterName || 'State Carrier'}</div>
                    <div className="font-mono text-[10px] text-slate-400">{d.vehicleNumber}</div>
                  </td>
                  <td><span className="badge badge-info">{d.grainTypeName}</span></td>
                  <td className="font-black text-slate-900 text-sm">
                    {Number(d.quantityDispatched).toLocaleString()} KG
                  </td>
                  <td className="text-xs text-slate-500">{new Date(d.dispatchDate).toLocaleString()}</td>
                  <td>
                    <span className={`badge ${
                      d.status === 'DELIVERED'
                        ? 'badge-success'
                        : d.status === 'PARTIALLY_RECEIVED'
                        ? 'badge-warning'
                        : 'badge-info'
                    }`}>
                      {d.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-fade-in border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="font-black text-slate-900 text-base">Generate Grain Dispatch Manifest</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Waybill / Dispatch Code</label>
                <input
                  type="text"
                  required
                  value={formData.dispatchCode}
                  onChange={(e) => setFormData({ ...formData, dispatchCode: e.target.value })}
                  placeholder="e.g. DISP-1003"
                  className="form-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Source Godown</label>
                  <select
                    value={formData.godownId}
                    onChange={(e) => setFormData({ ...formData, godownId: parseInt(e.target.value) })}
                    className="form-input"
                  >
                    {godowns.map((g) => (
                      <option key={g.id} value={g.id}>{g.godownCode} - {g.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Destination FPS</label>
                  <select
                    value={formData.rationShopId}
                    onChange={(e) => setFormData({ ...formData, rationShopId: parseInt(e.target.value) })}
                    className="form-input"
                  >
                    {shops.map((s) => (
                      <option key={s.id} value={s.id}>{s.shopCode} - {s.shopName}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Grain Category</label>
                  <select
                    value={formData.grainTypeId}
                    onChange={(e) => setFormData({ ...formData, grainTypeId: parseInt(e.target.value) })}
                    className="form-input"
                  >
                    <option value={1}>Rice (Raw/Parboiled)</option>
                    <option value={2}>Wheat (Sharbati)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Quantity (KG)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.quantityDispatched}
                    onChange={(e) => setFormData({ ...formData, quantityDispatched: parseFloat(e.target.value) })}
                    className="form-input"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Transport Vehicle Registration #</label>
                <input
                  type="text"
                  required
                  value={formData.vehicleNumber}
                  onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                  placeholder="e.g. MH-12-AB-1234"
                  className="form-input"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Issue Dispatch Manifest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dispatch;
