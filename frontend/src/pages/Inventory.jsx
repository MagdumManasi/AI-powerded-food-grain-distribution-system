import React, { useState, useEffect } from 'react';
import { Boxes, Filter, Wheat, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { dataService } from '../services/dataService';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationTypeFilter, setLocationTypeFilter] = useState('ALL');

  const fetchInventory = async () => {
    try {
      const res = await dataService.getInventory();
      setInventory(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
    const unsub = dataService.subscribe(() => fetchInventory());
    return () => unsub();
  }, []);

  const filtered = inventory.filter((item) => {
    if (locationTypeFilter === 'ALL') return true;
    return item.locationType === locationTypeFilter;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Stock Inventory Ledgers</h1>
            <span className="badge badge-info text-[10px]">SANGLI PDS SUPPLY CHAIN</span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Real-time balance of Fortified Rice and Wheat reserves across central warehouses and village shops
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={locationTypeFilter}
            onChange={(e) => setLocationTypeFilter(e.target.value)}
            className="form-input text-xs"
          >
            <option value="ALL">All Facilities (Warehouses & Shops)</option>
            <option value="GODOWN">Central Warehouses (WH-SAN)</option>
            <option value="RATION_SHOP">Fair Price Shops (Bedag & Belanki)</option>
          </select>
        </div>
      </div>

      <div className="table-container shadow-sm">
        <table>
          <thead>
            <tr>
              <th>Facility Name</th>
              <th>Facility Type</th>
              <th>Grain Commodity</th>
              <th>Opening (KG)</th>
              <th>Inbound (KG)</th>
              <th>Outbound / Disbursed</th>
              <th>Current Balance</th>
              <th>Safety Threshold</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className="text-center py-8 text-slate-400 text-xs">
                  Loading stock ledgers...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-8 text-slate-400 text-xs">
                  No inventory records found.
                </td>
              </tr>
            ) : (
              filtered.map((item) => {
                const isLow = (item.availableStockKg || 0) <= (item.minimumThresholdKg || 0);
                return (
                  <tr key={item.id} className={isLow ? 'bg-amber-50/40' : ''}>
                    <td>
                      <div className="font-extrabold text-slate-900 text-xs">{item.locationName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{item.locationCode}</div>
                    </td>
                    <td>
                      <span className={`badge ${item.locationType === 'GODOWN' ? 'badge-info' : 'badge-success'}`}>
                        {item.locationType === 'GODOWN' ? 'Central Godown' : 'Village FPS'}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <Wheat size={14} className={item.grainTypeId === 1 ? 'text-emerald-700' : 'text-amber-700'} />
                        <span className="font-semibold text-xs">{item.grainTypeName}</span>
                      </div>
                    </td>
                    <td className="font-mono text-xs">{Number(item.openingStockKg).toLocaleString()} KG</td>
                    <td className="font-mono text-xs text-emerald-800 font-semibold">
                      + {Number(item.incomingStockKg || 0).toLocaleString()} KG
                    </td>
                    <td className="font-mono text-xs text-slate-600">
                      - {Number(item.dispatchedStockKg || 0).toLocaleString()} KG
                    </td>
                    <td className="font-black text-slate-900 text-xs font-mono">
                      {Number(item.availableStockKg).toLocaleString()} KG
                    </td>
                    <td className="font-mono text-xs text-slate-500">
                      {Number(item.minimumThresholdKg).toLocaleString()} KG
                    </td>
                    <td>
                      {isLow ? (
                        <span className="badge badge-danger flex items-center gap-1 w-max">
                          <AlertTriangle size={11} />
                          <span>LOW BUFFER</span>
                        </span>
                      ) : (
                        <span className="badge badge-success flex items-center gap-1 w-max">
                          <CheckCircle2 size={11} />
                          <span>NORMAL</span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;
