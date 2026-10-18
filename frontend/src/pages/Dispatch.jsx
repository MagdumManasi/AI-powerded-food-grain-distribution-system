import React, { useState, useEffect } from 'react';
import { Truck, Plus, CheckCircle2, AlertTriangle, Eye, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';
import { dataService } from '../services/dataService';

const Dispatch = () => {
  const [dispatches, setDispatches] = useState([]);
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [shops, setShops] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  const [formData, setFormData] = useState({
    dispatchCode: '',
    godownId: 1,
    rationShopId: 1,
    grainTypeId: 1,
    quantityDispatched: 3000.0,
    vehicleNumber: 'MH-10-AZ-5542',
    remarks: 'Fortified grain consignment dispatched from Sangli Central Godown #1',
  });

  const fetchData = async () => {
    try {
      const [dRes, rRes, sRes, wRes] = await Promise.all([
        dataService.getDispatches(),
        dataService.getReceipts(),
        dataService.getFpsShops(),
        dataService.getWarehouses(),
      ]);
      setDispatches(dRes.data || []);
      setReceipts(rRes.data || []);
      setShops(sRes.data || []);
      setWarehouses(wRes.data || []);
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

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await dataService.createDispatch({
        ...formData,
        dispatchCode: formData.dispatchCode || `DISP-SAN-${1000 + dispatches.length + 1}`,
      });
      setShowModal(false);
      alert('Electronic Waybill & Dispatch Manifest issued successfully!');
    } catch (err) {
      alert(err.message || 'Error creating dispatch');
    }
  };

  const receiptsMap = {};
  receipts.forEach((r) => {
    receiptsMap[r.dispatchId] = r;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Shipment Dispatches to Lowest Shops</h1>
            <span className="badge badge-info text-[10px]">SANGLI GRAIN MOVEMENT</span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Electronic weighbridge verified truck manifests from Sangli depots to Bedag and Belanki Fair Price Shops
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn btn-primary text-xs shadow cursor-pointer"
        >
          <Plus size={16} />
          <span>Issue Waybill / Dispatch</span>
        </button>
      </div>

      <div className="table-container shadow-sm">
        <table>
          <thead>
            <tr>
              <th>Waybill Code</th>
              <th>Destination FPS</th>
              <th>Village</th>
              <th>Source Warehouse</th>
              <th>Grain Commodity</th>
              <th>Dispatched (KG)</th>
              <th>Received (KG)</th>
              <th>Transit Shortage</th>
              <th>Carrier Reg #</th>
              <th>Status</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="11" className="text-center py-8 text-slate-400 text-xs">Loading shipment dispatches...</td>
              </tr>
            ) : dispatches.length === 0 ? (
              <tr>
                <td colSpan="11" className="text-center py-8 text-slate-400 text-xs">No dispatch records found.</td>
              </tr>
            ) : (
              dispatches.map((d) => {
                const receivedQty = d.actualQuantityReceived !== null ? d.actualQuantityReceived : (d.status === 'DELIVERED' ? d.quantityDispatched : 'In Transit');
                const shortage = d.shortageQuantity || 0.0;
                const hasShortage = shortage > 0;

                return (
                  <tr key={d.id} className={hasShortage ? 'bg-amber-50/50' : ''}>
                    <td className="font-mono text-xs font-bold text-slate-900">{d.dispatchCode}</td>
                    <td className="font-bold text-emerald-900">
                      {d.destinationShopName}
                      <div className="text-[10px] text-slate-400 font-mono">Code: {d.destinationShopCode}</div>
                    </td>
                    <td><span className="badge badge-info text-[9px]">{d.destinationVillage}</span></td>
                    <td className="text-xs font-semibold text-slate-700">{d.sourceWarehouseName}</td>
                    <td><span className="badge badge-info">{d.grainTypeName}</span></td>
                    <td className="font-black text-slate-900 text-xs">
                      {Number(d.quantityDispatched).toLocaleString()} KG
                    </td>
                    <td className="font-bold text-slate-800 text-xs">
                      {typeof receivedQty === 'number' ? `${Number(receivedQty).toLocaleString()} KG` : receivedQty}
                    </td>
                    <td>
                      {hasShortage ? (
                        <span className="badge badge-danger flex items-center gap-1 w-max">
                          <AlertTriangle size={11} />
                          <span>- {shortage} KG</span>
                        </span>
                      ) : (
                        <span className="badge badge-success">0.0 KG</span>
                      )}
                    </td>
                    <td className="font-mono text-xs text-slate-600">{d.vehicleNumber}</td>
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
                        <Eye size={13} />
                        <span>Inspect FPS</span>
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal: Issue Waybill */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200 animate-fade-in">
            <div className="pb-2 border-b border-slate-200">
              <h3 className="text-base font-black text-slate-900">Issue Electronic Dispatch Waybill</h3>
              <p className="text-xs text-slate-500">
                Outbound food grain movement from Sangli Warehouse to Bedag / Belanki FPS
              </p>
            </div>

            <form onSubmit={handleCreate} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Source Warehouse
                  </label>
                  <select
                    value={formData.godownId}
                    onChange={(e) => setFormData({ ...formData, godownId: Number(e.target.value) })}
                    className="form-input text-xs"
                  >
                    {warehouses.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.warehouseCode} - {w.name}
                      </option>
                    ))}
                  </select>
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
                    {shops.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.shopCode} - {s.shopName} ({s.village})
                      </option>
                    ))}
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
                    <option value="1">Fortified Rice (Raw & Parboiled)</option>
                    <option value="2">Sharbati Quality Wheat Grain</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Dispatched Quantity (KG)
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

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Carrier Vehicle Registration
                </label>
                <input
                  type="text"
                  required
                  value={formData.vehicleNumber}
                  onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                  className="form-input text-xs font-mono"
                />
              </div>

              {/* Weighbridge Scale Card */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Scale size={14} className="text-emerald-700" />
                  <span>Depot Weighbridge Scale Reading</span>
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
                  onClick={() => setShowModal(false)}
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

export default Dispatch;
