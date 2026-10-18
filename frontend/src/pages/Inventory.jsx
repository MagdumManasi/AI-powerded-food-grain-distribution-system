import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { Boxes, ArrowRightLeft, Filter, AlertTriangle, X } from 'lucide-react';

const Inventory = () => {
  const [inventories, setInventories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [showTransferModal, setShowTransferModal] = useState(false);

  const [transferForm, setTransferForm] = useState({
    sourceLocationType: 'GODOWN',
    sourceLocationId: 1,
    destinationLocationType: 'RATION_SHOP',
    destinationLocationId: 2,
    grainTypeId: 1,
    quantity: 1000.0,
    remarks: 'Routine allocation balance replenishment',
  });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await api.get('/inventory');
      setInventories(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    try {
      await api.post('/inventory/transfer', transferForm);
      setShowTransferModal(false);
      fetchInventory();
      alert('Stock transferred successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error transferring stock');
    }
  };

  const filtered = inventories.filter((i) => {
    if (typeFilter === 'ALL') return true;
    return i.locationType === typeFilter;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Grain Stock & Inventory Ledger</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Immutable tracking of rice and wheat balances across godowns and fair price shops
          </p>
        </div>
        <button onClick={() => setShowTransferModal(true)} className="btn btn-primary text-xs shadow">
          <ArrowRightLeft size={16} />
          <span>Transfer Stock</span>
        </button>
      </div>

      {/* Filter */}
      <div className="card p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-slate-400" />
          <span className="text-xs font-bold text-slate-700">Filter Location:</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="form-input text-xs w-48"
          >
            <option value="ALL">All Storage Locations</option>
            <option value="GODOWN">Central Godowns Only</option>
            <option value="RATION_SHOP">Fair Price Shops Only</option>
          </select>
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Showing <strong>{filtered.length}</strong> active inventory accounts
        </div>
      </div>

      {/* Inventory Table */}
      <div className="table-container shadow-sm">
        <table>
          <thead>
            <tr>
              <th>Storage Type</th>
              <th>Location Name</th>
              <th>Grain Commodity</th>
              <th>Available Stock</th>
              <th>Min Threshold</th>
              <th>Stock Status</th>
              <th>Last Ledger Update</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="text-center py-8 text-slate-400 text-xs">Loading inventory records...</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-8 text-slate-400 text-xs">No inventory records found.</td>
              </tr>
            ) : (
              filtered.map((inv) => (
                <tr key={inv.id}>
                  <td>
                    <span className={`badge ${inv.locationType === 'GODOWN' ? 'badge-info' : 'badge-warning'}`}>
                      {inv.locationType}
                    </span>
                  </td>
                  <td className="font-extrabold text-slate-900">
                    {inv.locationName}
                    <div className="text-[10px] text-slate-400 font-normal">Location ID: #{inv.locationId}</div>
                  </td>
                  <td>
                    <span className="font-bold text-slate-800">{inv.grainTypeName}</span>
                  </td>
                  <td className="font-black text-slate-900 text-base">
                    {Number(inv.quantity).toLocaleString()} <span className="text-xs text-slate-500 font-normal">KG</span>
                  </td>
                  <td className="text-xs text-slate-500">
                    {inv.minimumThreshold} KG
                  </td>
                  <td>
                    {inv.lowStock ? (
                      <span className="badge badge-danger flex items-center gap-1 w-max">
                        <AlertTriangle size={12} />
                        <span>LOW STOCK</span>
                      </span>
                    ) : (
                      <span className="badge badge-success">SUFFICIENT</span>
                    )}
                  </td>
                  <td className="text-xs text-slate-500">
                    {new Date(inv.lastUpdated).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* TRANSFER MODAL */}
      {showTransferModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-fade-in border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="font-black text-slate-900 text-base">Transfer Grain Stock</h3>
              <button onClick={() => setShowTransferModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleTransfer} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Source Type</label>
                  <select
                    value={transferForm.sourceLocationType}
                    onChange={(e) => setTransferForm({ ...transferForm, sourceLocationType: e.target.value })}
                    className="form-input"
                  >
                    <option value="GODOWN">Central Godown</option>
                    <option value="RATION_SHOP">Ration Shop</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Source ID</label>
                  <input
                    type="number"
                    value={transferForm.sourceLocationId}
                    onChange={(e) => setTransferForm({ ...transferForm, sourceLocationId: parseInt(e.target.value) })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Destination Type</label>
                  <select
                    value={transferForm.destinationLocationType}
                    onChange={(e) => setTransferForm({ ...transferForm, destinationLocationType: e.target.value })}
                    className="form-input"
                  >
                    <option value="RATION_SHOP">Ration Shop</option>
                    <option value="GODOWN">Central Godown</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Destination ID</label>
                  <input
                    type="number"
                    value={transferForm.destinationLocationId}
                    onChange={(e) => setTransferForm({ ...transferForm, destinationLocationId: parseInt(e.target.value) })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Grain Category</label>
                  <select
                    value={transferForm.grainTypeId}
                    onChange={(e) => setTransferForm({ ...transferForm, grainTypeId: parseInt(e.target.value) })}
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
                    value={transferForm.quantity}
                    onChange={(e) => setTransferForm({ ...transferForm, quantity: parseFloat(e.target.value) })}
                    className="form-input"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Transfer Remarks / Order Reference</label>
                <input
                  type="text"
                  value={transferForm.remarks}
                  onChange={(e) => setTransferForm({ ...transferForm, remarks: e.target.value })}
                  placeholder="Government allocation sanction reference"
                  className="form-input"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setShowTransferModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Execute Stock Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
