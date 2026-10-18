import React, { useState } from 'react';
import {
  Truck,
  Scale,
  CheckCircle2,
  Navigation,
  FileText,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { dataService } from '../services/dataService';

const TransporterConsole = () => {
  const [activeDispatchId, setActiveDispatchId] = useState('DISP-SAN-1009');
  const [updating, setUpdating] = useState(false);
  const [updateMsg, setUpdateMsg] = useState('');

  const handleUpdateStatus = async (status, notes) => {
    setUpdating(true);
    try {
      await dataService.updateDispatchStatus(activeDispatchId, status, notes);
      setUpdateMsg(`Shipment status updated to ${status}!`);
      setTimeout(() => setUpdateMsg(''), 3000);
    } catch (err) {
      alert(err.message || 'Error updating status');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Logistics & Fleet Transit Operations</h1>
            <span className="badge badge-warning text-[10px]">VEHICLE: MH-10-AZ-5542</span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Operator: Krishna Valley Agro Logistics • Driver: Arjun Patil (+91 98220 11223)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/dispatch" className="btn btn-secondary text-xs">
            <FileText size={14} />
            <span>Assigned Waybills</span>
          </Link>
          <Link to="/receipts" className="btn btn-primary text-xs shadow">
            <CheckCircle2 size={14} />
            <span>Weighbridge Slips</span>
          </Link>
        </div>
      </div>

      {updateMsg && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-700" />
          <span>{updateMsg}</span>
        </div>
      )}

      {/* Vehicle Status Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Assigned Carrier</div>
          <div className="text-xl font-mono font-black text-slate-900">MH-10-AZ-5542</div>
          <div className="text-xs text-emerald-700 font-semibold mt-1">16-Tonne Commercial Truck • GPS Active</div>
        </div>

        <div className="card">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Flagged Waybill</div>
          <div className="text-xl font-mono font-black text-emerald-800">DISP-SAN-1002</div>
          <div className="text-xs text-slate-500 mt-1">WH-SAN-001 ➔ Bedag Seva Store</div>
        </div>

        <div className="card">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Consigned Grain</div>
          <div className="text-xl font-black text-slate-900">5,000 KG</div>
          <div className="text-xs text-slate-500 mt-1">Fortified Parboiled Rice (100 Bags)</div>
        </div>

        <div className="card border-amber-300 bg-amber-50/50">
          <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wider mb-1">Shortage Flag</div>
          <div className="text-xl font-black text-red-600">- 150.0 KG</div>
          <div className="text-xs text-amber-900 font-bold mt-1">Transit Shortage Recorded (3.0%)</div>
        </div>
      </div>

      {/* Active Trip Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: GPS Route & Checkpoints */}
        <div className="lg:col-span-7 card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Navigation size={18} className="text-emerald-700" />
              <h2 className="text-base font-extrabold text-slate-900">
                Route Milestones: Sangli Central Godown ➔ Bedag Village
              </h2>
            </div>
            <span className="badge badge-danger text-[10px]">SHORTAGE RECORDED</span>
          </div>

          {/* Timeline */}
          <div className="space-y-4 relative pl-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {/* Step 1 */}
            <div className="relative">
              <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center text-white text-[10px]">
                ✓
              </div>
              <div className="text-xs">
                <div className="font-extrabold text-slate-900 flex items-center gap-2">
                  <span>Departure Weighbridge • Sangli Central Godown #1</span>
                  <span className="text-[10px] font-mono text-slate-400">14-Oct 09:30 AM</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Gross: 14,250 KG | Tare: 9,250 KG | <strong>Net Grain: 5,000 KG Dispatched</strong>
                </p>
                <div className="text-[10px] text-emerald-800 font-bold mt-0.5">
                  Electronic Seal ID: #SEAL-SAN-9988-A1 (Verified Intact)
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center text-white text-[10px]">
                ✓
              </div>
              <div className="text-xs">
                <div className="font-extrabold text-slate-900 flex items-center gap-2">
                  <span>Miraj Bypass Toll Checkpoint</span>
                  <span className="text-[10px] font-mono text-slate-400">14-Oct 10:15 AM</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  FastTag RFID confirmed. Truck followed designated Sangli-Miraj-Bedag corridor.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center text-white text-[10px]">
                ✓
              </div>
              <div className="text-xs">
                <div className="font-extrabold text-slate-900 flex items-center gap-2">
                  <span>Arrival at FPS-BED-001 (Bedag Village)</span>
                  <span className="text-[10px] font-mono text-slate-400">14-Oct 11:20 AM</span>
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Bedag Seva Store • Unloading completed in presence of dealer Suresh Patil.
                </p>
              </div>
            </div>

            {/* Step 4: Discrepancy Flag */}
            <div className="relative">
              <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-red-600 border-2 border-white flex items-center justify-center text-white text-[10px]">
                !
              </div>
              <div className="text-xs p-3 rounded-xl bg-red-50 border border-red-200">
                <div className="font-extrabold text-red-900 flex items-center justify-between">
                  <span>Shop Weighment Shortage Flagged</span>
                  <span className="text-[10px] font-mono text-red-700">14-Oct 11:45 AM</span>
                </div>
                <p className="text-[11px] text-red-800 mt-1">
                  Dispatched: <strong>5,000.0 KG</strong> ➔ Received: <strong>4,850.0 KG</strong>. Shortage: <strong>150.0 KG (3.0%)</strong>.
                </p>
                <div className="text-[10px] text-red-700 font-semibold mt-1">
                  Status: DISCREPANCY_FLAGGED • Under statutory review by District Supply Officer Anand Kulkarni.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Electronic Waybill & Consignment Note */}
        <div className="lg:col-span-5 card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-extrabold text-slate-900">Official Electronic Waybill Slip</h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">
              E-WAYBILL #WB-SAN-1002
            </span>
          </div>

          <div className="space-y-2.5 text-xs text-slate-700">
            <div className="flex justify-between border-b border-slate-100 pb-1.5">
              <span className="text-slate-500">Waybill Code:</span>
              <strong className="font-mono text-slate-900">DISP-SAN-1002</strong>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-1.5">
              <span className="text-slate-500">Source Godown:</span>
              <strong>WH-SAN-001 (Sangli Central)</strong>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-1.5">
              <span className="text-slate-500">Destination Shop:</span>
              <strong className="text-emerald-900">FPS-BED-001 (Bedag Village)</strong>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-1.5">
              <span className="text-slate-500">Grain Commodity:</span>
              <span>Fortified Rice (Raw & Parboiled)</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-1.5">
              <span className="text-slate-500">Dispatched Quantity:</span>
              <strong className="font-mono text-slate-900">5,000.0 KG</strong>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-1.5">
              <span className="text-slate-500">Recorded at Bedag Shop:</span>
              <strong className="font-mono text-red-600">4,850.0 KG</strong>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-1.5">
              <span className="text-slate-500">Unaccounted Shortage:</span>
              <strong className="font-mono text-red-700">- 150.0 KG (3.0%)</strong>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
            <div className="font-bold mb-1">Transporter SOP Compliance Note:</div>
            <p className="text-[11px] leading-relaxed">
              Section 1.2 NFSA Transit Norms: Any shortage exceeding 1.0% or 50 KG triggers automated AI Anomaly escalation. Transporter is summoned for calibration audit if electronic seal was intact.
            </p>
          </div>

          <div className="pt-2">
            <Link to="/receipts" className="btn btn-primary btn-sm w-full">
              Inspect Weighbridge Receipts Ledger ➔
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransporterConsole;
