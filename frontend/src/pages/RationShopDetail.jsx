import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Store,
  MapPin,
  Users,
  Wheat,
  AlertTriangle,
  FileCheck2,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Eye,
} from 'lucide-react';
import { dataService } from '../services/dataService';

const RationShopDetail = () => {
  const { id } = useParams();
  const [shop, setShop] = useState(null);
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [dispatches, setDispatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const shopRes = await dataService.getFpsShopById(id);
      const shopData = shopRes.data;
      setShop(shopData);

      if (shopData) {
        const [bRes, dRes] = await Promise.all([
          dataService.getBeneficiaries({ shopCode: shopData.shopCode }),
          dataService.getDispatches({ shopCode: shopData.shopCode }),
        ]);
        setBeneficiaries(bRes.data || []);
        setDispatches(dRes.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-xs font-semibold text-slate-500 animate-pulse">Loading shop audit dossier...</div>
      </div>
    );
  }

  if (!shop) {
    return <div className="p-4 text-center text-sm text-red-600">Fair Price Shop record not found.</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <Link to="/ration-shops" className="btn btn-secondary btn-sm cursor-pointer">
          <ArrowLeft size={14} />
          <span>Back to Shops</span>
        </Link>
        <span className="text-xs text-slate-400">/</span>
        <span className="text-xs font-bold text-slate-600">{shop.shopCode}</span>
      </div>

      {/* Main Dossier Card */}
      <div className="card bg-white p-6 border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Store size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-900">{shop.shopName}</h1>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {shop.shopCode}
                </span>
                <span className="badge badge-info text-[9px]">{shop.village} Village</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Licensee: <strong>{shop.dealerName}</strong> • Phone: {shop.phone}
              </p>
            </div>
          </div>

          {/* Risk Badge */}
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl border flex items-center gap-3 ${
              shop.riskScore > 50 ? 'bg-red-50 border-red-200 text-red-900' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
            }`}>
              {shop.riskScore > 50 ? <ShieldAlert size={24} className="text-red-600" /> : <ShieldCheck size={24} className="text-emerald-600" />}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider">AI Risk Indicator</p>
                <div className="text-xl font-black">{shop.riskScore} / 100</div>
              </div>
            </div>
          </div>
        </div>

        {/* Flagged Reasons */}
        {shop.flaggedReasons && shop.flaggedReasons.length > 0 && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <AlertTriangle size={15} className="text-red-600" />
              <span>Regulatory Findings Triggered by Anomaly Engine:</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] text-red-800 pl-1">
              {shop.flaggedReasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Shop Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-6 text-xs">
          <div>
            <p className="text-slate-400 font-bold uppercase tracking-wider mb-1">Locality & Jurisdiction</p>
            <p className="font-semibold text-slate-800">{shop.address}</p>
            <p className="text-slate-500">{shop.village}, Miraj Taluka, Sangli</p>
          </div>
          <div>
            <p className="text-slate-400 font-bold uppercase tracking-wider mb-1">Enrolled Beneficiaries</p>
            <p className="font-black text-slate-900 text-base">{shop.enrolledCardholders} Families</p>
            <p className="text-slate-500">AAY: {shop.aayCards} | PHH: {shop.phhCards}</p>
          </div>
          <div>
            <p className="text-slate-400 font-bold uppercase tracking-wider mb-1">Fortified Rice Stock</p>
            <p className="font-black text-emerald-800 text-base">{shop.riceStockKg.toLocaleString()} KG</p>
            <p className="text-slate-500">Min Safety Buffer: {shop.minThresholdKg} KG</p>
          </div>
          <div>
            <p className="text-slate-400 font-bold uppercase tracking-wider mb-1">Quality Wheat Stock</p>
            <p className="font-black text-amber-800 text-base">{shop.wheatStockKg.toLocaleString()} KG</p>
            <p className="text-slate-500">Normal Reserve</p>
          </div>
        </div>
      </div>

      {/* Dispatches to this Shop */}
      <div className="card">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
          <h2 className="text-base font-extrabold text-slate-900">Inbound Grain Dispatches (from Sangli Depots)</h2>
          <span className="text-xs text-slate-400 font-bold">{dispatches.length} Shipments</span>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Waybill Code</th>
                <th>Source Warehouse</th>
                <th>Commodity</th>
                <th>Dispatched</th>
                <th>Received</th>
                <th>Transit Shortage</th>
                <th>Carrier #</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {dispatches.map((d) => (
                <tr key={d.id} className={d.shortageQuantity > 0 ? 'bg-amber-50/50' : ''}>
                  <td className="font-mono text-xs font-bold">{d.dispatchCode}</td>
                  <td className="text-xs font-semibold">{d.sourceWarehouseName}</td>
                  <td><span className="badge badge-info">{d.grainTypeName}</span></td>
                  <td className="font-bold text-slate-900 text-xs">{d.quantityDispatched} KG</td>
                  <td className="font-bold text-slate-900 text-xs">
                    {d.actualQuantityReceived !== null ? `${d.actualQuantityReceived} KG` : 'In Transit'}
                  </td>
                  <td>
                    {d.shortageQuantity > 0 ? (
                      <span className="badge badge-danger">- {d.shortageQuantity} KG</span>
                    ) : (
                      <span className="badge badge-success">0 KG</span>
                    )}
                  </td>
                  <td className="font-mono text-xs text-slate-600">{d.vehicleNumber}</td>
                  <td>
                    <span className={`badge ${d.status === 'DELIVERED' ? 'badge-success' : d.status === 'PARTIALLY_RECEIVED' ? 'badge-danger' : 'badge-warning'}`}>
                      {d.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enrolled Beneficiaries under this Shop */}
      <div className="card">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
          <h2 className="text-base font-extrabold text-slate-900">Registered Beneficiaries ({shop.village} Village)</h2>
          <span className="badge badge-info text-[9px]">{beneficiaries.length} Cards Listed</span>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Cardholder Name</th>
                <th>Ration Card #</th>
                <th>Scheme</th>
                <th>Family Size</th>
                <th>Monthly Quota</th>
                <th>Remaining Quota</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {beneficiaries.map((b) => (
                <tr key={b.id}>
                  <td className="font-bold text-slate-900 text-xs">{b.name}</td>
                  <td className="font-mono text-xs text-slate-700">{b.rationCardNumber}</td>
                  <td>
                    <span className={`badge ${b.cardType === 'AAY' ? 'badge-success' : 'badge-warning'}`}>
                      {b.cardType}
                    </span>
                  </td>
                  <td className="text-xs">{b.familySize} Members</td>
                  <td className="text-xs font-bold text-slate-800">
                    {(b.monthlyQuotaRiceKg || 0) + (b.monthlyQuotaWheatKg || 0)} KG
                  </td>
                  <td className="text-xs font-bold text-emerald-800">
                    {(b.remainingRiceKg || 0) + (b.remainingWheatKg || 0)} KG
                  </td>
                  <td className="text-right">
                    <Link to={`/beneficiaries/${b.id}`} className="btn btn-secondary btn-sm">
                      <Eye size={13} />
                      <span>View</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RationShopDetail;
