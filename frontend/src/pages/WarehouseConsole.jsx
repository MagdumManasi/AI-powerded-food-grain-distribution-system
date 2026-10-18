import React, { useState, useEffect } from 'react';
import api from '../api/client';
import {
  Warehouse,
  Boxes,
  Truck,
  Plus,
  Scale,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  FileText,
  Wheat,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const WarehouseConsole = () => {
  const [dispatches, setDispatches] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDispatchModal, setShowDispatchModal] = useState(false);

  const [formData, setFormData] = useState({
    dispatchCode: 'DISP-1003',
    godownId: 1,
    rationShopId: 1,
    transporterId: 1,
    grainTypeId: 1,
    quantityDispatched: 3000.0,
    vehicleNumber: 'MH-12-PQ-9988',
    driverName: 'Vikram Singh',
    weighbridgeGrossKg: 12250.0,
    weighbridgeTareKg: 9250.0,
  });

  useEffect(() => {
    fetchWarehouseData();
  }, []);

  const fetchWarehouseData = async () => {
    try {
      const [dRes, rRes] = await Promise.all([
        api.get('/dispatch'),
        api.get('/receipts'),
      ]);
      setDispatches(dRes.data.data || []);
      setReceipts(rRes.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDispatch = async (e) => {
    e.preventDefault();
    try {
      await api.post('/dispatch', {
        ...formData,
        status: 'IN_TRANSIT',
      });
      setShowDispatchModal(false);
      fetchWarehouseData();
      alert('Electronic Waybill & Dispatch Manifest generated successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating dispatch order');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Godown Depot Operations Console</h1>
            <span className="badge badge-info text-[10px]">GODOWN ID: GOD-101</span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Central Grain Storage Godown #1 • Sector 18, Industrial Area, Haveli Taluka, Pune
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDispatchModal(true)}
            className="btn btn-primary text-xs shadow"
          >
            <Plus size={16} />
            <span>Generate Dispatch Waybill</span>
          </button>
          <Link to="/inventory" className="btn btn-secondary text-xs">
            <Boxes size={14} className="text-emerald-700" />
            <span>Depot Bins</span>
          </Link>
        </div>
      </div>

      {/* Depot Capacity & Stock Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card border-emerald-200 bg-gradient-to-br from-emerald-50 to-white">
          <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider mb-1">Storage Capacity</div>
          <div className="text-2xl font-black text-slate-900">100.0 MT</div>
          <div className="text-xs text-slate-500 mt-1">100,000 KG Total Silo Volume</div>
        </div>

        <div className="card">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Current Stored Buffer</div>
          <div className="text-2xl font-black text-emerald-800">75.0 MT</div>
          <div className="text-xs text-slate-500 mt-1">75% Capacity Utilized (Normal)</div>
        </div>

        <div className="card">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Rice Silo #1 & #2</div>
          <div className="text-2xl font-black text-slate-900">45,000 KG</div>
          <div className="text-xs text-emerald-700 font-semibold mt-1">Fortified Parboiled Rice</div>
        </div>

        <div className="card">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Wheat Silo #3</div>
          <div className="text-2xl font-black text-amber-700">30,000 KG</div>
          <div className="text-xs text-slate-500 mt-1">Sharbati Grain Reserves</div>
        </div>
      </div>

      {/* Dispatches from this Warehouse */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Truck size={18} className="text-emerald-700" />
              <h2 className="text-base font-extrabold text-slate-900">
                Outbound Grain Dispatches (Godown ➔ Fair Price Shops)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Electronic weighbridge verified truck loadings with electronic seal tracking
            </p>
          </div>
          <button
            onClick={() => setShowDispatchModal(true)}
            className="btn btn-primary btn-sm"
          >
            <Plus size={14} />
            <span>New Outbound Waybill</span>
          </button>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Waybill / Dispatch Code</th>
                <th>Destination FPS</th>
                <th>Commodity</th>
                <th>Dispatched (KG)</th>
                <th>Truck Reg #</th>
                <th>Driver Name</th>
                <th>Departure Time</th>
                <th>Delivery Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {dispatches.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-6 text-slate-400 text-xs">
                    No active dispatches from this facility.
                  </td>
                </tr>
              ) : (
                dispatches.map((d) => (
                  <tr key={d.id} className={d.status === 'PARTIALLY_RECEIVED' ? 'bg-amber-50/50' : ''}>
                    <td className="font-mono text-xs font-bold text-slate-900">{d.dispatchCode}</td>
                    <td className="font-bold text-emerald-900">
                      {d.shopName}
                      <div className="text-[10px] text-slate-400 font-mono">Shop ID: #{d.rationShopId}</div>
                    </td>
                    <td><span className="badge badge-info">{d.grainTypeName}</span></td>
                    <td className="font-black text-slate-900 text-xs">
                      {Number(d.quantityDispatched).toLocaleString()} KG
                    </td>
                    <td className="font-mono text-xs font-bold text-slate-700">{d.vehicleNumber}</td>
                    <td className="text-xs text-slate-600">Vikram Singh</td>
                    <td className="text-xs text-slate-500 font-mono">
                      {d.dispatchDate ? new Date(d.dispatchDate).toLocaleDateString() : 'Active'}
                    </td>
                    <td>
                      <span className={`badge ${
                        d.status === 'DELIVERED'
                          ? 'badge-success'
                          : d.status === 'PARTIALLY_RECEIVED'
                          ? 'badge-danger'
                          : 'badge-warning'
                      }`}>
                        {d.status}
                      </span>
                    </td>
                    <td className="text-right">
                      <Link to={`/ration-shops/${d.rationShopId}`} className="btn btn-secondary btn-sm">
                        View Destination
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Generate Dispatch Waybill */}
      {showDispatchModal && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200 animate-fade-in">
            <div className="pb-2 border-b border-slate-200">
              <h3 className="text-base font-black text-slate-900">Issue Electronic Dispatch Waybill</h3>
              <p className="text-xs text-slate-500">
                Origin: Central Grain Storage Godown #1 (GOD-101) • Certified Weighbridge
              </p>
            </div>

            <form onSubmit={handleCreateDispatch} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Waybill Number
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.dispatchCode}
                    onChange={(e) => setFormData({ ...formData, dispatchCode: e.target.value })}
                    className="form-input text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Destination Fair Price Shop
                  </label>
                  <select
                    value={formData.rationShopId}
                    onChange={(e) => setFormData({ ...formData, rationShopId: Number(e.target.value) })}
                    className="form-input text-xs"
                  >
                    <option value="2">FPS102 - Saraswati Fair Price Store (Hadapsar)</option>
                    <option value="1">FPS101 - Anand Fair Price Store (Pune)</option>
                    <option value="3">FPS103 - Janta Ration Agency (Nashik)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Grain Commodity
                  </label>
                  <select
                    value={formData.grainTypeId}
                    onChange={(e) => setFormData({ ...formData, grainTypeId: Number(e.target.value) })}
                    className="form-input text-xs"
                  >
                    <option value="1">Rice (Fortified Super Fine)</option>
                    <option value="2">Wheat (Sharbati Quality)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Dispatched Net Quantity (KG)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.quantityDispatched}
                    onChange={(e) => setFormData({ ...formData, quantityDispatched: Number(e.target.value) })}
                    className="form-input text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Vehicle Number
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.vehicleNumber}
                    onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                    className="form-input text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Driver / Operator
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.driverName}
                    onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
                    className="form-input text-xs"
                  />
                </div>
              </div>

              {/* Weighbridge Calibration Card */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Scale size={14} className="text-emerald-700" />
                  <span>Depot Weighbridge Automatic Scale Reading</span>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-[11px]">
                  <div>Gross: <strong>14,250 KG</strong></div>
                  <div>Tare: <strong>9,250 KG</strong></div>
                  <div className="text-emerald-800 font-bold">Net: <strong>5,000 KG</strong></div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button type="submit" className="btn btn-primary btn-sm flex-1">
                  Authorize & Issue Waybill
                </button>
                <button
                  type="button"
                  onClick={() => setShowDispatchModal(false)}
                  className="btn btn-secondary btn-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WarehouseConsole;
