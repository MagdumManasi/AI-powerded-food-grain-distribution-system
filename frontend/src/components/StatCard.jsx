import React from 'react';

const StatCard = ({ title, value, unit = '', subtitle, icon: Icon, color = 'emerald', alert = false }) => {
  const colorStyles = {
    emerald: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    amber: 'bg-amber-50 text-amber-800 border-amber-200',
    rose: 'bg-rose-50 text-rose-800 border-rose-200',
    sky: 'bg-sky-50 text-sky-800 border-sky-200',
  };

  return (
    <div className={`card bg-white border ${alert ? 'border-amber-400 bg-amber-50/20' : 'border-slate-200'} p-5 flex flex-col justify-between`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">{title}</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900 tracking-tight">{value}</span>
            {unit && <span className="text-xs font-semibold text-slate-500">{unit}</span>}
          </div>
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-xl border ${colorStyles[color] || colorStyles.emerald}`}>
            <Icon size={22} />
          </div>
        )}
      </div>
      {subtitle && (
        <div className="mt-3 text-xs text-slate-500 flex items-center gap-1">
          {subtitle}
        </div>
      )}
    </div>
  );
};

export default StatCard;
