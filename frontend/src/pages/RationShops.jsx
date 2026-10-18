import React, { useState, useEffect } from 'react';
import { Store, Search, Eye, AlertTriangle, ShieldCheck, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { dataService } from '../services/dataService';

const RationShops = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [villageFilter, setVillageFilter] = useState('ALL');

  const fetchShops = async () => {
    try {
      const res = await dataService.getFpsShops();
      setShops(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
    const unsub = dataService.subscribe(() => fetchShops());
    return () => unsub();
  }, []);

  const filtered = shops.filter((s) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      s.shopName.toLowerCase().includes(q) ||
      s.shopCode.toLowerCase().includes(q) ||
      s.dealerName.toLowerCase().includes(q);

    const matchesVillage = villageFilter === 'ALL' || s.village === villageFilter;

    return matchesSearch && matchesVillage;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Fair Price Shops (FPS) Registry</h1>
            <span className="badge badge-info text-[10px]">SANGLI DISTRICT</span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Village distribution outlets in Bedag & Belanki, Miraj Taluka with risk profile scoring
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute inset-y-0 left-3 my-auto text-slate-400" />
          <input
            type="text"
            placeholder="Search by shop code, dealer, or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input pl-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={villageFilter}
            onChange={(e) => setVillageFilter(e.target.value)}
            className="form-input text-xs w-full sm:w-48"
          >
            <option value="ALL">All Villages (Bedag & Belanki)</option>
            <option value="Bedag">Bedag Village (416410)</option>
            <option value="Belanki">Belanki Village (416418)</option>
          </select>
        </div>
      </div>

      {/* Shops Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 text-center py-8 text-slate-400 text-xs">
            Loading Fair Price Shops in Sangli District...
          </div>
        ) : filtered.length === 0 ? (
          <div className="col-span-2 text-center py-8 text-slate-400 text-xs">
            No shops found matching filter criteria.
          </div>
        ) : (
          filtered.map((shop) => (
            <div
              key={shop.id}
              className={`card p-5 border transition space-y-3 ${
                shop.currentStatus === 'UNDER_REVIEW'
                  ? 'border-red-300 bg-red-50/20 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-black text-slate-900 px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                      {shop.shopCode}
                    </span>
                    <span className="badge badge-info text-[9px]">{shop.village} Village</span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 mt-1">{shop.shopName}</h3>
                </div>

                {shop.currentStatus === 'UNDER_REVIEW' ? (
                  <span className="badge badge-danger text-[10px] flex items-center gap-1">
                    <AlertTriangle size={12} />
                    <span>RISK: {shop.riskScore}</span>
                  </span>
                ) : (
                  <span className="badge badge-success text-[10px] flex items-center gap-1">
                    <ShieldCheck size={12} />
                    <span>RISK: {shop.riskScore}</span>
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Authorized Dealer:</span>
                  <div className="font-bold text-slate-900">{shop.dealerName}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Enrolled Cards:</span>
                  <div className="font-bold text-slate-900">{shop.enrolledCardholders} Families</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Current Rice Stock:</span>
                  <div className="font-black text-emerald-800">{shop.riceStockKg.toLocaleString()} KG</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Current Wheat Stock:</span>
                  <div className="font-black text-amber-800">{shop.wheatStockKg.toLocaleString()} KG</div>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
                <MapPin size={13} className="text-slate-400 shrink-0" />
                <span className="truncate">{shop.address}</span>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className={`badge ${shop.currentStatus === 'UNDER_REVIEW' ? 'badge-danger' : 'badge-success'}`}>
                  {shop.currentStatus.replace(/_/g, ' ')}
                </span>
                <Link to={`/ration-shops/${shop.id}`} className="btn btn-secondary btn-sm cursor-pointer">
                  <Eye size={13} />
                  <span>Inspect Dossier</span>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RationShops;
