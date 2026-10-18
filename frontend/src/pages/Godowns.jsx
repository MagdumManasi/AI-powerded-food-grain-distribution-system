import React, { useState, useEffect } from 'react';
import { Warehouse, Plus, Scale, MapPin, Eye, Phone, Mail, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { dataService } from '../services/dataService';

const Godowns = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWarehouses = async () => {
    try {
      const res = await dataService.getWarehouses();
      setWarehouses(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
    const unsub = dataService.subscribe(() => fetchWarehouses());
    return () => unsub();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Grain Storage Godowns & Depots</h1>
            <span className="badge badge-info text-[10px]">SANGLI DISTRICT BUFFER</span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Regional bulk grain storage facilities, silo capacities & weighbridge calibration records
          </p>
        </div>

        <Link to="/warehouse-ops" className="btn btn-primary text-xs shadow cursor-pointer">
          <Warehouse size={14} />
          <span>Depot Operations Console</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 text-center py-8 text-slate-400 text-xs">
            Loading storage warehouses...
          </div>
        ) : (
          warehouses.map((wh) => (
            <div key={wh.id} className="card p-5 border border-slate-200 hover:border-slate-300 transition space-y-4">
              <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center font-black">
                    <Warehouse size={24} />
                  </div>
                  <div>
                    <span className="font-mono text-xs font-black text-slate-900 px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                      {wh.warehouseCode}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 mt-1">{wh.name}</h3>
                  </div>
                </div>
                <span className="badge badge-success text-[10px]">{wh.status}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Total Storage Capacity</span>
                  <div className="text-lg font-black text-slate-900">{(wh.capacityKg / 1000).toFixed(1)} MT</div>
                  <div className="text-[10px] text-slate-500">{wh.capacityKg.toLocaleString()} KG Silo</div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100">
                  <span className="text-[10px] text-emerald-800 uppercase font-bold">Current Stock Level</span>
                  <div className="text-lg font-black text-emerald-950">{(wh.currentStockKg / 1000).toFixed(1)} MT</div>
                  <div className="text-[10px] text-emerald-700">Rice: {(wh.riceStockKg / 1000).toFixed(1)} MT | Wheat: {(wh.wheatStockKg / 1000).toFixed(1)} MT</div>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                <div className="flex items-center gap-1.5">
                  <MapPin size={13} className="text-slate-400 shrink-0" />
                  <span>{wh.address}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone size={13} className="text-slate-400 shrink-0" />
                  <span>Depot Contact: {wh.contactNumber} • Manager: <strong>{wh.managerName}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Scale size={13} className="text-emerald-700 shrink-0" />
                  <span>Weighbridge Status: <strong className="text-emerald-800">{wh.weighbridgeStatus}</strong> (Last check: {wh.lastCalibrationDate})</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Linked Outlets: <strong>{wh.linkedFpsCount} Fair Price Shops</strong>
                </span>
                <Link to="/warehouse-ops" className="btn btn-secondary btn-sm cursor-pointer">
                  <span>Manage Outbound Dispatches</span>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Godowns;
