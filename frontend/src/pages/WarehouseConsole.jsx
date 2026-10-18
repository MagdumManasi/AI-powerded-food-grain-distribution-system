import React, { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';
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
  Wheat,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const WarehouseConsole = () => {
  const [dispatches, setDispatches] = useState([]);
  const [warehouse, setWarehouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDispatchModal, setShowDispatchModal] = useState(false);

  const [formData, setFormData] = useState({
    dispatchCode: '',
    godownId: 1,
    rationShopId: 1,
    grainTypeId: 1,
    quantityDispatched: 3000.0,
    vehicleNumber: 'MH-10-AZ-5542',
    driverName: 'Arjun Patil',
    weighbridgeGrossKg: 12250.0,
    weighbridgeTareKg: 9250.0,
  });

  const fetchData = async () => {
    try {
      const [dRes, wRes] = await Promise.all([
        dataService.getDispatches(),
        dataService.getWarehouseById(1),
      ]);
      setDispatches(dRes.data || []);
      setWarehouse(wRes.data || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const unsub = dataService.subscribe(() => fetchData());
    return () => unsub();
  }, []);

  const handleCreateDispatch = async (e) => {
    e.preventDefault();
    try {
      await dataService.createDispatch({
        ...formData,
        dispatchCode: formData.dispatchCode || `DISP-SAN-${1000 + dispatches.length + 1}`,
      });
      setShowDispatchModal(false);
      alert('Electronic Waybill & Dispatch Manifest generated successfully in Sangli Central Ledger!');
    } catch (err) {
      alert(err.message || 'Error creating dispatch order');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Sangli Central Grain Godown #1</h1>
            <span className="badge badge-info text-[10px]">DEPOT CODE: WH-SAN-001</span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Plot 42, Kupwad Industrial Area, Sangli • 100 MT Buffer Depot & Weighbridge Operations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDispatchModal(true)}
            className="btn btn-primary text-xs shadow cursor-pointer"
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
          <div className="text-2xl font-black text-emerald-800">
            {warehouse ? (warehouse.currentStockKg / 1000).toFixed(1) : '78.5'} MT
          </div>
          <div className="text-xs text-slate-500 mt-1">Buffer Utilization: Safe Normal</div>
        </div>

        <div className="card">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Rice Silo Reserve</div>
          <div className="text-2xl font-black text-slate-900">
            {warehouse ? warehouse.riceStockKg.toLocaleString() : '46,500'} KG
          </div>
          <div className="text-xs text-emerald-700 font-semibold mt-1">Fortified Parboiled Rice</div>
        </div>

        <div className="card">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Wheat Silo Reserve</div>
          <div className="text-2xl font-black text-amber-700">
            {warehouse ? warehouse.wheatStockKg.toLocaleString() : '32,000'} KG
          </div>
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
                Outbound Grain Dispatches (WH-SAN-001 ➔ Bedag & Belanki Shops)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Electronic weighbridge verified truck loadings with electronic seal tracking
            </p>
          </div>
          <button
            onClick={() => setShowDispatchModal(true)}
            className="btn btn-primary btn-sm cursor-pointer"
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
                <th>Village</th>
                <th>Commodity</th>
                <th>Dispatched (KG)</th>
                <th>Truck Reg #</th>
                <th>Driver Name</th>
                <th>Status</th>
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
                      {d.destinationShopName}
                      <div className="text-[10px] text-slate-400 font-mono">Code: {d.destinationShopCode}</div>
                    </td>
                    <td>
                      <span className="badge badge-info text-[9px]">{d.destinationVillage}</span>
                    </td>
                    <td><span className="badge badge-info">{d.grainTypeName}</span></td>
                    <td className="font-black text-slate-900 text-xs">
                      {Number(d.quantityDispatched).toLocaleString()} KG
                    </td>
                    <td className="font-mono text-xs font-bold text-slate-700">{d.vehicleNumber}</td>
                    <td className="text-xs text-slate-600">Arjun Patil</td>
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
                      <Link to={`/ration-shops/${d.destinationShopId}`} className="btn btn-secondary btn-sm">
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
                Origin: Sangli Central Grain Godown #1 (WH-SAN-001) • Certified Weighbridge
              </p>
            </div>

            <form onSubmit={handleCreateDispatch} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Destination Fair Price Shop
                  </label>
                  <select
                    value={formData.rationShopId}
                    onChange={(e) => setFormData({ ...formData, rationShopId: Number(e.target.value) })}
                    className="form-input text-xs"
                  >
                    <option value="1">FPS-BED-001 - Bedag Seva Store #1 (Bedag)</option>
                    <option value="2">FPS-BED-002 - Jai Kisan Kendra (Bedag)</option>
                    <option value="3">FPS-BEL-001 - Belanki Sahakari FPS (Belanki)</option>
                    <option value="4">FPS-BEL-002 - Belanki Gramin Kendra (Belanki)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Grain Commodity
                  </label>
                  <select
                    value={formData.grainTypeId}
                    onChange={(e) => setFormData({ ...formData, grainTypeId: Number(e.target.value) })}
                    className="form-input text-xs"
                  >
                    <option value="1">Rice (Fortified Parboiled)</option>
                    <option value="2">Wheat (Sharbati Quality)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
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
              </div>

              {/* Weighbridge Calibration Card */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Scale size={14} className="text-emerald-700" />
                  <span>Kupwad Depot Weighbridge Automatic Scale Reading</span>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-[11px]">
                  <div>Gross: <strong>{(9250 + Number(formData.quantityDispatched || 0)).toLocaleString()} KG</strong></div>
                  <div>Tare: <strong>9,250 KG</strong></div>
                  <div className="text-emerald-800 font-bold">Net: <strong>{Number(formData.quantityDispatched || 0).toLocaleString()} KG</strong></div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button type="submit" className="btn btn-primary btn-sm flex-1 cursor-pointer">
                  Authorize & Issue Waybill
                </button>
                <button
                  type="button"
                  onClick={() => setShowDispatchModal(false)}
                  className="btn btn-secondary btn-sm cursor-pointer"
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
